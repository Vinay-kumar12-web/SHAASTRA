"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ Password reset email sent successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "30px",
          borderRadius: "16px",
          background: "#1e293b",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        <h1
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Forgot Password
        </h1>

        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #334155",
              background: "#0f172a",
              color: "white",
              marginBottom: "15px",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              background: "#4f46e5",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p
            style={{
              color: "#22c55e",
              textAlign: "center",
              marginTop: "15px",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}