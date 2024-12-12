import React, { useState } from "react";
import axios from "axios";
import { CONDITIONS } from "../constants";

function SearchSection() {
  const [selectedFile, setSelectedFile] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a condition.");
      return;
    }

    try {
      setErrorMessage("");

      const formData = new FormData();
      formData.append("condition", selectedFile);

      const response = await axios.post(
        "http://localhost:8000/data-visualization",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { count, timestamp } = response.data;

    } catch (error) {
      console.error("Error uploading file:", error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.error || "An error occurred while fetching data."
      );
    }
  };

  return (
    <div className="bg-white bg-opacity-70 backdrop-blur-md p-6 rounded-lg shadow-lg border-2 border-gradient-to-r from-blue-600 to-red-600">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        View Dataset Insights
      </h2>
      <div className="flex items-center space-x-4">
        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
        >
          <option value="" disabled>
            Select a model...
          </option>
          {CONDITIONS.map((condition, index) => (
            <option key={index} value={condition}>
              {condition}
            </option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-4 py-2 rounded shadow hover:opacity-90 transition"
          >
          Search
        </button>
      </div>
      {errorMessage && (
        <p className="text-red-500 mt-4">{errorMessage}</p>
      )}
      
    </div>
  );
}

export default SearchSection;
