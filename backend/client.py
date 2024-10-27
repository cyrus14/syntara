import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder

class Client:
    def __init__(self, csv_path, public_key):
        self.data = pd.read_csv(csv_path)
        self.public_key = public_key
        self.model = LogisticRegression(max_iter=1000)

    def preprocess_data(self):
        x = self.data.iloc[:, :-1]
        y = self.data.iloc[:, -1]

        for column in x.columns:
            if x[column].dtype == 'object':
                x[column] = LabelEncoder().fit_transform(x[column])

        if y.dtype == 'object':
            y = LabelEncoder().fit_transform(y)

        return x, y

    def train_model(self):
        x, y = self.preprocess_data()
        self.model.fit(x, y)
        # Flatten the coefficients and scale to integers
        weights = self.model.coef_.flatten()
        scaling_factor = 1000  # Adjust for desired precision
        weights_int = np.round(weights * scaling_factor).astype(np.int64)
        return weights_int

    def encrypt_weights(self):
        weights_int = self.train_model()
        # Encrypt the integer weights using the public key
        encrypted_weights = self.public_key.encrypt(weights_int)
        return encrypted_weights

    def send_encrypted_weights(self):
        return self.encrypt_weights()
