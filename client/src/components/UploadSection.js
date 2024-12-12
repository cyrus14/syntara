import React, { useState, useEffect } from "react";
import axios from "axios";
import { CONDITIONS } from "../constants";

function UploadSection({
  isUploadLoading,
  setIsUploadLoading,
  isPredictLoading,
}) {
  const [file, setFile] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [feedback, setFeedback] = useState("");
  const [progress, setProgress] = useState(3);

  useEffect(() => {
    let intervalId;
    if (isUploadLoading && progress < 95) {
      intervalId = setInterval(() => {
        setProgress((prevProgress) =>
          Math.min(prevProgress + Math.random(), 95)
        );
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
      setFeedback("Please select a file and a condition.");
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
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setProgress(100);
      setTimeout(() => {
        setIsUploadLoading(false);
        setFeedback(response.data.message);
      }, 500);
    } catch (error) {
      console.error("Error uploading file:", error);
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
    <div className="bg-white bg-opacity-70 backdrop-blur-md p-6 rounded-lg shadow-lg border-2 border-gradient-to-r from-blue-600 to-red-600">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Securely Upload Hospital Data
      </h2>
      <input
        type="file"
        onChange={handleFileChange}
        className="w-full p-3 border border-gray-300 rounded mb-4"
      />
      <label className="block mb-2 font-semibold text-gray-700">
        Select Condition:
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
          onClick={handleUpload}
          className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-4 py-2 rounded shadow hover:opacity-90 transition"
        >
          Upload
        </button>
      )}
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
