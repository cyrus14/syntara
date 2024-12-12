import React, { useState } from "react";
import { CONDITIONS } from "../constants";

function SearchSection() {
  const [selectedFile, setSelectedFile] = useState("");

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
        <button className="bg-white text-blue-600 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100 border border-gray-300 transition">
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchSection;
