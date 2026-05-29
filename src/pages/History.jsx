import React, { useState } from "react";
import { ArrowDownLeft, User, Search, Calendar, ChevronRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function History() {
  const { transactions } = useAuth();
  const [filter, setFilter] = useState("all"); // 'all', 'income', 'expense'
  const [search, setSearch] = useState("");

  const formatIDR = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num).replace("Rp", "Rp ");
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = 
      filter === "all" || 
      (filter === "income" && tx.type === "income") || 
      (filter === "expense" && tx.type === "expense");
      
    const matchesSearch = 
      tx.title.toLowerCase().includes(search.toLowerCase()) || 
      tx.category.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="page-container animate-fade-in" style={{ padding: "24px 20px 84px 20px" }}>
      <h2 className="section-title" style={{ fontSize: "22px", marginBottom: "18px" }}>Riwayat Transaksi</h2>

      {/* Search Input */}
      <div className="form-group" style={{ marginBottom: "16px" }}>
        <div className="input-wrapper">
          <span className="input-icon-left"><Search size={16} /></span>
          <input
            type="text"
            className="input-field"
            style={{ height: "44px", borderRadius: "12px", fontSize: "13px" }}
            placeholder="Cari transaksi atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Badges */}
      <div className="history-filter-bar">
        <button
          onClick={() => setFilter("all")}
          className={`filter-badge ${filter === "all" ? "filter-badge-active" : ""}`}
        >
          Semua
        </button>
        <button
          onClick={() => setFilter("income")}
          className={`filter-badge ${filter === "income" ? "filter-badge-active" : ""}`}
        >
          Pemasukan
        </button>
        <button
          onClick={() => setFilter("expense")}
          className={`filter-badge ${filter === "expense" ? "filter-badge-active" : ""}`}
        >
          Pengeluaran
        </button>
      </div>

      {/* Transactions List */}
      <div className="transaction-list-container animate-fade-in-up" style={{ marginTop: "8px" }}>
        {filteredTransactions.map((tx) => (
          <div key={tx.id} className="transaction-card" style={{ padding: "14px 16px" }}>
            <div className="transaction-left">
              <div className={`transaction-avatar-wrapper ${tx.type === "income" ? "avatar-income" : "avatar-expense"}`} style={{ borderRadius: "14px", width: "44px", height: "44px" }}>
                {tx.type === "income" ? <User size={18} /> : <ArrowDownLeft size={18} />}
              </div>
              <div>
                <h4 className="transaction-text-title" style={{ fontSize: "14px" }}>{tx.title}</h4>
                <p className="transaction-text-subtitle" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ display: "inline-block", padding: "1px 6px", borderRadius: "6px", backgroundColor: "#e2e8f0", fontWeight: 600, fontSize: "9px" }}>
                    {tx.category}
                  </span>
                  • {tx.date}
                </p>
              </div>
            </div>
            <div className={`transaction-amount-label ${tx.type === "income" ? "amount-income" : "amount-expense"}`}>
              {tx.type === "income" ? "+" : "-"}{formatIDR(tx.amount)}
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-secondary)" }}>
            <Calendar size={36} style={{ color: "var(--text-muted)", marginBottom: "12px" }} />
            <p style={{ fontSize: "14px", fontWeight: 500 }}>Tidak ada transaksi ditemukan</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Coba ubah kata kunci pencarian atau filter Anda</p>
          </div>
        )}
      </div>
    </div>
  );
}
