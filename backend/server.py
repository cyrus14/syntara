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
import time

use_gpu_if_available = False
device = "cuda" if use_gpu_if_available and check_gpu_available() else "cpu"
MAX_PARAM = 10.0
MIN_PARAM = -10.0
PARAMETER_RANGE = [MIN_PARAM, MAX_PARAM]
MAX_ITER = 1

class Server:    
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

    def recieve_encrypted_data(self, condition, data):
        x = data.iloc[:, :-1].copy()
        y = data.iloc[:, -1].copy().squeeze()
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
            print("NEW MODEL")
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
        