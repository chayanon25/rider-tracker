import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtvuWOIsVta9TXR1NKWaHk5ow3hNlcSbA",
  authDomain: "thames-8e263.firebaseapp.com",
  projectId: "thames-8e263",
  storageBucket: "thames-8e263.firebasestorage.app",
  messagingSenderId: "399430634422",
  appId: "1:399430634422:web:a0152ff6c58396874d8f17",
  measurementId: "G-KE0TWVZ7ZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
