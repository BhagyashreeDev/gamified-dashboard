# 🎮 Gamified Dashboard

A fun and interactive dashboard where users can log in, track their daily mood, and earn XP to level up — built with **React** and **Firebase**.

---

## 🚀 Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/BhagyashreeDev/gamified-dashboard.git
cd gamified-dashboard

npm install
Set up Firebase

Go to your Firebase Console

Create a new project

Enable Authentication → Email/Password sign-in

Enable Cloud Firestore and start in Test Mode

Go to Project Settings → General tab → Get your Firebase SDK config

Replace your Firebase config in src/firebase.js like this:
    // src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

📁 Folder Structure :
src/
├── App.js
├── firebase.js
├── LoginPage.js
├── SignupPage.js
├── Dashboard.js
└── index.js


npm start


✨ Features
🔐 User Authentication with Firebase (Sign up / Login / Logout)

😊 Mood Tracker: Log your current mood (text or emoji)

🌟 XP & Leveling System: Earn XP points every time you log a mood

🔁 Realtime Firestore Integration: User data is saved in Firestore

📊 Dashboard: View XP, current level, and your last submitted mood

🧭 React Router: Navigation between pages\














