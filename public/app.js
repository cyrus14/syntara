// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { firebaseConfig } from "./config.js"; // Import config from config.js

// Function to get CSV files from a folder and combine them into a dictionary
async function fetchAndCombineCSVFiles(folderName) {
  const folderRef = ref(storage, folderName); // Reference to the folder
  const fileList = await listAll(folderRef); // List all files in the folder

  let combinedData = {}; // Dictionary to store combined data

  for (let itemRef of fileList.items) {
    const fileUrl = await getDownloadURL(itemRef); // Get download URL for each file
    const fileResponse = await fetch(fileUrl); // Fetch the file contents
    const csvText = await fileResponse.text(); // Read CSV content as text
    const parsedData = parseCSV(csvText); // Parse CSV content
    combinedData = { ...combinedData, ...parsedData }; // Combine parsed data
  }

  return combinedData;
}

// CSV parser function (basic)
function parseCSV(csvText) {
  const rows = csvText.split("\n");
  const header = rows[0].split(",");
  const data = {};

  for (let i = 1; i < rows.length; i++) {
    const values = rows[i].split(",");
    const entry = {};
    header.forEach((key, index) => {
      entry[key] = values[index];
    });
    data[i - 1] = entry; // Add row data to dictionary
  }

  return data;
}

// Example usage: Fetching and combining CSV files from the ALSData folder
fetchAndCombineCSVFiles("ALSData")
  .then((combinedData) => {
    console.log("Combined Data:", combinedData);
  })
  .catch((error) => {
    console.error("Error fetching CSV files:", error);
  });

// Function to get file names from the Models folder
async function getFilesFromModelsFolder() {
  const modelsFolderRef = ref(storage, "Models"); // Reference to the Models folder

  try {
    const result = await listAll(modelsFolderRef);
    const fileNames = result.items.map((itemRef) => itemRef.name); // Get the names of the files
    return fileNames; // Return the file names as an array
  } catch (error) {
    console.error("Error listing files:", error);
    return [];
  }
}

// UI Elements for search
const searchInput = document.getElementById("search-input"); // Search input field
const searchResults = document.createElement("div"); // Element for showing search results
searchResults.classList.add(
  "absolute",
  "bg-white",
  "border",
  "w-full",
  "mt-10",
  "z-10"
);

// Insert searchResults into DOM after the searchInput field
searchInput.parentNode.appendChild(searchResults);

// Event listener for search input
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.toLowerCase();

  // If the search input is empty, clear the results and hide the dropdown
  if (query === "") {
    searchResults.innerHTML = "";
    searchResults.classList.add("hidden");
    return; // Exit early if no query
  }

  const fileNames = await getFilesFromModelsFolder(); // Get file names from Firebase Storage
  const filteredFiles = fileNames.filter((file) =>
    file.toLowerCase().includes(query)
  ); // Filter the results based on user input

  // Clear previous search results
  searchResults.innerHTML = "";

  // Populate the search results dropdown
  filteredFiles.forEach((fileName) => {
    const resultItem = document.createElement("div");
    resultItem.classList.add("search-result-item", "p-2", "cursor-pointer"); // Add some styling
    resultItem.textContent = fileName.replace(".jpg", ""); // Display name without extension
    searchResults.appendChild(resultItem);

    // Handle click on a result
    resultItem.addEventListener("click", () => {
      searchInput.value = fileName.replace(".jpg", ""); // Set the search input to the selected file name
      searchResults.innerHTML = ""; // Clear the results list
    });
  });

  // If there are no results, hide the search results container
  if (filteredFiles.length === 0) {
    searchResults.classList.add("hidden");
  } else {
    searchResults.classList.remove("hidden");
  }
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize Google Auth Provider
const provider = new GoogleAuthProvider();

// UI Elements
const googleSignInBtn = document.getElementById("google-signin-btn");
const profilePic = document.getElementById("profile-pic");
const fileInput = document.getElementById("file-input");
const folderSelect = document.getElementById("folder-select"); // Reference to the folder select dropdown
const uploadBtn = document.getElementById("upload-btn");
const welcomeMessage = document.getElementById("welcome-message");
const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");
const feedbackMessage = document.getElementById("feedback-message");
const uploadSection = document.getElementById("upload-section"); // Reference to the upload section
const adminBadge = document.getElementById("admin-badge");
const searchSection = document.getElementById("search-section"); // Reference to the search section
const welcomeSection = document.getElementById("welcome-section"); // Reference to the welcome section
const getStartedBtn = document.getElementById("get-started-btn");
const combineCSVBtn = document.getElementById("combine-csv-btn");

const ADMIN_LIST = [
  "cri23@cornell.edu",
  "rvv6@cornell.edu",
  "rcs353@cornell.edu",
  "asl256@cornell.edu",
]; // List of admin emails

