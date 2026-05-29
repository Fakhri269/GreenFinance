import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, getDocs, addDoc, orderBy } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "../firebase/config";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// No initial dummy data — start from zero
const INITIAL_TRANSACTIONS = [];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  // Start from Rp 0
  const BASE_BALANCE = 0;

  // 1. Setup Authentication Listener
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
      // Mock Auth State Check
      const storedSession = localStorage.getItem("gf_current_user");
      if (storedSession) {
        const user = JSON.parse(storedSession);
        setCurrentUser(user);
        loadMockTransactions(user.uid);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    }
  }, []);

  // 2. Load Transactions from Firebase
  const loadFirebaseTransactions = async (uid) => {
    try {
      const q = query(collection(db, "users", uid, "transactions"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const txList = [];
      querySnapshot.forEach((doc) => {
        txList.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(txList);
    } catch (err) {
      console.error("Error loading transactions:", err);
      setTransactions([]);
    }
  };

  // 3. Load Transactions from Mock Local Storage
  const loadMockTransactions = (uid) => {
    const key = `gf_transactions_${uid}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setTransactions(JSON.parse(stored));
    } else {
      // Start empty
      localStorage.setItem(key, JSON.stringify([]));
      setTransactions([]);
    }
  };

  // 4. Register
  const register = async (email, password, name) => {
    setError(null);
    if (isFirebaseConfigured) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        
        // Save user details to Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email,
          displayName: name,
          createdAt: new Date().toISOString()
        });
        
        setCurrentUser({ ...user, displayName: name });
        setTransactions([]);
        return { success: true };
      } catch (err) {
        setError(err.message);
        throw err;
      }
    } else {
      // Mock Register
      const storedUsers = JSON.parse(localStorage.getItem("gf_users") || "[]");
      if (storedUsers.some(u => u.email === email)) {
        const err = new Error("Email sudah terdaftar!");
        setError(err.message);
        throw err;
      }
      
      const newUid = "mock-uid-" + Math.random().toString(36).substr(2, 9);
      const newUser = { uid: newUid, email, displayName: name };
      
      storedUsers.push(newUser);
      localStorage.setItem("gf_users", JSON.stringify(storedUsers));
      localStorage.setItem(`gf_transactions_${newUid}`, JSON.stringify([]));
      localStorage.setItem("gf_current_user", JSON.stringify(newUser));
      
      setCurrentUser(newUser);
      setTransactions([]);
      return { success: true };
    }
  };

  // 5. Login
  const login = async (email, password) => {
    setError(null);
    if (isFirebaseConfigured) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setCurrentUser(userCredential.user);
        await loadFirebaseTransactions(userCredential.user.uid);
        return { success: true };
      } catch (err) {
        let msg = "Terjadi kesalahan saat masuk.";
        if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
          msg = "Email atau password salah!";
        } else if (err.code === "auth/invalid-email") {
          msg = "Format email tidak valid!";
        }
        setError(msg);
        throw new Error(msg);
      }
    } else {
      // Mock Login
      const storedUsers = JSON.parse(localStorage.getItem("gf_users") || "[]");
      const user = storedUsers.find(u => u.email === email);
      
      // Let's create an auto-register mock account if someone logs in with standard demo emails,
      // or if they just put some credentials, let them login instantly to explore!
      if (!user) {
        // Auto-register on first login for seamless demo
        const newUid = "mock-uid-demo";
        const newUser = { uid: newUid, email, displayName: email.split("@")[0] };
        storedUsers.push(newUser);
        localStorage.setItem("gf_users", JSON.stringify(storedUsers));
        localStorage.setItem(`gf_transactions_${newUid}`, JSON.stringify([]));
        localStorage.setItem("gf_current_user", JSON.stringify(newUser));
        
        setCurrentUser(newUser);
        setTransactions([]);
        return { success: true };
      }
      
      localStorage.setItem("gf_current_user", JSON.stringify(user));
      setCurrentUser(user);
      loadMockTransactions(user.uid);
      return { success: true };
    }
  };

  // 6. Logout
  const logout = async () => {
    if (isFirebaseConfigured) {
      await signOut(auth);
    } else {
      localStorage.removeItem("gf_current_user");
      setCurrentUser(null);
      setTransactions([]);
    }
  };

  // 7. Add Transaction
  const addTransaction = async (title, amount, type, category) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    const now = new Date();
    const dateStr = `Hari ini, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    const newTx = {
      title,
      amount: parseFloat(amount),
      type,
      category,
      date: dateStr,
      timestamp: now.getTime()
    };

    if (isFirebaseConfigured && currentUser) {
      try {
        const docRef = await addDoc(collection(db, "users", currentUser.uid, "transactions"), newTx);
        const savedTx = { id: docRef.id, ...newTx };
        setTransactions(prev => [savedTx, ...prev]);
      } catch (err) {
        console.error("Error adding transaction to Firebase:", err);
        // Local state update in case of failure
        setTransactions(prev => [{ id: Math.random().toString(), ...newTx }, ...prev]);
      }
    } else if (currentUser) {
      // Mock Local Storage addition
      const key = `gf_transactions_${currentUser.uid}`;
      const savedTransactions = [
        { id: "tx-" + Math.random().toString(36).substr(2, 9), ...newTx },
        ...transactions
      ];
      localStorage.setItem(key, JSON.stringify(savedTransactions));
      setTransactions(savedTransactions);
    }
  };

  // 8. Calculations
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = BASE_BALANCE + totalIncome - totalExpense;

  const value = {
    currentUser,
    transactions,
    loading,
    error,
    totalIncome,
    totalExpense,
    totalBalance,
    login,
    register,
    logout,
    addTransaction,
    isFirebase: isFirebaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
