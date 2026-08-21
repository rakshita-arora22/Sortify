import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Paste the config object from Firebase Console → Project settings → General
// → Your apps → SDK setup and configuration. Share this exact object with the
// whole team so everyone connects to the SAME project.
const firebaseConfig = {
  apiKey: "AIzaSyD47pajwPT0KqeFcpWQYAi9cPoBgr2pr_4",
  authDomain: "sortify-429c6.firebaseapp.com",
  projectId: "sortify-429c6",
  storageBucket: "sortify-429c6.firebasestorage.app",
  messagingSenderId: "365286812960",
  appId: "1:365286812960:web:2069d79062cacf5e2cbb45",
  measurementId: "G-4D593FFBZS",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
