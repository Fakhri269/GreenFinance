import React, { useState, useEffect } from "react";
import { X, ArrowUpRight, ArrowDownLeft, Coins, Plus, Pencil } from "lucide-react";

export default function AddTransactionModal({ isOpen, onClose, onAdd, onEdit, editData }) {
  const isEditMode = !!editData;

  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Kas");

  const categories = {
    income:  ["Kas", "Iuran", "Lainnya"],
    expense: ["Kas", "Iuran", "Lainnya"]
  };

  // Populate fields when editing
  useEffect(() => {
    if (editData) {
      setType(editData.type || "expense");
      setTitle(editData.title || "");
      setCategory(editData.category || "Kas");
      const formatted = editData.amount
        ? new Intl.NumberFormat("id-ID").format(editData.amount)
        : "";
      setAmount(formatted);
    } else {
      setType("expense");
      setTitle("");
      setAmount("");
      setCategory("Kas");
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) { setAmount(""); return; }
    setAmount(new Intl.NumberFormat("id-ID").format(parseInt(raw)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanAmount = parseFloat(amount.replace(/\./g, ""));
    if (!title || !cleanAmount || cleanAmount <= 0) {
      alert("Harap isi semua bidang dengan benar.");
      return;
    }
    if (isEditMode) {
      onEdit(editData.id, title, cleanAmount, type, category);
    } else {
      onAdd(title, cleanAmount, type, category);
    }
    onClose();
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(categories[newType][0]);
  };

  const isExpense = type === "expense";

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-bar">
          <h3 className="section-title" style={{ fontSize: 20 }}>
            {isEditMode ? "Edit Transaksi" : "Transaksi Baru"}
          </h3>
          <button onClick={onClose} className="modal-close-btn" aria-label="Tutup modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="transaction-type-selector">
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={`type-btn ${type === "expense" ? "type-btn-expense-active" : ""}`}
            >
              <ArrowDownLeft size={16} /> Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={`type-btn ${type === "income" ? "type-btn-income-active" : ""}`}
            >
              <ArrowUpRight size={16} /> Pemasukan
            </button>
          </div>

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

          <div className="form-group">
            <label className="form-label" htmlFor="tx-amount">Jumlah Uang (Rp)</label>
            <div className="input-wrapper">
              <span
                className="input-icon-left"
                style={{ fontWeight: 600, fontSize: 14, fontFamily: "var(--font-heading)" }}
              >
                Rp
              </span>
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

          <div className="form-group">
            <label className="form-label" htmlFor="tx-category">Kategori</label>
            <div className="dropdown-wrapper">
              <select
                id="tx-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
                style={{ paddingLeft: 16, appearance: "none" }}
              >
                {categories[type].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronIcon />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              marginTop: 12,
              background: isEditMode
                ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                : isExpense
                ? "linear-gradient(135deg, #ef4444, #dc2626)"
                : "var(--primary-gradient)",
              boxShadow: isEditMode
                ? "0 8px 16px rgba(59,130,246,0.25)"
                : isExpense
                ? "0 8px 16px rgba(239,68,68,0.2)"
                : "0 8px 16px rgba(34,197,94,0.25)",
            }}
          >
            {isEditMode ? <Pencil size={18} style={{ marginRight: 6 }} /> : <Plus size={18} style={{ marginRight: 6 }} />}
            {isEditMode ? "Simpan Perubahan" : "Simpan Transaksi"}
          </button>
        </form>
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      style={{
        position: "absolute", right: 16, top: "50%",
        transform: "translateY(-50%)",
        color: "var(--text-secondary)", pointerEvents: "none"
      }}
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}