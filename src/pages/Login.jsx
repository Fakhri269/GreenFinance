import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Wallet, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19.1 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.5 29.3 4 24 4 16.2 4 9.5 8.4 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1C9.3 35.6 16.1 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.2 5.2C41 35.5 44 30.2 44 24c0-1.2-.1-2.4-.4-3.5z"/>
  </svg>
);

export default function Login({ onNavigateToRegister }) {
  const { login, signInWithGoogle, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!email || !password) {
      setLocalError("Email dan password harus diisi!");
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
    } catch (err) {
      setLocalError(err.message || "Gagal masuk. Periksa kembali email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (err) {
      setLocalError(err.message || "Gagal masuk dengan Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Tautan pemulihan password telah dikirim ke: " + (email || "email Anda") + " (Simulasi)");
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-header">
        <div className="auth-brand-logo-row">
          <div className="auth-logo-wrapper">
            <Wallet />
          </div>
          <div className="auth-brand-text">
            <h1 className="auth-app-title">GreenFinance</h1>
            <p className="auth-app-subtitle">Smart Pocket Manager</p>
          </div>
        </div>
        <div className="auth-desktop-welcome">
          <h2 className="auth-desktop-welcome-title">WELCOME BACK!</h2>
          <p className="auth-desktop-welcome-subtitle">
            Masukkan Email dan Password Anda untuk melanjutkan pengelolaan keuangan pintar.
          </p>
        </div>
      </div>

      <div className="auth-body">
        <div className="auth-mobile-welcome">
          <h2>Selamat Datang</h2>
          <p>Silakan login untuk melanjutkan</p>
        </div>

        <h2 className="auth-right-title">
          SIGN IN
          <span className="auth-right-subtitle">TO ACCESS THE PORTAL</span>
        </h2>

        {(localError || error) && (
          <div className="auth-error-badge animate-fade-in" style={{ width: "100%", maxWidth: "420px" }}>
            <AlertCircle size={16} />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "420px" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email</label>
            <div className="input-wrapper">
              <span className="input-icon-left"><Mail size={18} /></span>
              <input
                id="email-input"
                type="email"
                className="input-field"
                placeholder="Enter Email Here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">Password</label>
            <div className="input-wrapper">
              <span className="input-icon-left"><Lock size={18} /></span>
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="forgot-password-link">
            <a href="#" onClick={handleForgotPassword}>Forget Password?</a>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <div className="auth-divider">OR</div>

        <button
          className="btn-google"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <GoogleIcon />
          Masuk dengan Google
        </button>

        <div className="auth-footer">
          Belum punya akun?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToRegister(); }}>
            Daftar Sekarang
          </a>
        </div>

        <div className="auth-copyright-desktop">
          {"© 2026 GreenFinance. All rights reserved."}
        </div>
      </div>
    </div>
  );
}