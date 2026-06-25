/**
 * Firebase Configuration
 * 
 * TODO: Replace with your actual Firebase project config.
 * 
 * Steps:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new project (e.g. "coc-character-sheet")
 * 3. Enable Authentication (Email/Password method)
 * 4. Enable Cloud Firestore (start in test mode)
 * 5. Register a Web app and paste the config below
 * 6. Install: npx expo install firebase
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBue5wTGUjuoJeoX7Mnc_b3fUDenLBqGgs",
  authDomain: "coc-character-sheet-264d6.firebaseapp.com",
  projectId: "coc-character-sheet-264d6",
  storageBucket: "coc-character-sheet-264d6.firebasestorage.app",
  messagingSenderId: "187204867454",
  appId: "1:187204867454:web:1a2ec5d378bb4e54fd4f2f"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('[Firebase] Not configured yet. Running in offline mode.', error.message);
}

export { app, auth, db };
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY";
};
