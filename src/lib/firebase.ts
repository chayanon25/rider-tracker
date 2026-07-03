import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const firebaseConfig = {
  apiKey: "AIzaSyBtvuWOIsVta9TXR1NKWaHk5ow3hNlcSbA",
  authDomain: isLocal ? "thames-8e263.firebaseapp.com" : "rider-tracker-pied.vercel.app",
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
