



"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Hardcoded Exact Validation
    if (email === "admin@violagifts.com" && password === "12345678") {
      setTimeout(() => {
        localStorage.setItem("isAdminLoggedIn", "true");
        router.push("/admin");
      }, 500);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setError("Invalid email or password! Please check your credentials.");
      }, 500);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1e1b4b", fontFamily: "Inter, system-ui, sans-serif", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "400px", backgroundColor: "#ffffff", padding: "40px", borderRadius: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>

        {/* Viola Gifts Brand Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "28px" }}>
          <div style={{ width: "54px", height: "54px", borderRadius: "50%", backgroundColor: "#f472b6", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(244,114,182,0.4)", marginBottom: "12px" }}>
            <span style={{ fontSize: "26px" }}>🎁</span>
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#1e1b4b", letterSpacing: "-0.5px", margin: 0 }}>Viola Gifts</h2>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#9333ea", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "2px" }}>Crafted With Love</span>
        </div>

        <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", textAlign: "center", marginBottom: "6px" }}>Admin Access</h3>
        <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center", marginBottom: "20px" }}>Enter your credentials to manage the store</p>

        {/* Error Alert Message */}
        {error && (
          <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "500", marginBottom: "20px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Email Address</label>
            <input
              type="email"
              required
              placeholder="admin@violagifts.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ width: "100%", padding: "12px", backgroundColor: "#1e1b4b", color: "#ffffff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: "pointer", marginTop: "8px", boxShadow: "0 4px 12px rgba(30,27,75,0.2)" }}
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}