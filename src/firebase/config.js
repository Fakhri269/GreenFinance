import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

let app;
let auth = null;
let db = null;
let isFirebaseConfigured = false;

// Check if credentials are provided and not placeholders
if (
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "YOUR_API_KEY" && 
  firebaseConfig.apiKey.length > 10
) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    isFirebaseConfigured = true;
    console.log("GreenFinance: Firebase initialized successfully!");
  } catch (error) {
    console.warn("GreenFinance: Firebase initialization failed, falling back to Local Storage:", error);
  }
} else {
  console.log("GreenFinance: Firebase credentials not configured. Running in premium MOCK/LOCAL STORAGE mode.");
}

export { auth, db, isFirebaseConfigured };
