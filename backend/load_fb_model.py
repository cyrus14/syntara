from firebase_admin import credentials, storage
from initialize_firebase import initialize_firebase
import joblib
import io
import logging

logging.basicConfig(level=logging.INFO)


def load_model_from_firebase(model_name):
    try:
        bucket = storage.bucket()
        blob = bucket.blob(model_name)
        model_stream = io.BytesIO()
        blob.download_to_file(model_stream)
        model_stream.seek(0)  # Reset the stream position to the beginning

        model = joblib.load(model_stream)
        logging.info(f"Model {model_name} loaded from Firebase Storage.")
        return model
    except Exception as e:
        logging.error(f"Error loading model from Firebase: {e}")
        return None
