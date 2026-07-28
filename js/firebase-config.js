/* ============================================
   ARYAN VX7 — Firebase Configuration
   Uses Firebase Compat SDK (loaded via CDN in <head>)
   ============================================ */

const firebaseConfig = {
  apiKey: "AIzaSyAwmibMJ-4IcSevD0f43GfED-HqH9E6qoU",
  authDomain: "vx77-c7f7e.firebaseapp.com",
  databaseURL: "https://vx77-c7f7e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vx77-c7f7e",
  storageBucket: "vx77-c7f7e.firebasestorage.app",
  messagingSenderId: "773582293799",
  appId: "1:773582293799:web:4da808721ee4bfbe91f702"
};

// Initialize Firebase (guard against double-init if script runs twice)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("[firebase-config] Firebase initialized");
} else {
  firebase.app();
  console.log("[firebase-config] Firebase already initialized, reusing app");
}

// Shared references used across auth.js / dashboard.js
const auth = firebase.auth();
const db = firebase.database();
const googleProvider = new firebase.auth.GoogleAuthProvider();
