import React, { useState, useEffect } from "react";
import { Home, Clock, PieChart, User, Plus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AddTransactionModal from "./AddTransactionModal";

const leftItems  = [
  { id: "home",    label: "Home",    Icon: Home  },
  { id: "history", label: "Riwayat", Icon: Clock },
];
const rightItems = [
  { id: "analytics", label: "Analytics", Icon: PieChart },
  { id: "profile",   label: "Profile",   Icon: User    },
];

export default function BottomNav({ activeTab, setActiveTab }) {
  const { addTransaction } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  if (!isMobile) return null;

  const renderItem = ({ id, label, Icon }) => {
    const active = activeTab === id;
    return (
      <button
        key={id}
        onClick={() => setActiveTab(id)}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          padding: "10px 4px 12px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          minWidth: 0,
        }}
      >
        <Icon
          size={active ? 24 : 22}
          strokeWidth={active ? 2 : 1.75}
          color={active ? "#111" : "#999"}
          style={{ transition: "all 0.2s" }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: active ? 500 : 400,
            color: active ? "#111" : "#999",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
            transition: "color 0.2s",
          }}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <>
      <nav
        style={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 -1px 0 rgba(0,0,0,0.04)",
          paddingBottom: "env(safe-area-inset-bottom)",
          zIndex: 100,
        }}
        aria-label="Navigasi utama"
      >
        {leftItems.map(renderItem)}

        {/* Tombol + di tengah */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "6px 0 12px" }}>
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label="Tambah Transaksi"
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #16a34a, #22c55e)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(34,197,94,0.4)",
              transform: "translateY(-8px)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(34,197,94,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(34,197,94,0.4)";
            }}
          >
            <Plus size={24} color="white" strokeWidth={2.5} />
          </button>
        </div>

        {rightItems.map(renderItem)}
      </nav>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTransaction}
      />
    </>
  );
}