import pandas as pd
import numpy as np
from concrete.ml.deployment import FHEModelClient, FHEModelDev, FHEModelServer
from concrete.ml.sklearn import SGDClassifier
from sklearn.preprocessing import LabelEncoder


class Client:
    def __init__(self):
        self.data = {}

    def __preprocess_data(self, data):
        return data
    
    def upload_data(self, condition, csv_path):
        data = self.__preprocess_data(pd.read_csv(csv_path))
        self.data[condition] = data

    def send_encrypted_data(self, condition):
        return self.data[condition]
