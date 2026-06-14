import React, { useState, useEffect } from "react";
import { ArrowDownLeft, User, TrendingUp, TrendingDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import TrendChart from "../components/TrendChart";
import AddTransactionModal from "../components/AddTransactionModal";

export default function Dashboard({ setActiveTab, isModalOpen, setIsModalOpen }) {
  const {
    currentUser,
    transactions,
    totalIncome,
    totalExpense,
    totalBalance,
    addTransaction
  } = useAuth();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const formatIDR = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num).replace("Rp", "Rp ");

  const getMonthlyStats = () => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const thisMonthTx = transactions.filter((t) => {
      const d = new Date(t.timestamp);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });

    const lastMonthTx = transactions.filter((t) => {
      const d = new Date(t.timestamp);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    });

    const sumBy = (list, type) =>
      list.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);

    const thisIncome  = sumBy(thisMonthTx, "income");
    const lastIncome  = sumBy(lastMonthTx, "income");
    const thisExpense = sumBy(thisMonthTx, "expense");
    const lastExpense = sumBy(lastMonthTx, "expense");

    const calcPct = (curr, prev) => {
      if (prev === 0 && curr === 0) return null;
      if (prev === 0) return 100;
      return Math.round(((curr - prev) / prev) * 100);
    };

    return {
      incomePct:  calcPct(thisIncome,  lastIncome),
      expensePct: calcPct(thisExpense, lastExpense),
    };
  };

  const { incomePct, expensePct } = getMonthlyStats();

  const formatPct = (pct, type) => {
    if (pct === null) return "Belum ada data";
    const sign = pct >= 0 ? "+" : "";
    if (type === "income") {
      return pct >= 0
        ? `${sign}${pct}% dari bulan lalu`
        : `${pct}% dari bulan lalu`;
    }
    return pct >= 0
      ? `+${pct}% dari bulan lalu`
      : `${pct}% dari bulan lalu`;
  };

  const incomeColor  = incomePct === null ? "rgba(255,255,255,0.7)" : incomePct  >= 0 ? "#86efac" : "#fca5a5";
  const expenseColor = expensePct === null ? "rgba(255,255,255,0.7)" : expensePct <= 0 ? "#86efac" : "#fca5a5";

  const recentTransactions = transactions.slice(0, 4);
  const name = currentUser?.displayName || "Pengguna";

  const anim = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.45s ease ${delay}, transform 0.45s ease ${delay}`,
  });

  return (
    <div className="page-container" style={anim("0s")}>
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-top-bar" style={anim("0.05s")}>
          <div>
            <p className="balance-title">
              Selamat datang, {name.split(" ")[0]} 👋
            </p>
            <h2 className="balance-amount" style={anim("0.1s")}>
              {formatIDR(totalBalance)}
            </h2>
          </div>
          <button
            className="avatar-button"
            onClick={() => setActiveTab("profile")}
            aria-label="Buka profil"
          >
            {currentUser?.displayName ? (
              <span style={{ fontWeight: 700, fontSize: 16 }}>
                {currentUser.displayName.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User size={20} />
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card-header" style={anim("0.15s")}>
            <div className="stat-icon-wrapper">
              <span className="icon-bg">
                <TrendingUp size={14} />
              </span>
              Pemasukan
            </div>
            <h3 className="stat-card-amount">{formatIDR(totalIncome)}</h3>
            <span className="stat-growth-badge" style={{ color: incomeColor, fontSize: 11 }}>
              {formatPct(incomePct, "income")}
            </span>
          </div>

          <div className="stat-card-header" style={anim("0.2s")}>
            <div className="stat-icon-wrapper">
              <span className="icon-bg">
                <TrendingDown size={14} />
              </span>
              Pengeluaran
            </div>
            <h3 className="stat-card-amount">{formatIDR(totalExpense)}</h3>
            <span className="stat-growth-badge" style={{ color: expenseColor, fontSize: 11 }}>
              {formatPct(expensePct, "expense")}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        <div style={anim("0.25s")}>
          <TrendChart transactions={transactions} />
        </div>

        <div className="section-wrapper" style={anim("0.3s")}>
          <div className="section-title-bar">
            <h3 className="section-title">Transaksi Terbaru</h3>
            <button
              onClick={() => setActiveTab("history")}
              className="section-see-all"
              aria-label="Lihat semua transaksi"
            >
              Lihat Semua
            </button>
          </div>

          <div className="transaction-list-container">
            {recentTransactions.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 0",
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  ...anim("0.35s"),
                }}
              >
                <ArrowDownLeft size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                <p>Belum ada transaksi.</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>
                  Tap + untuk menambah transaksi pertama.
                </p>
              </div>
            ) : (
              recentTransactions.map((tx, i) => (
                <div
                  key={tx.id}
                  className="transaction-card"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateX(0)" : "translateX(-10px)",
                    transition: `opacity 0.4s ease ${0.35 + i * 0.07}s, transform 0.4s ease ${0.35 + i * 0.07}s`,
                  }}
                >
                  <div className="transaction-left">
                    <div
                      className={`transaction-avatar-wrapper ${
                        tx.type === "income" ? "avatar-income" : "avatar-expense"
                      }`}
                    >
                      {tx.type === "income" ? (
                        <TrendingUp size={18} />
                      ) : (
                        <ArrowDownLeft size={18} />
                      )}
                    </div>
                    <div>
                      <h4 className="transaction-text-title">{tx.title}</h4>
                      <p className="transaction-text-subtitle">{tx.date}</p>
                    </div>
                  </div>
                  <div
                    className={`transaction-amount-label ${
                      tx.type === "income" ? "amount-income" : "amount-expense"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {formatIDR(tx.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTransaction}
      />
    </div>
  );
}