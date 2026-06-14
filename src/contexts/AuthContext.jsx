import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy
} from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "../firebase/config";

const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const loadFirebaseTransactions = async (uid) => {
    try {
      const q = query(
        collection(db, "users", uid, "transactions"),
        orderBy("timestamp", "desc")
      );
      const snap = await getDocs(q);
      setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Gagal memuat transaksi:", err);
      setTransactions([]);
    }
  };

  const loadMockTransactions = (uid) => {
    const key = `gf_transactions_${uid}`;
    const stored = localStorage.getItem(key);
    setTransactions(stored ? JSON.parse(stored) : []);
    if (!stored) localStorage.setItem(key, JSON.stringify([]));
  };

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
          await loadFirebaseTransactions(user.uid);
        } else {
          setCurrentUser(null);
          setTransactions([]);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      const stored = localStorage.getItem("gf_current_user");
      if (stored) {
        const user = JSON.parse(stored);
        setCurrentUser(user);
        loadMockTransactions(user.uid);
      }
      setLoading(false);
    }
  }, []);

  const register = async (email, password, name) => {
    setError(null);
    if (isFirebaseConfigured) {
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid, email, displayName: name,
          createdAt: new Date().toISOString()
        });
        await user.reload();
        setCurrentUser({ ...user, displayName: name });
        setTransactions([]);
        return { success: true };
      } catch (err) {
        const msg =
          err.code === "auth/email-already-in-use" ? "Email sudah digunakan!" :
          err.code === "auth/weak-password"         ? "Password minimal 6 karakter!" :
          err.code === "auth/invalid-email"         ? "Format email tidak valid!" :
          "Gagal mendaftar. Coba lagi.";
        setError(msg); throw new Error(msg);
      }
    }
    const users = JSON.parse(localStorage.getItem("gf_users") || "[]");
    if (users.some((u) => u.email === email)) {
      const msg = "Email sudah terdaftar!"; setError(msg); throw new Error(msg);
    }
    const uid = "mock-" + Math.random().toString(36).substr(2, 9);
    const newUser = { uid, email, displayName: name };
    users.push(newUser);
    localStorage.setItem("gf_users", JSON.stringify(users));
    localStorage.setItem(`gf_transactions_${uid}`, JSON.stringify([]));
    localStorage.setItem("gf_current_user", JSON.stringify(newUser));
    setCurrentUser(newUser); setTransactions([]);
    return { success: true };
  };

  const login = async (email, password) => {
    setError(null);
    if (isFirebaseConfigured) {
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        setCurrentUser(user);
        await loadFirebaseTransactions(user.uid);
        return { success: true };
      } catch (err) {
        const msg =
          err.code === "auth/user-not-found"    ? "Akun tidak ditemukan!" :
          err.code === "auth/wrong-password"     ? "Password salah!" :
          err.code === "auth/invalid-credential" ? "Email atau password salah!" :
          err.code === "auth/invalid-email"      ? "Format email tidak valid!" :
          err.code === "auth/too-many-requests"  ? "Terlalu banyak percobaan. Coba lagi nanti." :
          "Gagal masuk. Coba lagi.";
        setError(msg); throw new Error(msg);
      }
    }
    const users = JSON.parse(localStorage.getItem("gf_users") || "[]");
    const user = users.find((u) => u.email === email);
    if (!user) {
      const msg = "Akun tidak ditemukan!"; setError(msg); throw new Error(msg);
    }
    localStorage.setItem("gf_current_user", JSON.stringify(user));
    setCurrentUser(user); loadMockTransactions(user.uid);
    return { success: true };
  };

  const signInWithGoogle = async () => {
    setError(null);
    if (isFirebaseConfigured) {
      try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        const { user } = await signInWithPopup(auth, provider);
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid, email: user.email,
            displayName: user.displayName,
            createdAt: new Date().toISOString()
          });
        }
        setCurrentUser(user);
        await loadFirebaseTransactions(user.uid);
        return { success: true };
      } catch (err) {
        if (err.code === "auth/popup-closed-by-user") return;
        const msg =
          err.code === "auth/popup-blocked" ? "Popup diblokir browser. Izinkan popup lalu coba lagi." :
          "Gagal masuk dengan Google. Coba lagi.";
        setError(msg); throw new Error(msg);
      }
    }
    const uid = "mock-google";
    const newUser = { uid, email: "google@demo.com", displayName: "Google User" };
    // Pastikan mock Google user tersimpan di gf_users agar getPin/savePin bisa akses
    const users = JSON.parse(localStorage.getItem("gf_users") || "[]");
    if (!users.some((u) => u.uid === uid)) {
      users.push(newUser);
      localStorage.setItem("gf_users", JSON.stringify(users));
    }
    localStorage.setItem("gf_current_user", JSON.stringify(newUser));
    localStorage.setItem(`gf_transactions_${uid}`, JSON.stringify([]));
    setCurrentUser(newUser); setTransactions([]);
    return { success: true };
  };

  const logout = async () => {
    if (isFirebaseConfigured) { await signOut(auth); }
    else { localStorage.removeItem("gf_current_user"); }
    setCurrentUser(null); setTransactions([]);
  };

  const addTransaction = async (title, amount, type, category) => {
    const now = new Date();
    const newTx = {
      title, amount: parseFloat(amount), type, category,
      date: `Hari ini, ${now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`,
      timestamp: now.getTime()
    };
    if (isFirebaseConfigured && currentUser) {
      try {
        const ref = await addDoc(collection(db, "users", currentUser.uid, "transactions"), newTx);
        setTransactions((prev) => [{ id: ref.id, ...newTx }, ...prev]);
        return;
      } catch (err) { console.error("Gagal menyimpan:", err); }
    }
    const tx = { id: "tx-" + Math.random().toString(36).substr(2, 9), ...newTx };
    const updated = [tx, ...transactions];
    setTransactions(updated);
    if (currentUser) localStorage.setItem(`gf_transactions_${currentUser.uid}`, JSON.stringify(updated));
  };

  // ─── Edit Transaction ──────────────────────────────────────────────────────
  const editTransaction = async (id, title, amount, type, category) => {
    const updates = { title, amount: parseFloat(amount), type, category };
    if (isFirebaseConfigured && currentUser) {
      try {
        await updateDoc(doc(db, "users", currentUser.uid, "transactions", id), updates);
      } catch (err) { console.error("Gagal edit:", err); }
    }
    const updated = transactions.map((tx) => tx.id === id ? { ...tx, ...updates } : tx);
    setTransactions(updated);
    if (!isFirebaseConfigured && currentUser) {
      localStorage.setItem(`gf_transactions_${currentUser.uid}`, JSON.stringify(updated));
    }
  };

  // ─── Delete Transaction ────────────────────────────────────────────────────
  const deleteTransaction = async (id) => {
    if (isFirebaseConfigured && currentUser) {
      try {
        await deleteDoc(doc(db, "users", currentUser.uid, "transactions", id));
      } catch (err) { console.error("Gagal hapus:", err); }
    }
    const updated = transactions.filter((tx) => tx.id !== id);
    setTransactions(updated);
    if (!isFirebaseConfigured && currentUser) {
      localStorage.setItem(`gf_transactions_${currentUser.uid}`, JSON.stringify(updated));
    }
  };

  // ─── PIN Management ───────────────────────────────────────────────────────
  const savePin = async (pin) => {
    if (isFirebaseConfigured && currentUser) {
      await setDoc(doc(db, "users", currentUser.uid), { editPin: pin }, { merge: true });
      return;
    }
    if (currentUser) {
      // Simpan PIN langsung ke gf_current_user dan gf_users
      const updatedUser = { ...currentUser, editPin: pin };
      localStorage.setItem("gf_current_user", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      const users = JSON.parse(localStorage.getItem("gf_users") || "[]");
      const updatedUsers = users.map((u) =>
        u.uid === currentUser.uid ? { ...u, editPin: pin } : u
      );
      // Kalau user belum ada di list (misal mock-google lama), tambahkan
      if (!updatedUsers.some((u) => u.uid === currentUser.uid)) {
        updatedUsers.push(updatedUser);
      }
      localStorage.setItem("gf_users", JSON.stringify(updatedUsers));
    }
  };

  const getPin = async () => {
    if (isFirebaseConfigured && currentUser) {
      const snap = await getDoc(doc(db, "users", currentUser.uid));
      return snap.exists() ? snap.data().editPin || null : null;
    }
    if (currentUser) {
      // Cek dari currentUser state dulu (paling fresh)
      if (currentUser.editPin) return currentUser.editPin;

      // Fallback ke gf_current_user di localStorage
      const stored = localStorage.getItem("gf_current_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.editPin) return u.editPin;
      }

      // Fallback ke gf_users
      const users = JSON.parse(localStorage.getItem("gf_users") || "[]");
      const user = users.find((u) => u.uid === currentUser.uid);
      return user?.editPin || null;
    }
    return null;
  };

  const totalIncome  = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  const value = {
    currentUser, transactions, loading, error,
    totalIncome, totalExpense, totalBalance,
    login, register, logout,
    addTransaction, editTransaction, deleteTransaction,
    savePin, getPin,
    signInWithGoogle,
    isFirebase: isFirebaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}