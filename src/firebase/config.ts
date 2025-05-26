import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC1JINociJurruzDn-0y9uqHuzCUOAsTeo",
  authDomain: "student-announcement-30beb.firebaseapp.com",
  projectId: "student-announcement-30beb",
  storageBucket: "student-announcement-30beb.firebasestorage.app",
  messagingSenderId: "108872021277",
  appId: "1:108872021277:web:e06f5eda182afed837ddf4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Admin email - replace with your own
export const ADMIN_EMAIL = "admin@gmail.com";