import logging
import joblib
import sqlite3
import io
import os
from sklearn.datasets import make_classification

logging.basicConfig(level=logging.INFO)

DB_DIR = os.path.join(os.path.dirname(__file__), 'database')
os.makedirs(DB_DIR, exist_ok=True)


def load_model_from_db(db_file: str, model_name: str):
    db_filepath = os.path.join(DB_DIR, db_file)

    try:
        # Connect to database and retrieve model
        with sqlite3.connect(db_filepath) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT model FROM models WHERE name = ?", (model_name,))
            model_data = cursor.fetchone()
            if model_data is None:
                raise ValueError(
                    f"Model '{model_name}' not found in database.")

            # Deserialize model from binary data
            model = joblib.load(io.BytesIO(model_data[0]))
            logging.info(f"Model {model_name} loaded from database.")
            return model
    except Exception as e:
        logging.error(f"Error loading model from database: {e}")
        return None


def refit_model(model, X_new, y_new):
    try:
        model.fit(X_new, y_new)
        logging.info("Model refitted successfully.")
        return model
    except Exception as e:
        logging.error(f"Error refitting model: {e}")
        return None


def save_refitted_model_to_db(model, db_file: str, model_name: str):
    db_filepath = os.path.join(DB_DIR, db_file)

    try:
        # Serialize model to binary and store in database
        model_data = io.BytesIO()
        joblib.dump(model, model_data)
        model_data.seek(0)

        with sqlite3.connect(db_filepath) as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE models SET model = ? WHERE name = ?",
                           (model_data.read(), model_name))
            conn.commit()
            logging.info(f"Refitted model {model_name} updated in database.")
    except Exception as e:
        logging.error(f"Error saving refitted model to database: {e}")


# Sample Execution
model = load_model_from_db('models.db', 'logistic_model')
print(model)
# if model:
#     X_new, y_new = make_classification(
#         n_samples=50, n_features=4, n_classes=3, n_informative=3, random_state=42)
#     model = refit_model(model, X_new, y_new)
#     if model:
#         save_refitted_model_to_db(model, 'models.db', 'logistic_model')
