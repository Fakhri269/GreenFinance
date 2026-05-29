import React, { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, User, Plus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import TrendChart from "../components/TrendChart";
import AddTransactionModal from "../components/AddTransactionModal";

export default function Dashboard({ setActiveTab }) {
  const { 
    currentUser, 
    transactions, 
    totalIncome, 
    totalExpense, 
    totalBalance,
    addTransaction 
  } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format currency helper
  const formatIDR = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num).replace("Rp", "Rp ");
  };

  // Only take the first 4 recent transactions for Dashboard view
  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="page-container animate-fade-in">
      {/* Top Banner (Screenshot 2) */}
      <div className="dashboard-header">
        <div className="header-top-bar">
          <div>
            <p className="balance-title">Saldo Total</p>
            <h2 className="balance-amount">{formatIDR(totalBalance)}</h2>
          </div>
          <button 
            className="avatar-button" 
            onClick={() => setActiveTab("profile")}
            aria-label="Buka profil"
          >
            {currentUser && currentUser.displayName ? (
              <span style={{ fontWeight: 700, fontSize: "16px", fontFamily: "var(--font-heading)" }}>
                {currentUser.displayName.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User size={20} />
            )}
          </button>
        </div>

        {/* Pemasukan and Pengeluaran Grid (Screenshot 2) */}
        <div className="stats-grid">
          {/* Income Card */}
          <div className="stat-card-header animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
            <div className="stat-icon-wrapper">
              <span className="icon-bg" style={{ backgroundColor: "rgba(255, 255, 255, 0.22)" }}>
                <ArrowDownLeft size={14} style={{ transform: "rotate(180deg)" }} />
              </span>
              Pemasukan
            </div>
            <h3 className="stat-card-amount">{formatIDR(totalIncome)}</h3>
            <span className="stat-growth-badge">
              <span style={{ transform: "rotate(45deg)", display: "inline-block" }}>↑</span> +12.5%
            </span>
          </div>

          {/* Expense Card */}
          <div className="stat-card-header animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="stat-icon-wrapper">
              <span className="icon-bg" style={{ backgroundColor: "rgba(255, 255, 255, 0.22)" }}>
                <ArrowUpRight size={14} style={{ transform: "rotate(180deg)" }} />
              </span>
              Pengeluaran
            </div>
            <h3 className="stat-card-amount">{formatIDR(totalExpense)}</h3>
            <span className="stat-growth-badge">
              <span style={{ transform: "rotate(45deg)", display: "inline-block" }}>↓</span> -8.2%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {/* Monthly Statistics Chart (Screenshot 2) */}
        <TrendChart transactions={transactions} />

        {/* Recent Transactions List (Screenshot 2) */}
        <div className="section-wrapper animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <div className="section-title-bar">
            <h3 className="section-title">Recent Transactions</h3>
            <button 
              onClick={() => setActiveTab("history")} 
              className="section-see-all"
              aria-label="Lihat semua transaksi"
            >
              See All
            </button>
          </div>

          <div className="transaction-list-container">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="transaction-card">
                <div className="transaction-left">
                  <div className={`transaction-avatar-wrapper ${tx.type === "income" ? "avatar-income" : "avatar-expense"}`}>
                    {tx.type === "income" ? <User size={18} /> : <ArrowDownLeft size={18} />}
                  </div>
                  <div>
                    <h4 className="transaction-text-title">{tx.title}</h4>
                    <p className="transaction-text-subtitle">{tx.date}</p>
                  </div>
                </div>
                <div className={`transaction-amount-label ${tx.type === "income" ? "amount-income" : "amount-expense"}`}>
                  {tx.type === "income" ? "+" : "-"}{formatIDR(tx.amount)}
                </div>
              </div>
            ))}
            
            {transactions.length === 0 && (
              <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "13px", padding: "12px" }}>
                Belum ada transaksi.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button (Screenshot 2) */}
      <div className="fab-container animate-fade-in">
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="fab-button"
          aria-label="Tambah Transaksi Baru"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Add Transaction Dialog */}
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addTransaction} 
      />
    </div>
  );
}
