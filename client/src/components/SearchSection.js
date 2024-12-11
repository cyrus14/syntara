import React, { useState, useEffect } from "react";
import { storage, ref, listAll } from "../firebase";
import { CONDITIONS } from "../constants";

function SearchSection() {
  // const [fileNames, setFileNames] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");

  // useEffect(() => {
  //   const fetchFileNames = async () => {
  //     const modelsRef = ref(storage, "Models");
  //     try {
  //       const result = await listAll(modelsRef);
  //       const names = result.items.map((item) => item.name);
  //       setFileNames(names);
  //     } catch (error) {
  //       console.error("Error fetching file names:", error);
  //     }
  //   };

  //   fetchFileNames();
  // }, []);

  return (
    <div id="search-section" className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">View Dataset Insights</h2>
      <div className="flex items-center space-x-4">
        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="" disabled>
            Select a model...
          </option>
          {CONDITIONS.map((condition) => (
            <option value={condition}>{condition}</option>
          ))}
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchSection;
