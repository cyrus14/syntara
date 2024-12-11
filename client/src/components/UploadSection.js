import React, { useState, useEffect } from "react";
import axios from "axios";
import { CONDITIONS } from "../constants";

function UploadSection({isUploadLoading, setIsUploadLoading, isPredictLoading}) {
  const [file, setFile] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [feedback, setFeedback] = useState("");
  const [progress, setProgress] = useState(3);

  useEffect(() => {
    let intervalId;
    if (isUploadLoading && progress < 95) {
      // Increment progress slower: for example, every 1 second
      intervalId = setInterval(() => {
        setProgress((prevProgress) => {
          const increment = Math.random();
          return Math.min(prevProgress + increment, 95);
        });
      }, 6000);
    }
    return () => clearInterval(intervalId);
  }, [isUploadLoading, progress]);

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

  const handleUpload = async () => {
    if (!file || !selectedCondition) {
      setFeedback("Please select a file and select a condition.");
      return;
    }

    setProgress(3);
    setIsUploadLoading(true);
    setFeedback("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("condition", selectedCondition);

    try {
      const response = await axios.post(
        "http://localhost:8000/upload-csv",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Once we have the result, quickly move the bar to 100
      setProgress(100);

      // After a short delay to show completion, set the feedback and turn off loading
      setTimeout(() => {
        setIsUploadLoading(false);
        setFeedback(response.data.message);
      }, 500);
    } catch (error) {
      console.error("Error uploading file:", error.response || error.message);
      setProgress(100);
      setTimeout(() => {
        setIsUploadLoading(false);
        setFeedback(
          error.response?.data?.error ||
            "Error uploading file. Please try again."
        );
      }, 500);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Securely Upload Hospital Data</h2>
      <input type="file" onChange={handleFileChange} className="mb-4" />

      <label className="block mb-2 font-semibold">Select Condition:</label>
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

      {/* Hide the Upload button while loading */}
      {!isPredictLoading && !isUploadLoading && (
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      )}

      {/* Loading Bar */}
      {isUploadLoading && (
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
      {feedback && !isUploadLoading && (
        <div
          className={`mt-4 font-semibold ${
            feedback.toLowerCase().includes("success")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}

export default UploadSection;
