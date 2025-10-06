import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Bell, LogOut, Droplet, TrendingUp, AlertTriangle } from "lucide-react";
import { Farm, Beehive } from "../types";

interface DashboardProps {
  farms: Farm[];
  onSelectBeehive: (beehive: Beehive) => void;
  onShowAlerts: () => void;
  onLogout: () => void;
  alertCount: number;
}

export function Dashboard({ farms, onSelectBeehive, onShowAlerts, onLogout, alertCount }: DashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500";
      case "good":
        return "bg-blue-500";
      case "fair":
        return "bg-yellow-500";
      case "poor":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-100 pb-6">
      {/* Header */}
      <div className="bg-amber-500 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1>My Apiaries</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-amber-600"
              onClick={onShowAlerts}
            >
              <Bell className="h-5 w-5" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-amber-600"
              onClick={onLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/20 rounded-lg p-2 text-center">
            <div className="opacity-90">Total Hives</div>
            <div>{farms.reduce((acc, farm) => acc + farm.beehives.length, 0)}</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2 text-center">
            <div className="opacity-90">Farms</div>
            <div>{farms.length}</div>
          </div>
          <div className="bg-white/20 rounded-lg p-2 text-center">
            <div className="opacity-90">Alerts</div>
            <div>{alertCount}</div>
          </div>
        </div>
      </div>

      {/* Farms and Beehives */}
      <div className="p-4 space-y-6">
        {farms.map((farm) => (
          <div key={farm.id}>
            <div className="flex items-center justify-between mb-3">
              <h2>{farm.name}</h2>
              <Badge variant="secondary">{farm.location}</Badge>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {farm.beehives.map((beehive) => (
                <Card
                  key={beehive.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onSelectBeehive(beehive)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {beehive.name}
                          {beehive.hasAlert && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </CardTitle>
                        <CardDescription>ID: {beehive.id}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(beehive.harvestStatus)}>
                        {getStatusText(beehive.harvestStatus)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-muted-foreground">Temp</div>
                        <div className="flex items-center justify-center gap-1">
                          {beehive.sensors.temperature}°C
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground">Humidity</div>
                        <div className="flex items-center justify-center gap-1">
                          <Droplet className="h-3 w-3" />
                          {beehive.sensors.humidity}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground">Harvest</div>
                        <div className="flex items-center justify-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {beehive.honeyProduction}kg
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
