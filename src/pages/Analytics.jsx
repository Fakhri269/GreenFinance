import React from "react";
import { PieChart, TrendingDown, Coins, CreditCard, HelpCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Analytics() {
  const { transactions, totalExpense } = useAuth();

  const formatIDR = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num).replace("Rp", "Rp ");
  };

  // Get only expenses
  const expenses = transactions.filter((t) => t.type === "expense");

  // Aggregate by category
  const categoryTotals = expenses.reduce((acc, curr) => {
    const cat = curr.category;
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {});

  // Category Icons Map (Only Kas, Iuran, Lainnya)
  const categoryIcons = {
    "Kas": { icon: Coins, color: "#22C55E", bg: "rgba(34, 197, 94, 0.1)" },
    "Iuran": { icon: CreditCard, color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
    "Lainnya": { icon: HelpCircle, color: "#64748b", bg: "rgba(100, 116, 139, 0.1)" }
  };

  const defaultStyle = { icon: HelpCircle, color: "#64748b", bg: "rgba(100, 116, 139, 0.1)" };

  // Calculate percentages
  const sortedCategories = Object.keys(categoryTotals).map((cat) => {
    const amount = categoryTotals[cat];
    const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
    return { name: cat, amount, percentage };
  }).sort((a, b) => b.amount - a.amount);

  return (
    <div className="page-container animate-fade-in" style={{ padding: "24px 20px 84px 20px" }}>
      <h2 className="section-title" style={{ fontSize: "22px", marginBottom: "18px" }}>Analisis Keuangan</h2>

      {/* Overview Card */}
      <div className="section-wrapper" style={{ marginBottom: "20px", display: "flex", gap: "16px", alignItems: "center" }}>
        <div style={{ width: "50px", height: "50px", borderRadius: "16px", backgroundColor: "#fee2e2", display: "flex", justifyContent: "center", alignItems: "center", color: "var(--danger-color)" }}>
          <TrendingDown size={24} />
        </div>
        <div>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>Total Pengeluaran Bulan Ini</p>
          <h3 className="section-title" style={{ fontSize: "20px", marginTop: "2px" }}>{formatIDR(totalExpense)}</h3>
        </div>
      </div>

      {/* Categories breakdown */}
      <div className="section-wrapper animate-fade-in-up">
        <h3 className="section-title" style={{ fontSize: "16px", marginBottom: "16px" }}>Berdasarkan Kategori</h3>
        
        <div className="analytics-grid">
          {sortedCategories.map((cat) => {
            const style = categoryIcons[cat.name] || defaultStyle;
            const IconComponent = style.icon;

            return (
              <div key={cat.name} style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "4px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: style.bg,
                  color: style.color,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0
                }}>
                  <IconComponent size={20} />
                </div>
                
                <div style={{ flexGrow: 1 }}>
                  <div className="category-row">
                    <span className="category-row-label">{cat.name}</span>
                    <span className="category-row-val">{formatIDR(cat.amount)} <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 500 }}>({cat.percentage.toFixed(1)}%)</span></span>
                  </div>
                  
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${cat.percentage}%`, 
                        backgroundColor: style.color 
                      }} 
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {sortedCategories.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 10px", color: "var(--text-secondary)" }}>
              <PieChart size={36} style={{ color: "var(--text-muted)", marginBottom: "12px" }} />
              <p style={{ fontSize: "14px", fontWeight: 500 }}>Belum ada pengeluaran</p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Tambahkan transaksi pengeluaran untuk melihat analitik</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
