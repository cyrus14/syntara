import sqlite3
import logging
import os

logging.basicConfig(level=logging.INFO)

DB_DIR = os.path.join(os.path.dirname(__file__), 'database')
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models-jobfiles')
os.makedirs(DB_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)


def store_model_in_db(model_file: str, db_file: str, model_name: str):
    model_filepath = os.path.join(MODELS_DIR, model_file)
    db_filepath = os.path.join(DB_DIR, db_file)

    try:
        # Read model file as binary
        with open(model_filepath, 'rb') as file:
            model_data = file.read()

        # Store model in database
        with sqlite3.connect(db_filepath) as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''CREATE TABLE IF NOT EXISTS models (name TEXT PRIMARY KEY, model BLOB)''')
            cursor.execute(
                '''INSERT OR REPLACE INTO models (name, model) VALUES (?, ?)''', (model_name, model_data))
            conn.commit()
            logging.info(
                f"Model {model_name} stored in database {db_file}")
    except Exception as e:
        logging.error(f"Error storing model in database: {e}")


# Test with 'logistic_model.joblib' model in 'models.db' database
store_model_in_db('logistic_model.joblib', 'models.db', 'logistic_model')
