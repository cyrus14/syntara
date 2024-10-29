from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris
from regression import model
import joblib
import logging
import importlib
import os

logging.basicConfig(level=logging.INFO)

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(MODELS_DIR, exist_ok=True)


def train_and_save_model(model_filename, saved_model_filename: str):
    filepath = os.path.join(MODELS_DIR, saved_model_filename)

    try:
        module = importlib.import_module(model_filename)
        model = getattr(module, 'model')
    except (ModuleNotFoundError, AttributeError) as e:
        logging.error(f"Error importing model: {e}")
        return

    try:
        data = load_iris()
        X, y = data.data, data.target
        model.fit(X, y)

        joblib.dump(model, filepath)
        logging.info(f"Model trained and saved to {saved_model_filename}")
    except Exception as e:
        logging.error(f"Error training or saving model: {e}")


# Test with saving to 'logistic_model.joblib'
train_and_save_model('regression', 'logistic_model.joblib')
