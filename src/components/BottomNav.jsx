import React from "react";
import { Home, Clock, PieChart, User } from "lucide-react";

export default function BottomNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "history", label: "Riwayat", icon: Clock },
    { id: "analytics", label: "Analytics", icon: PieChart },
    { id: "profile", label: "Profile", icon: User }
  ];

  return (
    <div className="bottom-nav-bar animate-fade-in">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-tab-item ${isActive ? "nav-tab-active" : ""}`}
            aria-label={`Buka halaman ${item.label}`}
          >
            <IconComponent />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
