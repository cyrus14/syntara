import os
import io
import joblib
import logging
import firebase_admin
from firebase_admin import credentials, storage
from initialize_firebase import initialize_firebase
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

logging.basicConfig(level=logging.INFO)


def train_and_save_model(model_name):
    try:
        # Train a sample model
        data = load_iris()
        X, y = data.data, data.target
        model = LogisticRegression(max_iter=1000)
        model.fit(X, y)

        # Serialize model to an in-memory byte stream
        model_stream = io.BytesIO()
        joblib.dump(model, model_stream)
        model_stream.seek(0)  # Reset the stream position to the beginning

        # Upload the model to Firebase Cloud Storage
        bucket = storage.bucket()
        blob = bucket.blob(model_name)
        blob.upload_from_file(
            model_stream, content_type="application/octet-stream")
        logging.info(f"Model {model_name} uploaded to Firebase Storage.")

    except Exception as e:
        logging.error(f"Error training or uploading model: {e}")


initialize_firebase()
train_and_save_model('logistic_model_v2.joblib')
