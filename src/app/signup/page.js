"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { createUserWithEmailAndPassword, signInWithPopup, signOut, deleteUser } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, appleProvider } from "@/lib/firebase";
import styles from "./page.module.css";

// Basic Google and Apple SVG paths to closely match the image
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 384 512">
    <path fill="#000000" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Create user using Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      try {
        // Store new account details directly into Firebase Firestore Database
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          createdAt: new Date().toISOString(),
          completedTopics: {},
          skillProgress: {},
          studyPlans: []
        });
      } catch (dbError) {
        // Rollback authentication if Firestore creation fails (e.g. not enabled yet)
        await deleteUser(userCredential.user);
        throw new Error("Firestore Error: You must enable 'Firestore Database' in your Firebase Console. (" + dbError.message + ")");
      }

      // Log them out immediately to force them to use the Login page
      await signOut(auth);

      alert("Signup successful! Your details are stored in the database. Please log in.");
      router.push("/login"); 
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already in use.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else if (err.code === 'auth/operation-not-allowed') {
        setError("Email/Password Auth is not enabled in Firebase > Authentication > Sign-in method.");
      } else {
        setError(err.message || "Failed to create an account.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (err) {
      setError("Google Signup failed.");
    }
  };

  const handleAppleSignup = async () => {
    try {
      await signInWithPopup(auth, appleProvider);
      router.push("/");
    } catch (err) {
      setError("Apple Signup failed.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign up with</h1>
        
        <div className={styles.ssoButtons}>
          <button className={styles.ssoBtn} type="button" onClick={handleGoogleSignup}>
            <GoogleIcon /> Google
          </button>
          <button className={styles.ssoBtn} type="button" onClick={handleAppleSignup}>
            <AppleIcon /> Apple
          </button>
        </div>

        <div className={styles.divider}>or</div>

        <form onSubmit={handleSignup}>
          {error && <div style={{ color: "#ff4d4f", marginBottom: "15px", fontSize: "14px", textAlign: "center" }}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <Mail className={styles.inputIcon} />
            <input 
              type="email" 
              placeholder="Email address" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input} 
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.inputIcon} />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input} 
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.inputIcon} />
            <input 
              type="password" 
              placeholder="Confirm Password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input} 
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn} style={{ marginTop: '8px' }}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account?{" "}
          <Link href="/login" className={styles.footerLink}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
