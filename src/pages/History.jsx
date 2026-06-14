import React, { useState } from "react";
import { ArrowDownLeft, TrendingUp, Search, Calendar, Pencil } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AddTransactionModal from "../components/AddTransactionModal";
import PinModal from "../components/PinModal";

export default function History() {
  const { transactions, editTransaction, getPin, savePin } = useAuth();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Edit flow
  const [editData, setEditData]         = useState(null);
  const [isEditModalOpen, setEditModal] = useState(false);

  // PIN modal
  const [pinMode, setPinMode]           = useState(null); // 'verify' | 'setup'
  const [pinCallback, setPinCallback]   = useState(null);
  const [checkingPin, setCheckingPin]   = useState(false);

  const formatIDR = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency", currency: "IDR",
      minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(num).replace("Rp", "Rp ");

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "income"  && tx.type === "income") ||
      (filter === "expense" && tx.type === "expense");
    const matchesSearch =
      tx.title.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Open PIN then run callback
  const requirePin = async (callback) => {
    setCheckingPin(true);
    const existing = await getPin();
    setCheckingPin(false);
    setPinCallback(() => callback);
    setPinMode(existing ? "verify" : "setup");
  };

  const handlePinSuccess = () => {
    setPinMode(null);
    if (pinCallback) { pinCallback(); setPinCallback(null); }
  };

  const handlePinClose = () => {
    setPinMode(null);
    setPinCallback(null);
    setEditData(null);
  };

  // Edit
  const handleEditClick = (tx) => {
    requirePin(() => {
      setEditData(tx);
      setEditModal(true);
    });
  };

  return (
    <div className="page-container animate-fade-in" style={{ padding: "24px 20px 84px" }}>
      <h2 className="section-title" style={{ fontSize: 22, marginBottom: 18 }}>
        Riwayat Transaksi
      </h2>

      {/* Search */}
      <div className="form-group" style={{ marginBottom: 16 }}>
        <div className="input-wrapper">
          <span className="input-icon-left"><Search size={16} /></span>
          <input
            type="text"
            className="input-field"
            style={{ height: 44, borderRadius: 12, fontSize: 13 }}
            placeholder="Cari transaksi atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filter */}
      <div className="history-filter-bar">
        {["all", "income", "expense"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`filter-badge ${filter === f ? "filter-badge-active" : ""}`}
          >
            {f === "all" ? "Semua" : f === "income" ? "Pemasukan" : "Pengeluaran"}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="transaction-list-container animate-fade-in-up" style={{ marginTop: 8 }}>
        {filteredTransactions.map((tx, i) => (
          <div
            key={tx.id}
            className="transaction-card"
            style={{
              padding: "14px 16px",
              opacity: 1,
              animation: `fadeInUp 0.3s ease ${i * 0.04}s both`,
            }}
          >
            <div className="transaction-left" style={{ flex: 1, minWidth: 0 }}>
              <div
                className={`transaction-avatar-wrapper ${tx.type === "income" ? "avatar-income" : "avatar-expense"}`}
                style={{ borderRadius: 14, width: 44, height: 44, flexShrink: 0 }}
              >
                {tx.type === "income" ? <TrendingUp size={18} /> : <ArrowDownLeft size={18} />}
              </div>
              <div style={{ minWidth: 0 }}>
                <h4 className="transaction-text-title" style={{ fontSize: 14 }}>{tx.title}</h4>
                <p className="transaction-text-subtitle" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{
                    padding: "1px 6px", borderRadius: 6,
                    backgroundColor: "#e2e8f0", fontWeight: 600, fontSize: 9
                  }}>
                    {tx.category}
                  </span>
                  • {tx.date}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div className={`transaction-amount-label ${tx.type === "income" ? "amount-income" : "amount-expense"}`}>
                {tx.type === "income" ? "+" : "-"}{formatIDR(tx.amount)}
              </div>

              {/* Edit button */}
              <button
                onClick={() => handleEditClick(tx)}
                disabled={checkingPin}
                aria-label="Edit transaksi"
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "#eff6ff", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#3b82f6",
                  transition: "background 0.15s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#dbeafe"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#eff6ff"}
              >
                <Pencil size={14} />
              </button>
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-secondary)" }}>
            <Calendar size={36} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ fontSize: 14, fontWeight: 500 }}>Tidak ada transaksi ditemukan</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
              Coba ubah kata kunci pencarian atau filter
            </p>
          </div>
        )}
      </div>

      {/* PIN Modal */}
      {pinMode && (
        <PinModal
          mode={pinMode}
          onSuccess={handlePinSuccess}
          onClose={handlePinClose}
          getPin={getPin}
          savePin={savePin}
        />
      )}

      {/* Edit Modal */}
      <AddTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => { setEditModal(false); setEditData(null); }}
        onAdd={() => {}}
        onEdit={editTransaction}
        editData={editData}
      />
    </div>
  );
}