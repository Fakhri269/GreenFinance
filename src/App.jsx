import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import BottomNav from "./components/BottomNav";
import Sidebar from "./components/Sidebar";
import "./App.css";

function AppContent() {
  const { currentUser } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // Auth screens (no bottom nav/sidebar)
  if (!currentUser) {
    if (isRegistering) {
      return <Register onNavigateToLogin={() => setIsRegistering(false)} />;
    }
    return <Login onNavigateToRegister={() => setIsRegistering(true)} />;
  }

  // Main app with tab navigation
  const renderActivePage = () => {
    switch (activeTab) {
      case "home":
        return <Dashboard setActiveTab={setActiveTab} />;
      case "history":
        return <History />;
      case "analytics":
        return <Analytics />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content-area animate-fade-in">
        {renderActivePage()}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <AppContent />
      </div>
    </AuthProvider>
  );
}
