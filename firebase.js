import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase Configuration Keys
const firebaseConfig = {
    apiKey: "AIzaSyCA5BNQ4_eqiAmSHK5MdVz99Q9zA8CLqyg",
    authDomain: "viola-gifts1.firebaseapp.com",
    projectId: "viola-gifts1",
    storageBucket: "viola-gifts1.firebasestorage.app",
    messagingSenderId: "349236815080",
    appId: "1:349236815080:web:34c7ab91b6dbd3d604d55d",
    measurementId: "G-5Y9EQDJD28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore Database Instance
export const db = getFirestore(app);