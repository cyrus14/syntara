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
heart_disease = {
    "input_columns": [
        "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg",
        "thalach", "exang", "oldpeak", "slope", "ca", "thal"
    ],
    "label_column": "target"
}
als = {
    "input_columns": [
        "PatientID", "AgeYears", "Gender", "SymptomDurationMonths", "MuscleWeaknessScore",
        "FVC_PercentPredicted", "UMN_Signs", "LMN_Signs", "BulbarOnset",
        "ALSFRS_R_Score", "Creatinine_mg_dL", "DiseaseProgressionRate"
    ],
    "label_column": "DiagnosedALS"
}
fop = {
    "input_columns": [
        "PatientID", "AgeYears", "Gender", "ACVR1_MutationPresent", "AgeAtOnset",
        "Frequency_HeterotopicOssificationsPerYear", "MobilityScore", "PainLevel",
        "MalformedGreatToes", "FOPSeverityIndex"
    ],
    "label_column": "DiagnosedFOP"
}
gaucher = {
    "input_columns": [
        "PatientID", "AgeYears", "Gender", "GBA_MutationPresent", "SpleenVolume_mL",
        "LiverVolume_mL", "Hemoglobin_g_dL", "PlateletCount_x10E9_L",
        "ChitotriosidaseLevel_nmol_h_mL", "BoneLesions"
    ],
    "label_column": "GaucherDisease"
}
kawasaki = {
    "input_columns": [
        "PatientID", "AgeMonths", "Gender", "FeverDurationDays", "ConjunctivalInjection",
        "OralChanges", "Rash", "ExtremityChanges", "CervicalLymphadenopathy",
        "CRP_mg_dL", "ESR_mm_hr", "WBC_count_uL", "Platelets_count_uL"
    ],
    "label_column": "KawasakiDisease"
}
condition_cols = {"Heart Disease": heart_disease, "ALS": als, "FOP": fop, "Gaucher": gaucher, "Kawasaki": kawasaki}

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

            s.recieve_encrypted_data(condition, data_frame, condition_cols[condition])

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

@app.route("/data-visualization", methods=["POST"])
def data_visualization():
    with app.app_context():
        try:
            condition = request.form.get("condition")
            if not condition:
                return jsonify({"error": "Condition not selected"}), 400
            count, timestamp = s.get_data_visualization(condition)
            return jsonify({"count": count, "timestamp": timestamp}), 200
        
        except Exception as e:
            print(f"Exception occurred: {e}")
            return jsonify({"error": str(e)}), 500

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
