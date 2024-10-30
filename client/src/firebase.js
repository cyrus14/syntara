import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

import firebaseConfig from "./firebase.config";

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export {
  auth,
  provider,
  signInWithPopup,
  signOut,
  storage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytesResumable,
};
