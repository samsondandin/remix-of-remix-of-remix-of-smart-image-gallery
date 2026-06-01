import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDAmDp2J3OQJKkfeyCtjOX_950OS9177qA",
    authDomain: "smart-gallery-80002.firebaseapp.com",
    projectId: "smart-gallery-80002",
    storageBucket: "smart-gallery-80002.firebasestorage.app",
    messagingSenderId: "539367600674",
    appId: "1:539367600674:web:dc7a5b5b742cc3f0cb907b",
    measurementId: "G-8HD62N7QB3"
};

export const firebaseApiKey = firebaseConfig.apiKey;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
