import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const env = (typeof import.meta !== "undefined" && import.meta.env) ? import.meta.env : {};

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyDd40HzvymF6COy5o2Pco4KXd9f4MF4ptQ",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "rte-portal-6a47e.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "rte-portal-6a47e",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "rte-portal-6a47e.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "737087386403",
  appId: env.VITE_FIREBASE_APP_ID || "1:737087386403:web:d4615d1d2feafe73c8d296",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-LMQD26VFSG",
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore Database
export const db = getFirestore(app);

export const firebaseConfigInfo = {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  appId: firebaseConfig.appId,
};

export default app;
