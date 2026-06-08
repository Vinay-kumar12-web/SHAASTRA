import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCl8aJ3Z8cXIxU0puiOLYMDJUD6S0_pZqk",
  authDomain: "prime-astra.firebaseapp.com",
  projectId: "prime-astra",
  storageBucket: "prime-astra.firebasestorage.app",
  messagingSenderId: "682326242883",
  appId: "1:682326242883:web:1cd692eded062a0592c6f6",
  measurementId: "G-KJD3G42GYS"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics is only available in the browser (client-side)
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const auth = getAuth(app);
const db = getFirestore(app);

// Authentication Providers (for SSO integration)
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export { app, auth, db, googleProvider, appleProvider, analytics };
