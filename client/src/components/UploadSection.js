import React, { useState } from "react";
import { storage, ref, uploadBytesResumable } from "../firebase";

function UploadSection() {
  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState("ALSData");
  const [progress, setProgress] = useState(0);
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

  const handleUpload = () => {
    if (!file) {
      setFeedback("No file selected. Please choose a CSV file.");
      return;
    }

    // Reference to the file in Firebase Storage
    const storageRef = ref(storage, `${folder}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Reset feedback and progress
    setProgress(0);
    setFeedback("");

    // Track the upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(percent.toFixed(2));
      },
      (error) => {
        console.error("Upload failed:", error);
        setFeedback("Upload failed. Please try again.");
      },
      () => {
        setFeedback("File uploaded successfully!");
        setFile(null); // Clear file input
        setProgress(0); // Reset progress
      }
    );
  };

  return (
    <div
      id="upload-section"
      className="container mx-auto px-4 py-8 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Securely Upload Hospital Data</h2>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <label className="block mb-2 font-semibold">Select Folder:</label>
      <select
        value={folder}
        onChange={(e) => setFolder(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      >
        <option value="ALSData">ALS Data</option>
        <option value="FOPData">FOP Data</option>
        <option value="GaucherData">Gaucher Disease Data</option>
        <option value="KawasakiData">Kawasaki Disease Data</option>
        <option value="NiemannData">Niemann-Pick Disease Data</option>
      </select>
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload
      </button>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 overflow-hidden">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%`, transition: "width 0.1s" }}
          ></div>
        </div>
      )}

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