// Handle Authentication State Changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    googleSignInBtn.classList.add("hidden");
    profilePic.classList.remove("hidden");
    searchSection.classList.remove("hidden"); // Show the search section
    welcomeSection.classList.add("hidden"); // Hide the welcome section

    // Update profile picture
    profilePic.src = user.photoURL;

    // Display welcome message (optional)
    welcomeMessage.textContent = `Welcome, ${user.displayName}`;

    // Check if the user's email is in the ADMIT_LIST
    if (ADMIN_LIST.includes(user.email)) {
      adminBadge.classList.remove("hidden"); // Show the admin badge
      uploadSection.classList.remove("hidden"); // Show the upload section
    } else {
      adminBadge.classList.add("hidden"); // Hide the admin badge
      uploadSection;
    }
  } else {
    // User is signed out
    googleSignInBtn.classList.remove("hidden");
    profilePic.classList.add("hidden");
    uploadSection.classList.add("hidden"); // Hide the upload section
    searchSection.classList.add("hidden"); // Hide the search section
    welcomeSection.classList.remove("hidden"); // Show the welcome section

    // Clear profile picture
    profilePic.src = "";

    // Clear welcome message
    welcomeMessage.textContent = "";

    adminBadge.classList.add("hidden"); // Hide the admin badge
  }
});

// Google Sign-In Functionality
googleSignInBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // User signed in successfully
      // UI updates are handled by onAuthStateChanged observer
    })
    .catch((error) => {
      console.error(error);
    });
});

getStartedBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // User signed in successfully
      // UI updates are handled by onAuthStateChanged observer
    })
    .catch((error) => {
      console.error(error);
    });
});

// Logout Functionality via Profile Picture Click
profilePic.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // User signed out successfully
      // UI updates are handled by onAuthStateChanged observer
    })
    .catch((error) => {
      console.error(error);
    });
});

// Upload File Functionality
uploadBtn.addEventListener("click", () => {
  const file = fileInput.files[0];
  const selectedFolder = folderSelect.value; // Get the selected folder
  feedbackMessage.textContent = ""; // Clear any previous messages
  feedbackMessage.classList.remove("text-red-600", "text-green-600");

  if (!file) {
    return;
  }

  // Optional: Implement file type and size checks here
  const allowedTypes = ["text/csv"];
  const maxSize = 5 * 1024 * 1024; // 5 MB
  if (!allowedTypes.includes(file.type)) {
    feedbackMessage.textContent =
      "Invalid file type. Only .csv files are allowed.";
    feedbackMessage.classList.add("text-red-600");
    return;
  }
  if (file.size > maxSize) {
    feedbackMessage.textContent = "File size exceeds the 5MB limit.";
    feedbackMessage.classList.add("text-red-600");
    return;
  }

  const user = auth.currentUser;
  console.log(user != null);
  if (user) {
    // Create a reference to the selected folder and file
    const storagePath = `${selectedFolder}/${file.name}`; // Correct path without "/uploads/"

    console.log(`Uploading file to: ${storagePath}`); // Log the path to confirm

    const storageRef = ref(storage, storagePath); // Only use selectedFolder here

    // Use uploadBytesResumable to track upload progress
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Disable the upload button
    uploadBtn.disabled = true;
    uploadBtn.classList.add("opacity-50", "cursor-not-allowed");

    // Show the progress bar
    progressContainer.classList.remove("hidden");

    // Monitor upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress function
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress.toFixed(2) + "% done");
        // Update progress bar
        progressBar.style.width = progress + "%";
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error(error);
        feedbackMessage.textContent = `Error: ${error.message}`;
        feedbackMessage.classList.add("text-red-600");
        progressContainer.classList.add("hidden");
        progressBar.style.width = "0%";
        uploadBtn.disabled = false;
        uploadBtn.classList.remove("opacity-50", "cursor-not-allowed");
      },
      () => {
        // Handle successful uploads
        console.log("Upload completed successfully");
        setTimeout(() => {
          progressContainer.classList.add("hidden");
          progressBar.style.width = "0%";
        }, 500);
        fileInput.value = "";
        feedbackMessage.textContent = "File uploaded successfully!";
        feedbackMessage.classList.add("text-green-600");
        uploadBtn.disabled = false;
        uploadBtn.classList.remove("opacity-50", "cursor-not-allowed");
        setTimeout(() => {
          feedbackMessage.textContent = "";
          feedbackMessage.classList.remove("text-green-600");
        }, 5000);
      }
    );
  } else {
    feedbackMessage.textContent = "You must be signed in to upload files.";
    feedbackMessage.classList.add("text-red-600");
  }
});
