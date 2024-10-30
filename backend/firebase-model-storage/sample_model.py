# pretrained_model.py
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris

# Load data and train a sample model (this simulates a pre-trained model)
data = load_iris()
X, y = data.data, data.target
pretrained_model = LogisticRegression(max_iter=1000)
pretrained_model.fit(X, y)
