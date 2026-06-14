import React from "react";
import { User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { currentUser, logout } = useAuth();

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
      </div>

      {/* Logout */}
      <div className="profile-menu-list animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <button onClick={handleLogout} className="btn-secondary">
          <LogOut size={18} />
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}