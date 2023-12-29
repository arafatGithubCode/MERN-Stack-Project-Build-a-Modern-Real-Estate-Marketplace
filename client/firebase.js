import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "all-practice-projects-3ff32.firebaseapp.com",
  projectId: "all-practice-projects-3ff32",
  storageBucket: "all-practice-projects-3ff32.appspot.com",
  messagingSenderId: "222991055083",
  appId: "1:222991055083:web:68e621b3936dfe622466ae",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
