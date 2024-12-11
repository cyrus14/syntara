import React, { useState, useEffect } from "react";
import axios from "axios";
import { CONDITIONS } from "../constants";

function PredictSection({ isPredictLoading, setIsPredictLoading, isUploadLoading}) {
  const [file, setFile] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [feedback, setFeedback] = useState("");
  const [predictionResult, setPredictionResult] = useState("");
  const [progress, setProgress] = useState(2);

  useEffect(() => {
    let intervalId;
    if (isPredictLoading && progress < 95) {
      // Increment progress slower: e.g., every 1 second
      intervalId = setInterval(() => {
        setProgress((prevProgress) => {
          // Increment by a small random amount, e.g., between 0 and 2
          const increment = Math.random() * 2;
          return Math.min(prevProgress + increment, 95);
        });
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
      const response = await axios.post("http://localhost:8000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Once we have the result, quickly move the bar to 100
      setProgress(100);

      // After a short delay to show completion, set the result and turn off loading
      setTimeout(() => {
        setIsPredictLoading(false);
        setPredictionResult(response.data.predictions);
        setFeedback("Prediction completed successfully!");
      }, 500);
    } catch (error) {
      console.error("Error during prediction:", error.response || error.message);
      setProgress(100);
      setTimeout(() => {
        setIsPredictLoading(false);
        setFeedback(
          error.response?.data?.error || "Error during prediction. Please try again."
        );
      }, 500);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Upload CSV for Predictions</h2>
      <input type="file" onChange={handleFileChange} className="mb-4" />

      <label className="block mb-2 font-semibold">Select Condition/Model:</label>
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

      {/* Hide the button while loading */}
      {!isPredictLoading && !isUploadLoading && (
        <button
          onClick={handlePrediction}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Predict
        </button>
      )}

      {/* Loading Bar */}
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

      {/* Feedback Message */}
      {feedback && !isPredictLoading && (
        <div
          className={`mt-4 font-semibold ${
            feedback.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Display Prediction Result */}
      {predictionResult && !isPredictLoading && (
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
