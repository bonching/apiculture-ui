import { Home, MapPin, Bell, User, Wifi } from "lucide-react";
import { Badge } from "./ui/badge";

interface BottomNavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  alertCount: number;
}

export function BottomNavigation({ currentView, onNavigate, alertCount }: BottomNavigationProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "farms", label: "Farms", icon: MapPin },
    { id: "sensors", label: "Sensors", icon: Wifi },
    { id: "alerts", label: "Alerts", icon: Bell, badge: alertCount },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg">
      <div className="grid grid-cols-5 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-3 px-2 transition-colors ${
                isActive
                  ? "text-amber-500"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                    {item.badge > 9 ? "9+" : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
