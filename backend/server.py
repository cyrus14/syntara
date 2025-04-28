from pathlib import Path
from tempfile import TemporaryDirectory
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from concrete.ml.sklearn import SGDClassifier
from concrete.compiler import check_gpu_available
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.decomposition import PCA
from sklearn.metrics import accuracy_score
from concrete.ml.sklearn import SGDClassifier
from client import Client
import sys
import os
from load_fb_model import load_model_from_firebase
from save_fb_model import save_model_to_firebase
from difflib import get_close_matches
import time

ENABLE_FUZZY_MAPPING = True  
ENABLE_MISSING_DATA = True
ENABLE_OUTLIER_HANDLING = True

COLUMN_ALIASES = {
    # heart_disease (standard columns: age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal)
    "Heart Disease": {
        "gender": "sex",
        "chest_pain": "cp",
        "resting_blood_pressure": "trestbps",
        "cholesterol": "chol",
        "fasting_bs": "fbs",
        "ecg_result": "restecg",
        "max_hr": "thalach",
        "exercise_induced_angina": "exang",
        "st_depression": "oldpeak",
        "st_slope": "slope",
        "major_vessels": "ca",
        "thalassemia_test": "thal"
    },
    # als (standard columns: PatientID, AgeYears, Gender, SymptomDurationMonths, MuscleWeaknessScore, FVC_PercentPredicted, UMN_Signs, LMN_Signs, BulbarOnset, ALSFRS_R_Score, Creatinine_mg_dL, DiseaseProgressionRate)
    "ALS": {
        "id": "PatientID",
        "age": "AgeYears",  # only if 'age' is not an input column elsewhere
        "sex": "Gender",
        "duration": "SymptomDurationMonths",
        "weakness": "MuscleWeaknessScore",
        "fvc_percent": "FVC_PercentPredicted",
        "umn": "UMN_Signs",
        "lmn": "LMN_Signs",
        "bulbar": "BulbarOnset",
        "alsfrs": "ALSFRS_R_Score",
        "creatinine": "Creatinine_mg_dL",
        "progression_rate": "DiseaseProgressionRate"
    },
    # fop (PatientID, AgeYears, Gender, ACVR1_MutationPresent, AgeAtOnset, Frequency_HeterotopicOssificationsPerYear, MobilityScore, PainLevel, MalformedGreatToes, FOPSeverityIndex)
    "FOP": {
        "mutation": "ACVR1_MutationPresent",
        "onset_age": "AgeAtOnset",
        "ho_frequency": "Frequency_HeterotopicOssificationsPerYear",
        "mobility": "MobilityScore",
        "pain": "PainLevel",
        "toe_deformity": "MalformedGreatToes",
        "severity_score": "FOPSeverityIndex"
    },
    # gaucher (PatientID, AgeYears, Gender, GBA_MutationPresent, SpleenVolume_mL, LiverVolume_mL, Hemoglobin_g_dL, PlateletCount_x10E9_L, ChitotriosidaseLevel_nmol_h_mL, BoneLesions)
    "Gaucher": {
        "gba_gene_mutation": "GBA_MutationPresent",
        "spleen_size": "SpleenVolume_mL",
        "liver_size": "LiverVolume_mL",
        "hgb": "Hemoglobin_g_dL",
        "platelet_count": "PlateletCount_x10E9_L",
        "chitotriosidase": "ChitotriosidaseLevel_nmol_h_mL",
        "bone_abnormalities": "BoneLesions"
    },
    # kawasaki (PatientID, AgeMonths, Gender, FeverDurationDays, ConjunctivalInjection, OralChanges, Rash, ExtremityChanges, CervicalLymphadenopathy, CRP_mg_dL, ESR_mm_hr, WBC_count_uL, Platelets_count_uL)
    "Kawasaki": {
        "fever_days": "FeverDurationDays",
        "conjunctiva": "ConjunctivalInjection",
        "oral_symptoms": "OralChanges",
        "skin_rash": "Rash",
        "limb_changes": "ExtremityChanges",
        "lymph_nodes": "CervicalLymphadenopathy",
        "crp": "CRP_mg_dL",
        "esr": "ESR_mm_hr",
        "wbc": "WBC_count_uL",
        "plt_count": "Platelets_count_uL"
    }
}

