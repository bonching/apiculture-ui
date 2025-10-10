import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { HomePage } from "./components/HomePage";
import { FarmsListPage } from "./components/FarmsListPage";
import { BeehiveDetail } from "./components/BeehiveDetail";
import { AlertsPanel } from "./components/AlertsPanel";
import { ProfilePage } from "./components/ProfilePage";
import { BottomNavigation } from "./components/BottomNavigation";
import { mockFarms, mockAlerts } from "./data/mockData";
import { Beehive } from "./types";

type View = "login" | "home" | "farms" | "beehive" | "alerts" | "profile";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("login");
  const [selectedBeehive, setSelectedBeehive] = useState<Beehive | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setCurrentView("home");
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

  const handleNavigate = (view: string) => {
    setCurrentView(view as View);
    if (view !== "beehive") {
      setSelectedBeehive(null);
    }
  };

  const handleBackFromBeehive = () => {
    setCurrentView("farms");
    setSelectedBeehive(null);
  };

  const showBottomNav = currentView !== "login" && currentView !== "beehive";

  return (
    <div className="size-full">
      {currentView === "login" && (
        <LoginPage onLogin={handleLogin} />
      )}
      
      {currentView === "home" && (
        <HomePage
          farms={mockFarms}
          alertCount={mockAlerts.length}
        />
      )}
      
      {currentView === "farms" && (
        <FarmsListPage
          farms={mockFarms}
          onSelectBeehive={handleSelectBeehive}
        />
      )}
      
      {currentView === "beehive" && selectedBeehive && (
        <BeehiveDetail
          beehive={selectedBeehive}
          onBack={handleBackFromBeehive}
        />
      )}
      
      {currentView === "alerts" && (
        <AlertsPanel alerts={mockAlerts} />
      )}
      
      {currentView === "profile" && (
        <ProfilePage
          userEmail={userEmail}
          farms={mockFarms}
          onLogout={handleLogout}
        />
      )}

      {showBottomNav && (
        <BottomNavigation
          currentView={currentView}
          onNavigate={handleNavigate}
          alertCount={mockAlerts.length}
        />
      )}
    </div>
  );
}
