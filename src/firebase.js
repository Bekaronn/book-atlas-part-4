// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEGRo8lAVWQ482Z4lrfJz-VANGQkiy_yo",
  authDomain: "book-atlas-8f689.firebaseapp.com",
  projectId: "book-atlas-8f689",
  storageBucket: "book-atlas-8f689.firebasestorage.app",
  messagingSenderId: "351926317434",
  appId: "1:351926317434:web:ebba77cd7ac9e63878e6c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
