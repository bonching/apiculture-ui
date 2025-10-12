import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Hexagon, MapPin, Droplets, Wifi, WifiOff, TrendingUp, AlertTriangle } from "lucide-react";
import { Farm, Beehive, Sensor } from "../types";

interface HomePageProps {
  farms: Farm[];
  beehives: Beehive[];
  sensors: Sensor[];
  alertCount: number;
  onNavigateToSensors: (statusFilter?: "online" | "offline") => void;
}

export function HomePage({ farms, beehives, sensors, alertCount, onNavigateToSensors }: HomePageProps) {
  // Calculate total stats
  const totalBeehives = beehives.length;
  const totalHoneyProduction = beehives.reduce((sum, hive) => sum + hive.honeyProduction, 0);
  const onlineSensors = sensors.filter(s => s.status === "online").length;
  const offlineSensors = sensors.filter(s => s.status === "offline").length;

  // Calculate health status distribution
  const healthStats = beehives.reduce((acc, hive) => {
    acc[hive.harvestStatus] = (acc[hive.harvestStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-50";
      case "good":
        return "text-blue-600 bg-blue-50";
      case "fair":
        return "text-yellow-600 bg-yellow-50";
      case "poor":
        return "text-orange-600 bg-orange-50";
      case "critical":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="p-4 pb-24 space-y-4 bg-gradient-to-b from-amber-50 to-yellow-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-amber-500 p-3 rounded-full">
          <Hexagon className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1>BeeKeeper Dashboard</h1>
          <p className="text-muted-foreground">Welcome back!</p>
        </div>
      </div>

      {/* Alert Banner */}
      {alertCount > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <div className="text-red-900">You have {alertCount} active alerts</div>
              <div className="text-red-700">Tap Alerts to view details</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-amber-500" />
              <div>
                <div className="text-muted-foreground">Farms</div>
                <div>{farms.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Hexagon className="h-8 w-8 text-amber-500" />
              <div>
                <div className="text-muted-foreground">Beehives</div>
                <div>{totalBeehives}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Droplets className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-muted-foreground">Total Honey</div>
                <div>{totalHoneyProduction.toFixed(1)} kg</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-muted-foreground">Est. Bees</div>
                <div>{beehives.reduce((sum, hive) => {
                  const beeCountSensor = sensors.find(s => s.beehiveId === hive.id && s.dataCapture.includes("bee_count"));
                  return sum + (beeCountSensor ? Number(beeCountSensor.currentValue) : 0);
                }, 0).toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sensor Status */}
      <Card>
        <CardHeader>
          <CardTitle>Sensor Status</CardTitle>
          <CardDescription>Online/Offline sensors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <button
              onClick={() => onNavigateToSensors("online")}
              className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Wifi className="h-5 w-5 text-green-600" />
                <div className="text-green-900">Online Sensors</div>
              </div>
              <Badge className="bg-green-600">{onlineSensors}</Badge>
            </button>
            
            {offlineSensors > 0 && (
              <button
                onClick={() => onNavigateToSensors("offline")}
                className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <WifiOff className="h-5 w-5 text-red-600" />
                  <div className="text-red-900">Offline Sensors</div>
                </div>
                <Badge className="bg-red-600">{offlineSensors}</Badge>
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Health Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Hive Health Overview</CardTitle>
          <CardDescription>Status distribution across all hives</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(healthStats).length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No beehives yet</p>
          ) : (
            Object.entries(healthStats)
              .sort(([a], [b]) => {
                const order = ["excellent", "good", "fair", "poor", "critical"];
                return order.indexOf(a) - order.indexOf(b);
              })
              .map(([status, count]) => (
                <div
                  key={status}
                  className={`flex items-center justify-between p-3 rounded-lg ${getStatusColor(status)}`}
                >
                  <div className="capitalize">{status}</div>
                  <Badge variant="secondary">{count} hives</Badge>
                </div>
              ))
          )}
        </CardContent>
      </Card>

      {/* Farm Locations */}
      <Card>
        <CardHeader>
          <CardTitle>Farm Locations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {farms.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No farms yet</p>
          ) : (
            farms.map((farm) => (
              <div key={farm.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>{farm.name}</div>
                <Badge variant="secondary">{farm.beehiveIds.length} hives</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