use_gpu_if_available = False
device = "cuda" if use_gpu_if_available and check_gpu_available() else "cpu"
MAX_PARAM = 10.0
MIN_PARAM = -10.0
PARAMETER_RANGE = [MIN_PARAM, MAX_PARAM]
MAX_ITER = 1

class Server:    
    
    def clip_outliers(self, df, lower_percentile=1, upper_percentile=99):
        if ENABLE_OUTLIER_HANDLING:
            print("Clipping outliers in numeric features.")
            for col in df.select_dtypes(include=[np.number]).columns:
                lower = np.percentile(df[col], lower_percentile)
                upper = np.percentile(df[col], upper_percentile)
                df[col] = np.clip(df[col], lower, upper)
        return df


    def scale_to_range(self, data, lower_bound=MIN_PARAM, upper_bound=MAX_PARAM):
        mean = np.mean(data, axis=0)
        std = np.std(data, axis=0)
        count = data.shape[0]
        scaler = StandardScaler()
        data_standardized = scaler.fit_transform(data)

        range_width = upper_bound - lower_bound
        data_scaled = data_standardized * (range_width / 2) + ((upper_bound + lower_bound) / 2)
        return data_scaled, mean, std, count

    def scale_test_to_range(self, data, mean, std, lower_bound=MIN_PARAM, upper_bound=MAX_PARAM):
        mean = np.array(mean)
        std = np.array(std)
        data_standardized  = (data - mean) / std
        range_width = upper_bound - lower_bound
        data_scaled = data_standardized * (range_width / 2) + ((upper_bound + lower_bound) / 2)
        return data_scaled

    def update_mean_variance(self, old_mean, old_std, old_count, new_data):
        new_count = new_data.shape[0]
        new_mean = np.mean(new_data)
        new_variance = np.var(new_data, ddof=0) 
        if old_count is not None:
            total_count = old_count[-1] + new_count
            old_count.append(total_count)
        updated_mean = old_mean + (new_count / total_count) * (new_mean - old_mean)
        updated_variance = (
            (old_count[-1] * (old_std ** 2) + new_count * new_variance) / total_count +
            (old_count[-1] * new_count / total_count**2) * (old_mean - new_mean)**2
        )
        updated_std = np.sqrt(updated_variance)
        return updated_mean, updated_std, old_count

    def get_data_visualization(self, condition):
        _, _, _, _, old_count, old_timestamp = load_model_from_firebase(condition)
        return old_count, old_timestamp
    
    def fuzzy_column_mapping(self, condition, df):
        original_columns = list(df.columns)
        alias_map = COLUMN_ALIASES.get(condition, {})
        alias_keys_lower = {k.lower(): v for k, v in alias_map.items()}
        
        new_columns = {}
        for col in original_columns:
            col_lower = col.lower().strip()
            if col_lower in alias_keys_lower:
                new_columns[col] = alias_keys_lower[col_lower]
            else:
                close = get_close_matches(col_lower, alias_keys_lower.keys(), n=1, cutoff=0.85)
                if close:
                    new_columns[col] = alias_keys_lower[close[0]]
                else:
                    new_columns[col] = col  # fallback to original

        df = df.rename(columns=new_columns)
        return df

    def standardize_columns(self, condition, df):
        return self.fuzzy_column_mapping(condition, df)
    
    def validate_schema(self, df, expected_schema):
        required = set(expected_schema["input_columns"] + [expected_schema["label_column"]])
        missing = required - set(df.columns)
        if missing:
            raise Exception(f"Missing columns: {missing}")
        return True
    
    def handle_missing_data(self, df):
        if ENABLE_MISSING_DATA:
            print("Filling missing data with column means.")
            return df.fillna(df.mean(numeric_only=True))
        else:
            print("Filling missing data with 0.")
            return df.fillna(0)

    def recieve_encrypted_data(self, condition, data, cols):
        try:
            if ENABLE_FUZZY_MAPPING:
                data = self.standardize_columns(condition, data)
                self.validate_schema(data, cols)
                x = data[cols["input_columns"]].copy()
                y = data[cols["label_column"]].copy().squeeze()
            else:
                print("Skipping fuzzy mapping and schema validation")
                x = data.iloc[:, :-1].copy()
                y = data.iloc[:, -1].copy().squeeze()
        except:
            print("Skipping file due to exception")
        
        x = self.handle_missing_data(x) 
        x = self.clip_outliers(x)
        for column in x.select_dtypes(include=['object']).columns:
            x[column] = LabelEncoder().fit_transform(x[column])
        if y.dtype == 'object':
            y = LabelEncoder().fit_transform(y)
        x_scaled, mean, std, current_count = self.scale_to_range(x)
        x_train, x_test, y_train, y_test = train_test_split(x_scaled, y, test_size=0.2, random_state=42)
        
        try:
            weights, bias, old_mean, old_std, old_count, old_timestamp = load_model_from_firebase(condition)
            print(old_count)
            print(old_timestamp)
            model = SGDClassifier(
                random_state=42,  
                max_iter=MAX_ITER, 
                fit_encrypted=True,
                parameters_range=PARAMETER_RANGE,
                verbose=True
            )
            model._q_weights = weights
            model._q_bias = bias
            mean, std, count = self.update_mean_variance(old_mean, old_std, old_count, x_train)
            model.fit(x_train, y_train, fhe="execute", device="cpu")
            y_pred = model.predict(x_test)
            accuracy = accuracy_score(y_test, y_pred)
            print(accuracy)
            model_dump = model.dump_dict()
            weights = model_dump["_q_weights"]
            bias = model_dump["_q_bias"]
            old_timestamp.append(int(time.time()))
            data = (weights, bias, mean, std, count, old_timestamp)
            save_model_to_firebase(data, condition)

        except Exception as e:
            print(e)
            model = SGDClassifier(
                random_state=42, 
                max_iter=MAX_ITER,  
                fit_encrypted=True,
                parameters_range=PARAMETER_RANGE,
                verbose=True
            )
            model.fit(x_train, y_train, fhe="execute", device="cpu")
            y_pred = model.predict(x_test)
            accuracy = accuracy_score(y_test, y_pred)
            print(accuracy)
            model_dump = model.dump_dict()
            weights = model_dump["_q_weights"]
            bias = model_dump["_q_bias"]
            print(weights, bias)
            count = [current_count]
            curr_timestamp = [int(time.time())]
            print(count)
            print(curr_timestamp)
            data = (weights, bias, mean, std, count, curr_timestamp)
            save_model_to_firebase(data, condition)
        
        
    def send_model(self, condition):
        return self.models[condition]

    def generate_prediction_message(self, y_pred, condition, count):
        predictions = list(y_pred)
        mapped_predictions = ["positive" if p == 1 else "negative" for p in y_pred]
        message = "The current model was trained on " + str(count) + " datapoints" + "\n"
        message += "The model made the following predictions for the " + str(condition) + " condition: " + "\n"
        message += str(mapped_predictions) + "\n"

        if len(y_pred) > 1:
            if all(p == 1 for p in predictions):
                message += "All predictions indicate a positive outcome" + "\n"
            elif all(p == 0 for p in predictions):
                message += "All predictions indicate a negative outcome." + "\n"
            else:
                positive_count = predictions.count(1)
                negative_count = predictions.count(0)
                message += f"{positive_count} predictions indicate a positive outcome" + "\n"
                message += f"And {negative_count} indicate a negative outcome " + "\n"

        return message
    
    def predict_data(self, condition, data):
        try:
            weights, bias, mean, std, count, timestamp = load_model_from_firebase(condition)
            model = SGDClassifier(
                random_state=42,  
                max_iter=1,  
                fit_encrypted=True,
                parameters_range=PARAMETER_RANGE,
                verbose=True
            )
            dummy_X = np.random.rand(len(weights)-1, len(weights)) 
            dummy_y = np.random.randint(0, 2, len(weights)-1)  
            model.fit(dummy_X, dummy_y, fhe="execute", device="cpu")
            model._q_weights = weights
            model._q_bias = bias
            x = data.copy()
            for column in x.select_dtypes(include=['object']).columns:
                x[column] = LabelEncoder().fit_transform(x[column])
            x_scaled = self.scale_test_to_range(x, mean, std)
            y_pred = model.predict(x_scaled)
            return self.generate_prediction_message(y_pred, condition, count[-1])
        except Exception as e:
            print(str(e))
            return "Sorry, an error has occured, please try again!"
        