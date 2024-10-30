import React, { useState } from "react";
import axios from "axios";

function UploadSection() {
  const [file, setFile] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [feedback, setFeedback] = useState("");

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
          withCredentials: false,
        }
      );
      setFeedback(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error.response || error.message);
      setFeedback(
        error.response?.data?.error || "Error uploading file. Please try again."
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Securely Upload Hospital Data</h2>
      <input type="file" onChange={handleFileChange} className="mb-4" />

      {/* Condition Dropdown with Fixed Options */}
      <label className="block mb-2 font-semibold">Select Condition:</label>
      <select
        value={selectedCondition}
        onChange={(e) => setSelectedCondition(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      >
        <option value="" disabled>
          Select a condition...
        </option>
        <option value="Heart Disease">Heart Disease</option>
        <option value="ALS">ALS</option>
        <option value="FOP">FOP</option>
        <option value="Gaucher">Gaucher</option>
        <option value="Kawasaki">Kawasaki</option>
      </select>

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload
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
    </div>
  );
}

export default UploadSection;
