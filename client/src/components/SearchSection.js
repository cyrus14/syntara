import React, { useState } from "react";
import { CONDITIONS } from "../constants";

function SearchSection() {
  const [selectedFile, setSelectedFile] = useState("");

  return (
    <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        View Dataset Insights
      </h2>
      <div className="flex items-center space-x-4">
        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
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
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchSection;
