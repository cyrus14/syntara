import React, { useState, useEffect } from "react";
import axios from "axios";
import { CONDITIONS, BACKEND_URL } from "../constants";

function PredictSection({
  isPredictLoading,
  setIsPredictLoading,
  isUploadLoading,
}) {
  const [file, setFile] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [feedback, setFeedback] = useState("");
  const [predictionResult, setPredictionResult] = useState("");
  const [progress, setProgress] = useState(2);

  useEffect(() => {
    let intervalId;
    if (isPredictLoading && progress < 95) {
      intervalId = setInterval(() => {
        setProgress((prevProgress) =>
          Math.min(prevProgress + Math.random() * 2, 95)
        );
      }, 850);
    }
    return () => clearInterval(intervalId);
  }, [isPredictLoading, progress]);

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

    setProgress(2);
    setIsPredictLoading(true);
    setFeedback("");
    setPredictionResult("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("condition", selectedCondition);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/predict`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setProgress(100);
      setTimeout(() => {
        setIsPredictLoading(false);
        setPredictionResult(response.data.predictions);
        setFeedback("Prediction completed successfully!");
      }, 500);
    } catch (error) {
      console.error("Error during prediction:", error);
      setProgress(100);
      setTimeout(() => {
        setIsPredictLoading(false);
        setFeedback(
          error.response?.data?.error ||
          "Error during prediction. Please try again."
        );
      }, 500);
    }
  };

  return (
    <div className="bg-white bg-opacity-70 backdrop-blur-md p-6 rounded-lg shadow-lg border-2 border-gradient-to-r from-blue-600 to-red-600 mt-8">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Upload CSV for Predictions
      </h2>
      <input
        type="file"
        onChange={handleFileChange}
        className="w-full p-3 border border-gray-300 rounded mb-4"
      />
      <label className="block mb-2 font-semibold text-gray-700">
        Select Condition/Model:
      </label>
      <select
        value={selectedCondition}
        onChange={(e) => setSelectedCondition(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded mb-4"
      >
        <option value="" disabled>
          Select a condition...
        </option>
        {CONDITIONS.map((condition, index) => (
          <option key={index} value={condition}>
            {condition}
          </option>
        ))}
      </select>
      {!isPredictLoading && !isUploadLoading && (
        <button
          onClick={handlePrediction}
          className="bg-white text-blue-600 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100 border border-gray-300 transition"
        >
          Predict
        </button>
      )}
      {isPredictLoading && (
        <div className="w-full bg-gray-200 rounded mt-4">
          <div
            className="bg-blue-600 text-xs font-medium text-white text-center p-0.5 leading-none rounded"
            style={{ width: `${progress}%`, transition: "width 0.5s ease" }}
          >
            {Math.floor(progress)}%
          </div>
        </div>
      )}
      {feedback && !isPredictLoading && (
        <div
          className={`mt-4 font-semibold ${feedback.toLowerCase().includes("success")
            ? "text-green-600"
            : "text-red-600"
            }`}
        >
          {feedback}
        </div>
      )}
      {predictionResult && !isPredictLoading && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Prediction Results:</h3>
          <pre className="bg-gray-100 p-4 rounded w-full whitespace-pre-wrap break-words overflow-x-auto">
            {predictionResult}
          </pre>
        </div>
      )}
    </div>
  );
}

export default PredictSection;
