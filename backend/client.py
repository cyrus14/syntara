import pandas as pd
import numpy as np
# from concrete.ml.deployment import FHEModelClient, FHEModelDev, FHEModelServer
# from concrete.ml.sklearn import SGDClassifier
# from sklearn.preprocessing import LabelEncoder


class Client:
    def __init__(self):
        self.data = {}

    def __preprocess_data(self, data):
        
        return data
    
    def upload_data(self, condition, data_frame):
        data = self.__preprocess_data(data_frame)
        self.data[condition] = data

    def send_encrypted_data(self, condition):
        return self.data[condition]
