import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { BeehiveDetail } from "./components/BeehiveDetail";
import { AlertsPanel } from "./components/AlertsPanel";
import { mockFarms, mockAlerts } from "./data/mockData";
import { Beehive } from "./types";

type View = "login" | "dashboard" | "beehive" | "alerts";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("login");
  const [selectedBeehive, setSelectedBeehive] = useState<Beehive | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setUserEmail("");
    setCurrentView("login");
    setSelectedBeehive(null);
  };

  const handleSelectBeehive = (beehive: Beehive) => {
    setSelectedBeehive(beehive);
    setCurrentView("beehive");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedBeehive(null);
  };

  const handleShowAlerts = () => {
    setCurrentView("alerts");
  };

  return (
    <div className="size-full">
      {currentView === "login" && (
        <LoginPage onLogin={handleLogin} />
      )}
      
      {currentView === "dashboard" && (
        <Dashboard
          farms={mockFarms}
          onSelectBeehive={handleSelectBeehive}
          onShowAlerts={handleShowAlerts}
          onLogout={handleLogout}
          alertCount={mockAlerts.length}
        />
      )}
      
      {currentView === "beehive" && selectedBeehive && (
        <BeehiveDetail
          beehive={selectedBeehive}
          onBack={handleBackToDashboard}
        />
      )}
      
      {currentView === "alerts" && (
        <AlertsPanel
          alerts={mockAlerts}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}
