from pathlib import Path
from tempfile import TemporaryDirectory
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import random
# from concrete import fhe
# from concrete.ml.deployment import FHEModelClient, FHEModelDev, FHEModelServer
from sklearn.feature_selection import SelectKBest, f_classif
# from concrete.ml.sklearn import SGDClassifier
# from concrete.compiler import check_gpu_available
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
from sklearn.decomposition import PCA
# from concrete.compiler import check_gpu_available
from matplotlib.colors import ListedColormap
from matplotlib.lines import Line2D
from sklearn import datasets
from sklearn.linear_model import SGDClassifier as SklearnSGDClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import MinMaxScaler
# from concrete import fhe
# from concrete.ml.deployment import FHEModelClient, FHEModelDev, FHEModelServer
# from concrete.ml.sklearn import SGDClassifier
from client import Client
import sys
import os
from load_fb_model import load_model_from_firebase
from save_fb_model import save_model_to_firebase

use_gpu_if_available = False
device = "cuda" if use_gpu_if_available and check_gpu_available() else "cpu"
parameter_range = [-10, 10]

class Server:    
    def recieve_encrypted_data(self, condition, data):
        x = data.iloc[:, :-1].copy()
        y = data.iloc[:, -1].copy().squeeze()
        for column in x.select_dtypes(include=['object']).columns:
            x[column] = LabelEncoder().fit_transform(x[column])
        if y.dtype == 'object':
            y = LabelEncoder().fit_transform(y)
        x_scaled = MinMaxScaler(feature_range=parameter_range).fit_transform(x)
        x_train, x_test, y_train, y_test = train_test_split(x_scaled, y, test_size=0.2, random_state=42)
        
        #eventually make this check firebase
        try:
            model = load_model_from_firebase(condition)
            model.fit(x_train, y_train, fhe="execute", device="cpu")
            accuracy = accuracy_score(y_test, y_pred)
            print(accuracy)
            self.plot_predictions(x_test, y_test, y_pred)
            save_model_to_firebase(model, condition)
        except:
            model = SGDClassifier(
                random_state=42,  # Or any fixed seed
                max_iter=20,  # Based on the notebook's parameter
                fit_encrypted=True,
                parameters_range=parameter_range,
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
            data = (weights, bias)
            save_model_to_firebase(data, condition)
        
        
    def send_model(self, condition):
        return self.models[condition]
    
    def predict_data(self, condition, data):
        try:
            weights, bias = load_model_from_firebase(condition)
            model = SGDClassifier(
                random_state=42,  # Or any fixed seed
                max_iter=1,  # Based on the notebook's parameter
                fit_encrypted=True,
                parameters_range=parameter_range,
                verbose=True
            )
            print(weights, bias)
            model._q_weights = weights
            model._q_bias = bias
            print('test')
            x = data.copy()
            for column in x.select_dtypes(include=['object']).columns:
                x[column] = LabelEncoder().fit_transform(x[column])
            print(x)
            pca = PCA(n_components=2)
            x_pca = pca.fit_transform(x)
            print(x_pca)
            x_scaled = MinMaxScaler(feature_range=parameter_range).fit_transform(x_pca)
            print(x_scaled)
            y_pred = model.predict(x_scaled)
            return str(y_pred)
        except Exception as e:
            return str(e)
        