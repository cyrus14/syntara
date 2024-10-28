# Example on a trained model
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris
import joblib

data = load_iris()
X, y = data.data, data.target
model = LogisticRegression(max_iter=1000)
model.fit(X, y)

# Serialize the model
joblib.dump(model, 'logistic_model.joblib')
