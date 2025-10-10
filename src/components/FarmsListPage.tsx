import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Droplet, TrendingUp, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { Farm, Beehive } from "../types";

interface FarmsListPageProps {
  farms: Farm[];
  onSelectBeehive: (beehive: Beehive) => void;
}

export function FarmsListPage({ farms, onSelectBeehive }: FarmsListPageProps) {
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
    <div className="p-4 pb-24 space-y-6 bg-gradient-to-b from-amber-50 to-yellow-100 min-h-screen">
      <div>
        <h1>My Farms</h1>
        <p className="text-muted-foreground">Manage all your apiaries</p>
      </div>

      {farms.map((farm) => (
        <div key={farm.id}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2>{farm.name}</h2>
              <p className="text-muted-foreground">{farm.location}</p>
            </div>
            <Badge variant="secondary">{farm.beehives.length} hives</Badge>
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
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {beehive.name}
                        {beehive.hasAlert && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        {beehive.sensors.status === "offline" && (
                          <WifiOff className="h-4 w-4 text-red-500" />
                        )}
                        {beehive.sensors.status === "online" && (
                          <Wifi className="h-4 w-4 text-green-500" />
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
                        {beehive.sensors.status === "online" 
                          ? `${beehive.sensors.temperature}°C`
                          : "---"
                        }
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground">Humidity</div>
                      <div className="flex items-center justify-center gap-1">
                        <Droplet className="h-3 w-3" />
                        {beehive.sensors.status === "online"
                          ? `${beehive.sensors.humidity}%`
                          : "---"
                        }
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
  );
}
