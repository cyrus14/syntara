import joblib
import sqlite3
import io
from sklearn.datasets import make_classification

import numpy as np

conn = sqlite3.connect('models.db')
cursor = conn.cursor()

cursor.execute("SELECT model FROM models WHERE name = 'logistic_model'")
model_data = cursor.fetchone()[0]
conn.close()

# Deserialize the model
model = joblib.load(io.BytesIO(model_data))

# Print out model type we are loading
print(model)
