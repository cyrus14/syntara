import React, { useState } from "react";
import axios from "axios";
import { CONDITIONS } from "../constants";

function PredictSection() {
  const [file, setFile] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [feedback, setFeedback] = useState("");
  const [predictionResult, setPredictionResult] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setFeedback("");
    } else {
      setFeedback("Please select a valid CSV file.");
      setFile(null);
    }
  };

  const handlePrediction = async () => {
    if (!file || !selectedCondition) {
      setFeedback("Please select a file and a condition.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("condition", selectedCondition);

    try {
      const response = await axios.post(
        "http://localhost:8000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPredictionResult(response.data.predictions);
      setFeedback("Prediction completed successfully!");
    } catch (error) {
      console.error(
        "Error during prediction:",
        error.response || error.message
      );
      setFeedback(
        error.response?.data?.error ||
          "Error during prediction. Please try again."
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Upload CSV for Predictions</h2>
      <input type="file" onChange={handleFileChange} className="mb-4" />

      {/* Condition Dropdown with Imported Options */}
      <label className="block mb-2 font-semibold">
        Select Condition/Model:
      </label>
      <select
        value={selectedCondition}
        onChange={(e) => setSelectedCondition(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      >
        <option value="" disabled>
          Select a condition...
        </option>
        {CONDITIONS.map((condition) => (
          <option key={condition} value={condition}>
            {condition}
          </option>
        ))}
      </select>

      <button
        onClick={handlePrediction}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Predict
      </button>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`mt-4 font-semibold ${
            feedback.includes("successfully")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Display Prediction Result */}
      {predictionResult && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Prediction Results:</h3>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(predictionResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default PredictSection;
