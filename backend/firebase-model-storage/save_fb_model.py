import io
import joblib
import logging
import firebase_admin
from firebase_admin import storage
from initialize_firebase import initialize_firebase
from sample_model import pretrained_model

logging.basicConfig(level=logging.INFO)


def save_model_to_firebase(model, model_name):
    try:
        # Serialize model to an in-memory byte stream
        model_stream = io.BytesIO()
        joblib.dump(model, model_stream)
        model_stream.seek(0)

        bucket = storage.bucket()
        blob = bucket.blob(model_name)
        blob.upload_from_file(
            model_stream, content_type="application/octet-stream")
        logging.info(f"Model {model_name} uploaded to Firebase Storage.")
    except Exception as e:
        logging.error(f"Error uploading model to Firebase: {e}")


initialize_firebase()
save_model_to_firebase(pretrained_model, 'sample_model.joblib')
