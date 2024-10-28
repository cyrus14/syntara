import sqlite3
import logging

logging.basicConfig(level=logging.INFO)


def store_model_in_db(model_file: str, db_file: str, model_name: str):
    try:
        with open(model_file, 'rb') as file:
            model_data = file.read()

        with sqlite3.connect(db_file) as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''CREATE TABLE IF NOT EXISTS models (name TEXT PRIMARY KEY, model BLOB)''')
            cursor.execute(
                '''INSERT OR REPLACE INTO models (name, model) VALUES (?, ?)''', (model_name, model_data))
            conn.commit()
            logging.info(f"Model {model_name} stored in database {db_file}")
    except Exception as e:
        logging.error(f"Error storing model in database: {e}")


# Test with 'logistic_model.joblib' model in 'models.db' database
store_model_in_db('logistic_model.joblib', 'models.db', 'logistic_model')
