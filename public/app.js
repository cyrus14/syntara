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
  uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDG0vZ9p4X2XlIdP11RLIJ-FKMFvtYIbos",
  authDomain: "syntara-88cc3.firebaseapp.com",
  projectId: "syntara-88cc3",
  storageBucket: "syntara-88cc3.appspot.com",
  messagingSenderId: "311542379658",
  appId: "1:311542379658:web:166dc3fd29797b9152a973",
  measurementId: "G-EMH5ZCYG9W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize Google Auth Provider
const provider = new GoogleAuthProvider();

// UI Elements
const googleSignInBtn = document.getElementById('google-signin-btn');
const profilePic = document.getElementById('profile-pic');
const fileInput = document.getElementById('file-input');
const folderSelect = document.getElementById('folder-select'); // Reference to the folder select dropdown
const uploadBtn = document.getElementById('upload-btn');
const welcomeMessage = document.getElementById('welcome-message');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const feedbackMessage = document.getElementById('feedback-message');
const uploadSection = document.getElementById('upload-section'); // Reference to the upload section
const adminBadge = document.getElementById('admin-badge');
const searchSection = document.getElementById('search-section'); // Reference to the search section
const welcomeSection = document.getElementById('welcome-section'); // Reference to the welcome section
const getStartedBtn = document.getElementById('get-started-btn');

const ADMIN_LIST = ['cri23@cornell.edu'];

// Handle Authentication State Changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    googleSignInBtn.classList.add('hidden');
    profilePic.classList.remove('hidden');
    searchSection.classList.remove('hidden'); // Show the search section
    welcomeSection.classList.add('hidden'); // Hide the welcome section

    // Update profile picture
    profilePic.src = user.photoURL;

    // Display welcome message (optional)
    welcomeMessage.textContent = `Welcome, ${user.displayName}`;

    // Check if the user's email is in the ADMIT_LIST
    if (ADMIN_LIST.includes(user.email)) {
      adminBadge.classList.remove('hidden'); // Show the admin badge
      uploadSection.classList.remove('hidden'); // Show the upload section
    } else {
      adminBadge.classList.add('hidden'); // Hide the admin badge
      uploadSection
    }

  } else {
    // User is signed out
    googleSignInBtn.classList.remove('hidden');
    profilePic.classList.add('hidden');
    uploadSection.classList.add('hidden'); // Hide the upload section
    searchSection.classList.add('hidden'); // Hide the search section
    welcomeSection.classList.remove('hidden'); // Show the welcome section

    // Clear profile picture
    profilePic.src = '';

    // Clear welcome message
    welcomeMessage.textContent = '';

    adminBadge.classList.add('hidden'); // Hide the admin badge
  }
});

// Google Sign-In Functionality
googleSignInBtn.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // User signed in successfully
      // UI updates are handled by onAuthStateChanged observer
    })
    .catch((error) => {
      console.error(error);
    });
});

getStartedBtn.addEventListener('click', () => {
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
profilePic.addEventListener('click', () => {
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
uploadBtn.addEventListener('click', () => {
  const file = fileInput.files[0];
  const selectedFolder = folderSelect.value; // Get the selected folder
  feedbackMessage.textContent = ''; // Clear any previous messages
  feedbackMessage.classList.remove('text-red-600', 'text-green-600');

  if (!file) {
    return;
  }

  // Optional: Implement file type and size checks here
  const allowedTypes = ['text/csv'];
  const maxSize = 5 * 1024 * 1024; // 5 MB
  if (!allowedTypes.includes(file.type)) {
    feedbackMessage.textContent = 'Invalid file type. Only .csv files are allowed.';
    feedbackMessage.classList.add('text-red-600');
    return;
  }
  if (file.size > maxSize) {
    feedbackMessage.textContent = 'File size exceeds the 5MB limit.';
    feedbackMessage.classList.add('text-red-600');
    return;
  }

  const user = auth.currentUser;
  console.log(user != null)
  if (user) {
    // Create a reference to the selected folder and file
    const storagePath = `${selectedFolder}/${file.name}`; // Correct path without "/uploads/"
    
    console.log(`Uploading file to: ${storagePath}`); // Log the path to confirm

    const storageRef = ref(storage, storagePath); // Only use selectedFolder here

    // Use uploadBytesResumable to track upload progress
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Disable the upload button
    uploadBtn.disabled = true;
    uploadBtn.classList.add('opacity-50', 'cursor-not-allowed');

    // Show the progress bar
    progressContainer.classList.remove('hidden');

    // Monitor upload progress
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Progress function
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress.toFixed(2) + '% done');
        // Update progress bar
        progressBar.style.width = progress + '%';
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error(error);
        feedbackMessage.textContent = `Error: ${error.message}`;
        feedbackMessage.classList.add('text-red-600');
        progressContainer.classList.add('hidden');
        progressBar.style.width = '0%';
        uploadBtn.disabled = false;
        uploadBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      },
      () => {
        // Handle successful uploads
        console.log('Upload completed successfully');
        setTimeout(() => {
          progressContainer.classList.add('hidden');
          progressBar.style.width = '0%';
        }, 500);
        fileInput.value = '';
        feedbackMessage.textContent = 'File uploaded successfully!';
        feedbackMessage.classList.add('text-green-600');
        uploadBtn.disabled = false;
        uploadBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        setTimeout(() => {
          feedbackMessage.textContent = '';
          feedbackMessage.classList.remove('text-green-600');
        }, 5000);
      }
    );
  } else {
    feedbackMessage.textContent = 'You must be signed in to upload files.';
    feedbackMessage.classList.add('text-red-600');
  }
});
