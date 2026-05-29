import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Wallet, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Login({ onNavigateToRegister }) {
  const { login, error } = useAuth();
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

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert(`Tautan pemulihan password telah dikirim ke: ${email || "email Anda"} (Simulasi)`);
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
          <h2 className="auth-desktop-welcome-title">WELCOME BACK !</h2>
          <p className="auth-desktop-welcome-subtitle">Masukkan Email dan Password Anda untuk melanjutkan pengelolaan keuangan pintar.</p>
        </div>
      </div>

      {/* Right Column (Desktop) / Main Form Body (Mobile) */}
      <div className="auth-body">
        {/* Mobile-only Welcome message */}
        <div className="auth-mobile-welcome">
          <h2>Selamat Datang</h2>
          <p>Silakan login untuk melanjutkan</p>
        </div>

        {/* Desktop Widescreen Form Title */}
        <h2 className="auth-right-title">
          SIGN IN
          <span className="auth-right-subtitle">TO ACCESS THE PORTAL</span>
        </h2>

        {/* Error Badges */}
        {(localError || error) && (
          <div className="auth-error-badge animate-fade-in" style={{ width: "100%", maxWidth: "420px" }}>
            <AlertCircle size={16} />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "420px" }}>
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

          {/* Forgot Password Link */}
          <div className="forgot-password-link">
            <a href="#" onClick={handleForgotPassword}>Forget Password?</a>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="auth-footer">
          Belum punya akun? 
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToRegister(); }}>
            Daftar Sekarang
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
