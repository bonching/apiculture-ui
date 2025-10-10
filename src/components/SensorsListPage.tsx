import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Wifi, WifiOff, Edit, Plus, Database, Shield, TrendingUp } from "lucide-react";
import { Sensor, Beehive } from "../types";

interface SensorsListPageProps {
  sensors: Sensor[];
  beehives: Beehive[];
  onEditSensor: (sensor: Sensor) => void;
  onAddSensor: () => void;
}

export function SensorsListPage({ sensors, beehives, onEditSensor, onAddSensor }: SensorsListPageProps) {
  const getBeehiveName = (beehiveId: string | null) => {
    if (!beehiveId) return "Unlinked";
    const beehive = beehives.find(b => b.id === beehiveId);
    return beehive?.name || "Unknown";
  };

  const getSystemIcon = (system: string) => {
    switch (system) {
      case "harvesting":
        return <TrendingUp className="h-3 w-3 text-yellow-600" />;
      case "data_collection":
        return <Database className="h-3 w-3 text-blue-600" />;
      case "defense":
        return <Shield className="h-3 w-3 text-red-600" />;
      default:
        return null;
    }
  };

  const getSystemName = (system: string) => {
    switch (system) {
      case "harvesting":
        return "Harvesting";
      case "data_collection":
        return "Data Collection";
      case "defense":
        return "Defense";
      default:
        return system;
    }
  };

  const getSensorTypeDisplay = (type: string) => {
    return type.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="p-4 pb-24 space-y-4 bg-gradient-to-b from-amber-50 to-yellow-100 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1>Sensors</h1>
          <p className="text-muted-foreground">Manage all sensor devices</p>
        </div>
        <Button onClick={onAddSensor} size="sm" className="bg-amber-500 hover:bg-amber-600">
          <Plus className="h-4 w-4 mr-1" />
          Add Sensor
        </Button>
      </div>

      <div className="space-y-3">
        {sensors.map((sensor) => (
          <Card key={sensor.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {sensor.status === "online" ? (
                      <Wifi className="h-4 w-4 text-green-500" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-500" />
                    )}
                    {sensor.name}
                  </CardTitle>
                  <div className="text-muted-foreground mt-1">
                    {getSensorTypeDisplay(sensor.type)} • {getBeehiveName(sensor.beehiveId)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditSensor(sensor)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-muted-foreground">Status</div>
                  <Badge className={sensor.status === "online" ? "bg-green-500" : "bg-red-500"}>
                    {sensor.status}
                  </Badge>
                </div>
                <div>
                  <div className="text-muted-foreground">Last Updated</div>
                  <div>{sensor.lastUpdated}</div>
                </div>
              </div>

              {sensor.systems.length > 0 && (
                <div>
                  <div className="text-muted-foreground mb-2">Active Systems</div>
                  <div className="flex flex-wrap gap-2">
                    {sensor.systems.map((system) => (
                      <Badge key={system} variant="outline" className="flex items-center gap-1">
                        {getSystemIcon(system)}
                        {getSystemName(system)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-muted-foreground">Current Value</div>
                <div>{sensor.currentValue}</div>
              </div>
            </CardContent>
          </Card>
        ))}

        {sensors.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <Wifi className="h-12 w-12 mx-auto mb-2 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No sensors yet</p>
              <Button onClick={onAddSensor} className="bg-amber-500 hover:bg-amber-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Sensor
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
