import React, { useState, useRef, useEffect } from "react";
import { X, Lock, Eye, EyeOff } from "lucide-react";

export default function PinModal({ mode, onSuccess, onClose, getPin, savePin }) {
  const [step, setStep] = useState(mode === "setup" ? "create" : "verify");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const confirmRefs = useRef([]);

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, []);

  const handleInput = (val, idx, arr, setArr, refs, nextAction) => {
    if (!/^\d?$/.test(val)) return;
    const updated = [...arr];
    updated[idx] = val;
    setArr(updated);
    setError("");
    if (val && idx < 3) refs.current[idx + 1]?.focus();
    if (val && idx === 3) nextAction(updated);
  };

  const handleKeyDown = (e, idx, refs, arr, setArr) => {
    if (e.key === "Backspace" && !arr[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async (currentPin) => {
    const entered = currentPin.join("");
    if (entered.length < 4) return;
    setLoading(true);
    const stored = await getPin();
    setLoading(false);
    if (!stored) {
      setError("PIN belum diatur.");
      return;
    }
    if (entered === stored) {
      onSuccess();
    } else {
      setError("PIN salah. Coba lagi.");
      setPin(["", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  };

  const handleCreate = (currentPin) => {
    if (currentPin.join("").length < 4) return;
    setStep("confirm");
    setConfirmPin(["", "", "", ""]);
    setTimeout(() => confirmRefs.current[0]?.focus(), 100);
  };

  const handleConfirm = async (currentConfirm) => {
    const p1 = pin.join("");
    const p2 = currentConfirm.join("");
    if (p2.length < 4) return;
    if (p1 !== p2) {
      setError("PIN tidak cocok. Ulangi.");
      setConfirmPin(["", "", "", ""]);
      setTimeout(() => confirmRefs.current[0]?.focus(), 50);
      return;
    }
    setLoading(true);
    await savePin(p1);
    setLoading(false);
    onSuccess();
  };

  const activeArr   = step === "confirm" ? confirmPin : pin;
  const setActiveArr = step === "confirm" ? setConfirmPin : setPin;
  const activeRefs  = step === "confirm" ? confirmRefs : inputRefs;
  const nextAction  = step === "create" ? handleCreate : step === "confirm" ? handleConfirm : handleVerify;

  const titles = {
    verify: "Masukkan PIN",
    create: "Buat PIN Baru",
    confirm: "Konfirmasi PIN",
  };
  const subtitles = {
    verify: "Masukkan 4 digit PIN untuk melanjutkan.",
    create: "Buat PIN 4 digit untuk mengamankan edit transaksi.",
    confirm: "Masukkan ulang PIN yang sama.",
  };

  return (
    <div
      className="modal-overlay animate-fade-in"
      onClick={onClose}
      style={{ alignItems: "center" }}
    >
      <div
        className="modal-content-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 360,
          borderRadius: 24,
          padding: "32px 28px",
          textAlign: "center",
        }}
      >
        <button
          onClick={onClose}
          className="modal-close-btn"
          style={{ position: "absolute", top: 16, right: 16 }}
          aria-label="Tutup"
        >
          <X size={18} />
        </button>

        <div
          style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg, #16a34a, #22c55e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <Lock size={24} color="white" />
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
          {titles[step]}
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 28 }}>
          {subtitles[step]}
        </p>

        {/* PIN dots */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 8 }}>
          {activeArr.map((val, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              <input
                ref={(el) => (activeRefs.current[idx] = el)}
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={1}
                value={val}
                onChange={(e) => handleInput(e.target.value, idx, activeArr, setActiveArr, activeRefs, nextAction)}
                onKeyDown={(e) => handleKeyDown(e, idx, activeRefs, activeArr, setActiveArr)}
                style={{
                  width: 52, height: 60,
                  textAlign: "center",
                  fontSize: 24, fontWeight: 700,
                  border: `2px solid ${val ? "#22c55e" : error ? "#ef4444" : "#e2e8f0"}`,
                  borderRadius: 14,
                  background: val ? "#f0fdf4" : "#f8fafc",
                  color: "var(--text-primary)",
                  outline: "none",
                  transition: "all 0.15s ease",
                  caretColor: "transparent",
                }}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowPin(!showPin)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-secondary)", fontSize: 12,
            display: "flex", alignItems: "center", gap: 4,
            margin: "8px auto 0",
          }}
        >
          {showPin ? <EyeOff size={14} /> : <Eye size={14} />}
          {showPin ? "Sembunyikan" : "Tampilkan"} PIN
        </button>

        {error && (
          <p style={{
            color: "#ef4444", fontSize: 13, marginTop: 16,
            background: "#fef2f2", padding: "8px 12px",
            borderRadius: 8, border: "1px solid #fecaca"
          }}>
            {error}
          </p>
        )}

        {loading && (
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 16 }}>
            Memproses...
          </p>
        )}
      </div>
    </div>
  );
}