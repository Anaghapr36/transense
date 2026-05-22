import React, { useState } from "react";
import "./Login.css";
import { GoogleLogin } from "@react-oauth/google";
import logo from "./assets/logo.png";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleEmailPasswordLogin = () => {
    setError("");
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (!email.trim()) {
        setError("Email is required");
        setLoading(false);
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email");
        setLoading(false);
        return;
      }
      
      if (!password.trim()) {
        setError("Password is required");
        setLoading(false);
        return;
      }
      
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }
      
      setUser({ name: email, email: email, loginMethod: "email", remember: rememberMe });
      setLoading(false);
    }, 500);
  };

  const handleGoogleSuccess = (res) => {
    console.log(res);
    setError("");
    setUser({ name: "Google User", email: res.email, loginMethod: "google", remember: rememberMe });
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo">
            <img src={logo} alt="Namma Bus Logo" className="logo-img" />
          </div>
          <h1>Namma Bus</h1>
          <p className="tagline">Bangalore city operations command center</p>
        </div>

        {/* Form Section */}
        <div className="form-section">
          <h2>Welcome back, operations officer</h2>
          <p className="subtitle">Sign in to monitor fleet status, alerts, and real-time route operations.</p>

          {error && <div className="error-message">
            <span className="error-icon">⚠</span>
            {error}
          </div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">✉</span>
              <input 
                id="email"
                type="email" 
                placeholder="your@email.com" 
                className="input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleEmailPasswordLogin()}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <a href="#forgot" className="forgot-link">Forgot?</a>
            </div>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input 
                id="password"
                type="password" 
                placeholder="••••••••" 
                className="input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleEmailPasswordLogin()}
              />
            </div>
          </div>

          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button 
            className="login-btn" 
            onClick={handleEmailPasswordLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="divider">
            <span>Or continue with</span>
          </div>

          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>

          <div className="footer-text">
            <p>Don't have an account? <a href="#signup" className="signup-link">Create one</a></p>
            <p className="terms">By signing in, you agree to our <a href="#terms" className="terms-link">Terms</a> and <a href="#privacy" className="privacy-link">Privacy Policy</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;