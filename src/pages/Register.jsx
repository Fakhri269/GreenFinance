import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Wallet, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Register({ onNavigateToLogin }) {
  const { register, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!name || !email || !password) {
      setLocalError("Semua bidang harus diisi!");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password minimal harus 6 karakter!");
      return;
    }
    
    try {
      setLoading(true);
      await register(email, password, name);
    } catch (err) {
      setLocalError(err.message || "Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      {/* Left Column (Desktop) / Top Banner (Mobile) */}
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
        
        {/* Desktop Welcome Text (Left Side Widescreen) */}
        <div className="auth-desktop-welcome">
          <h2 className="auth-desktop-welcome-title">JOIN US !</h2>
          <p className="auth-desktop-welcome-subtitle">Buat akun GreenFinance baru Anda hari ini untuk memulai perjalanan pengelolaan dana secara bijak.</p>
        </div>
      </div>

      {/* Right Column (Desktop) / Main Form Body (Mobile) */}
      <div className="auth-body">
        {/* Mobile-only Welcome message */}
        <div className="auth-mobile-welcome">
          <h2>Daftar Akun</h2>
          <p>Lengkapi formulir di bawah ini untuk memulai</p>
        </div>

        {/* Desktop Widescreen Form Title */}
        <h2 className="auth-right-title">
          SIGN UP
          <span className="auth-right-subtitle">TO CREATE A NEW ACCOUNT</span>
        </h2>

        {/* Error Badges */}
        {(localError || error) && (
          <div className="auth-error-badge animate-fade-in" style={{ width: "100%", maxWidth: "420px" }}>
            <AlertCircle size={16} />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "420px" }}>
          {/* Name input */}
          <div className="form-group">
            <label className="form-label" htmlFor="name-input">Nama Lengkap</label>
            <div className="input-wrapper">
              <span className="input-icon-left"><User size={18} /></span>
              <input
                id="name-input"
                type="text"
                className="input-field"
                placeholder="Enter Full Name Here"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email input */}
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

          {/* Password input */}
          <div className="form-group">
            <label className="form-label" htmlFor="password-input">Password</label>
            <div className="input-wrapper">
              <span className="input-icon-left"><Lock size={18} /></span>
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="Enter Password (min. 6 chars)"
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

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: "16px" }}
          >
            {loading ? "Memproses..." : "Sign Up"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="auth-footer">
          Sudah punya akun? 
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToLogin(); }}>
            Masuk Sekarang
          </a>
        </div>

        {/* Desktop Copyright Info */}
        <div className="auth-copyright-desktop">
          Copyright &copy; 2026 GreenFinance. All rights reserved.
        </div>
      </div>
    </div>
  );
}
