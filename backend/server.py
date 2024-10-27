import numpy as np
import random
from concrete import fhe
from concrete.ml.deployment import FHEModelClient, FHEModelDev, FHEModelServer
from sklearn.feature_selection import SelectKBest, f_classif
from concrete.ml.sklearn import SGDClassifier
from concrete.compiler import check_gpu_available
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
from sklearn.decomposition import PCA



class Server:
    def __init__(self):
        self.models = {}
    
    def recieve_encrypted_data(self, condition, data):
        x = data.iloc[:, :-1].copy()
        y = data.iloc[:, -1].copy().squeeze()
        
        # Step 2: Encode categorical features in x
        for column in x.select_dtypes(include=['object']).columns:
            x[column] = LabelEncoder().fit_transform(x[column])
        
        # Step 3: Encode target variable y if categorical
        if y.dtype == 'object':
            y = LabelEncoder().fit_transform(y)
        x_scaled = MinMaxScaler(feature_range=[-1, 1]).fit_transform(x)
        #eventually make this check firebase
        if condition not in self.models:
            parameters_range = (-1, 1)
            model = SGDClassifier(
                random_state=42,  # Or any fixed seed
                max_iter=5,  # Based on the notebook's parameter
                fit_encrypted=True,
                parameters_range=parameters_range,
                verbose=True
            )
            model.fit(x_scaled, y.squeeze(), fhe="execute", device="cpu")
        
        
    def send_model(self, condition):
        return self.models[condition]
