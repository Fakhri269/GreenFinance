import React from "react";
import { User, LogOut, Shield, HelpCircle, Info, ChevronRight, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { currentUser, logout, isFirebase } = useAuth();

  const handleLogout = async () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      try {
        await logout();
      } catch (err) {
        console.error("Gagal keluar:", err);
      }
    }
  };

  const name = currentUser?.displayName || "Pengguna Demo";
  const email = currentUser?.email || "demo@greenfinance.com";

  return (
    <div className="page-container animate-fade-in" style={{ padding: "24px 20px 84px 20px" }}>
      <h2 className="section-title" style={{ fontSize: "22px", marginBottom: "18px" }}>Profil Pengguna</h2>

      {/* User Card */}
      <div className="profile-card animate-fade-in-up">
        <div className="profile-avatar-large">
          {name.charAt(0).toUpperCase()}
        </div>
        <h3 className="profile-name">{name}</h3>
        <p className="profile-email">{email}</p>
        
        {/* Firebase indicator */}
        <span style={{ 
          fontSize: "11px", 
          fontWeight: 600, 
          padding: "4px 10px", 
          borderRadius: "8px", 
          backgroundColor: isFirebase ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
          color: isFirebase ? "var(--primary-color)" : "var(--warning-color)"
        }}>
          {isFirebase ? "Firebase Auth Connected" : "Local Storage Mock Mode"}
        </span>
      </div>

      {/* Menu Settings */}
      <div className="profile-menu-list animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <div className="profile-menu-item">
          <div className="profile-menu-left">
            <Shield size={18} style={{ color: "var(--primary-color)" }} />
            <span>Keamanan Akun</span>
          </div>
          <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
        </div>

        <div className="profile-menu-item">
          <div className="profile-menu-left">
            <Settings size={18} style={{ color: "var(--primary-color)" }} />
            <span>Pengaturan Aplikasi</span>
          </div>
          <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
        </div>

        <div className="profile-menu-item">
          <div className="profile-menu-left">
            <HelpCircle size={18} style={{ color: "var(--primary-color)" }} />
            <span>Bantuan & FAQ</span>
          </div>
          <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
        </div>

        <div className="profile-menu-item">
          <div className="profile-menu-left">
            <Info size={18} style={{ color: "var(--primary-color)" }} />
            <span>Tentang GreenFinance</span>
          </div>
          <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className="btn-secondary">
          <LogOut size={18} />
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}
