// Sidebar.jsx
import React, { useState, useEffect } from "react";
import { Home, Clock, PieChart, User, LogOut, Wallet } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { id: "home",      label: "Home Dashboard",    Icon: Home     },
  { id: "history",   label: "Riwayat Transaksi", Icon: Clock    },
  { id: "analytics", label: "Analisis Keuangan", Icon: PieChart },
  { id: "profile",   label: "Profil Akun",        Icon: User     },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentUser, logout } = useAuth();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  if (!isDesktop) return null;

  const name  = currentUser?.displayName || "Pengguna Demo";
  const email = currentUser?.email       || "demo@greenfinance.com";

  const handleLogout = async () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari akun?")) {
      try { await logout(); }
      catch (err) { console.error("Gagal keluar:", err); }
    }
  };

  return (
    <aside className="desktop-sidebar animate-fade-in">
      <div className="sidebar-brand">
        <div className="brand-logo-wrapper">
          <Wallet size={22} />
        </div>
        <div>
          <h2 className="brand-title">GreenFinance</h2>
          <p className="brand-subtitle">Smart Pocket Manager</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`sidebar-nav-item ${activeTab === id ? "sidebar-nav-item-active" : ""}`}
            aria-label={`Buka halaman ${label}`}
            aria-current={activeTab === id ? "page" : undefined}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

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