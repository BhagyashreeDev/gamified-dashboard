// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAz4dle67_9DyVPhz8nw1mynGDc4DUd3es",
  authDomain: "gamified-dashboard-b0549.firebaseapp.com",
  projectId: "gamified-dashboard-b0549",
  storageBucket: "gamified-dashboard-b0549.firebasestorage.app",
  messagingSenderId: "590495610154",
  appId: "1:590495610154:web:b8214f7502200f5e409a53",
  measurementId: "G-DTCW2JMZVT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);