from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from client import Client
from server import Server
import pandas as pd
from io import StringIO
import json
from initialize_firebase import initialize_firebase
import firebase_admin
from firebase_admin import credentials, firestore, storage
app = Flask(__name__)

CORS(app, origins="*")

s = Server()

@app.route('/upload-csv', methods=['POST'])
def upload_csv():
    with app.app_context():
        try:
            condition = request.form.get("condition")
            if not condition:
                return jsonify({"error": "Condition not selected"}), 400

            if 'file' not in request.files:
                return jsonify({"error": "No file part"}), 400
            file = request.files['file']
            
            if file.filename == '':
                return jsonify({"error": "No selected file"}), 400
            if not file.filename.endswith('.csv'):
                return jsonify({"error": "Only CSV files are allowed"}), 400

            # Read CSV file content without saving it to disk
            csv_data = file.read().decode("utf-8")
            csv_data_io = StringIO(csv_data)
            data_frame = pd.read_csv(csv_data_io)

            s.recieve_encrypted_data(condition, data_frame)

            return jsonify({"message": "File processed successfully with condition: " + condition}), 200
        
        except Exception as e:
            print(f"Exception occurred: {e}")
            return jsonify({"error": str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    condition = request.form.get("condition")
    if not condition:
        return jsonify({"error": "Condition not selected"}), 400

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if not file.filename.endswith('.csv'):
        return jsonify({"error": "Only CSV files are allowed"}), 400

    csv_data = file.read().decode("utf-8")
    csv_data_io = StringIO(csv_data)
    data_frame = pd.read_csv(csv_data_io)
    predictions = s.predict_data(condition, data_frame)
    return jsonify({"predictions": predictions}), 200

@app.route("/data-visualization", methods=["GET"])
def data_visualization():

    # Replace with actual data-fetching logic
    # Data should be dictionary with same formmat as the mock_data
    mock_data = {
        "dates": ["2024-10-01", "2024-10-02", "2024-10-03", "2024-10-04"],
        "values": [100, 200, 150, 300],
    }
    return jsonify(mock_data)

@app.route("/get-admin-emails", methods=["GET"])
def get_admin_emails():
    try:
        print("Fetching admin emails from Firebase Storage...")

        # Reference to the JSON file in Firebase Storage
        bucket = storage.bucket()
        blob = bucket.blob("admins.json")  # Replace with your file path in Storage

        # Download the file content as a string
        file_content = blob.download_as_text()
        print(f"File content fetched: {file_content}")

        # Parse the JSON file
        admin_data = json.loads(file_content)
        print(f"Parsed JSON data: {admin_data}")

        # Extract admin emails (assuming the JSON has a key "emails")
        admin_emails = admin_data.get("emails", [])
        print(f"Extracted admin emails: {admin_emails}")

        return jsonify({"adminEmails": admin_emails}), 200
    except Exception as e:
        print(f"Exception occurred while fetching admin emails: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False, port=8000, threaded=False)
