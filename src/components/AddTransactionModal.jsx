import React, { useState } from "react";
import { X, ArrowUpRight, ArrowDownLeft, Coins, CreditCard, HelpCircle, Plus } from "lucide-react";

export default function AddTransactionModal({ isOpen, onClose, onAdd }) {
  const [type, setType] = useState("expense"); // 'income' or 'expense'
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Kas");

  // Only Kas, Iuran, Lainnya for both income & expense as requested
  const categories = {
    income: ["Kas", "Iuran", "Lainnya"],
    expense: ["Kas", "Iuran", "Lainnya"]
  };

  if (!isOpen) return null;

  const handleAmountChange = (e) => {
    // Keep only raw digits
    const rawValue = e.target.value.replace(/\D/g, "");
    if (!rawValue) {
      setAmount("");
      return;
    }
    // Format digits with Indonesian thousands separator (dot)
    const formattedValue = new Intl.NumberFormat("id-ID").format(parseInt(rawValue));
    setAmount(formattedValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Parse cleaned amount string back to standard number by removing dots
    const cleanAmount = parseFloat(amount.replace(/\./g, ""));
    
    if (!title || !cleanAmount || cleanAmount <= 0) {
      alert("Harap isi semua bidang dengan benar.");
      return;
    }
    
    onAdd(title, cleanAmount, type, category);
    
    // Reset state
    setTitle("");
    setAmount("");
    setCategory("Kas");
    onClose();
  };

  // Auto-switch categories when type changes
  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(categories[newType][0]);
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-bar">
          <h3 className="section-title" style={{ fontSize: "20px" }}>Transaksi Baru</h3>
          <button onClick={onClose} className="modal-close-btn" aria-label="Tutup modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Income/Expense Selector */}
          <div className="transaction-type-selector">
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={`type-btn ${type === "expense" ? "type-btn-expense-active" : ""}`}
            >
              <ArrowDownLeft size={16} />
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={`type-btn ${type === "income" ? "type-btn-income-active" : ""}`}
            >
              <ArrowUpRight size={16} />
              Pemasukan
            </button>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="tx-title">Judul Transaksi</label>
            <div className="input-wrapper">
              <span className="input-icon-left"><Coins size={18} /></span>
              <input
                id="tx-title"
                type="text"
                className="input-field"
                placeholder="cth. Kas Bulanan, Uang Iuran"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Amount (With Real-Time dot separator formatting) */}
          <div className="form-group">
            <label className="form-label" htmlFor="tx-amount">Jumlah Uang (Rp)</label>
            <div className="input-wrapper">
              <span className="input-icon-left" style={{ fontWeight: 600, fontSize: "14px", fontFamily: "var(--font-heading)" }}>Rp</span>
              <input
                id="tx-amount"
                type="text"
                className="input-field"
                placeholder="cth. 150.000"
                value={amount}
                onChange={handleAmountChange}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="tx-category">Kategori</label>
            <div className="dropdown-wrapper">
              <select
                id="tx-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
                style={{ paddingLeft: "16px", appearance: "none" }}
              >
                {categories[type].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDownDropdownIcon />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ 
              marginTop: "12px", 
              background: type === "expense" ? "linear-gradient(135deg, #ef4444, #dc2626)" : "var(--primary-gradient)",
              boxShadow: type === "expense" ? "0 8px 16px rgba(239, 68, 68, 0.2)" : "0 8px 16px rgba(34, 197, 94, 0.25)"
            }}
          >
            <Plus size={18} style={{ marginRight: "6px" }} />
            Simpan Transaksi
          </button>
        </form>
      </div>
    </div>
  );
}

// Inline Helper Component to render custom arrow inside select inputs
function ChevronDownDropdownIcon() {
  return (
    <svg 
      style={{
        position: "absolute",
        right: "16px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "var(--text-secondary)",
        pointerEvents: "none"
      }}
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}
