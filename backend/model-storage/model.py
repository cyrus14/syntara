from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris
import joblib
import logging

logging.basicConfig(level=logging.INFO)


def train_and_save_model(filename: str):
    try:
        data = load_iris()
        X, y = data.data, data.target
        model = LogisticRegression(max_iter=1000)
        model.fit(X, y)

        joblib.dump(model, filename)
        logging.info(f"Model trained and saved to {filename}")
    except Exception as e:
        logging.error(f"Error training or saving model: {e}")


# Test with saving to 'logistic_model.joblib'
train_and_save_model('logistic_model.joblib')
