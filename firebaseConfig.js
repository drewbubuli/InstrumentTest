// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwdAdphhVbODQIr6VjpgNedMSHoHubpXg",
  authDomain: "instrumenttest.firebaseapp.com",
  projectId: "instrumenttest",
  storageBucket: "instrumenttest.firebasestorage.app",
  messagingSenderId: "851468877805",
  appId: "1:851468877805:web:460339f711d34a0842f1e4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)