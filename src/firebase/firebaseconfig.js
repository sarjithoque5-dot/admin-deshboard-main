import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

// 🔥 Firebase config (YOUR REAL ONE)
const firebaseConfig = {
  apiKey: "AIzaSyCddrcSWs9d5myp6RwNrUTJLjfxNe1l0L0",
  authDomain: "speed-wash-services.firebaseapp.com",
  databaseURL: "https://speed-wash-services-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "speed-wash-services",
  storageBucket: "speed-wash-services.firebasestorage.app",
  messagingSenderId: "231738052911",
  appId: "1:231738052911:web:fb84801ad541c5da2cd1da",
  measurementId: "G-EBNX1QFKTQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 AUTH (VERY IMPORTANT)
const auth = getAuth(app);

// 🔓 Anonymous login (rules ke liye auth != null)
signInAnonymously(auth)
  .then(() => {
    console.log("✅ Firebase Anonymous Auth Success");
  })
  .catch((error) => {
    console.error("❌ Firebase Auth Error:", error);
  });

// 🔥 Realtime Database
export const database = getDatabase(app);