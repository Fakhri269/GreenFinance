import React from "react";
import { Home, Clock, PieChart, User, LogOut, Wallet } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentUser, logout } = useAuth();

  const navItems = [
    { id: "home", label: "Home Dashboard", icon: Home },
    { id: "history", label: "Riwayat Transaksi", icon: Clock },
    { id: "analytics", label: "Analisis Keuangan", icon: PieChart },
    { id: "profile", label: "Profil Akun", icon: User }
  ];

  const handleLogout = async () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari akun?")) {
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
    <aside className="desktop-sidebar animate-fade-in">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo-wrapper">
          <Wallet size={22} />
        </div>
        <div>
          <h2 className="brand-title">GreenFinance</h2>
          <p className="brand-subtitle">Smart Pocket Manager</p>
        </div>
      </div>

      {/* Navigation menu items */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-nav-item ${isActive ? "sidebar-nav-item-active" : ""}`}
              aria-label={`Buka halaman ${item.label}`}
            >
              <IconComponent size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / User Details */}
      <div className="sidebar-footer">
        <div className="sidebar-user-info">
          <div className="sidebar-user-avatar">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-text">
            <h4 className="sidebar-user-name">{name}</h4>
            <p className="sidebar-user-email">{email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-logout-btn" aria-label="Keluar dari akun">
          <LogOut size={16} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
