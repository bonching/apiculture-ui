import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Wifi, WifiOff, Edit, Plus, Database, Shield, TrendingUp, Filter, Trash2 } from "lucide-react";
import { Sensor, Beehive, Farm } from "../types";

interface SensorsListPageProps {
  sensors: Sensor[];
  beehives: Beehive[];
  farms: Farm[];
  onEditSensor: (sensor: Sensor) => void;
  onAddSensor: () => void;
  initialStatusFilter?: "online" | "offline" | null;
  onDeleteSensor: (sensorId: string) => void;
}

export function SensorsListPage({ sensors, beehives, farms, onEditSensor, onAddSensor, initialStatusFilter, onDeleteSensor }: SensorsListPageProps) {
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter || "all");
  const [farmFilter, setFarmFilter] = useState<string>("all");
  const [beehiveFilter, setBeehiveFilter] = useState<string>("all");
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

  const getDataCaptureDisplay = (types: string[]) => {
    return types.map(type => 
      type.replace('_', ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    ).join(', ');
  };

  // Get farm for a beehive
  const getFarmForBeehive = (beehiveId: string | null) => {
    if (!beehiveId) return null;
    const beehive = beehives.find(b => b.id === beehiveId);
    if (!beehive) return null;
    return farms.find(f => f.beehiveIds.includes(beehive.id));
  };

  // Filter sensors
  const filteredSensors = sensors.filter(sensor => {
    if (statusFilter !== "all" && sensor.status !== statusFilter) return false;
    if (beehiveFilter === "unmapped" && sensor.beehiveId !== null) return false;
    if (beehiveFilter !== "all" && beehiveFilter !== "unmapped" && sensor.beehiveId !== beehiveFilter) return false;
    if (farmFilter !== "all") {
      const farm = getFarmForBeehive(sensor.beehiveId);
      if (farm?.id !== farmFilter) return false;
    }
    return true;
  });

  // Available beehives based on farm filter
  const availableBeehives = farmFilter === "all" 
    ? beehives 
    : beehives.filter(b => {
        const farm = farms.find(f => f.beehiveIds.includes(b.id));
        return farm?.id === farmFilter;
      });

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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <label className="text-muted-foreground">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sensors</SelectItem>
                <SelectItem value="online">Online Only</SelectItem>
                <SelectItem value="offline">Offline Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground">Farm</label>
            <Select value={farmFilter} onValueChange={(value) => {
              setFarmFilter(value);
              setBeehiveFilter("all");
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Farms</SelectItem>
                {farms.map(farm => (
                  <SelectItem key={farm.id} value={farm.id}>{farm.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground">Beehive</label>
            <Select value={beehiveFilter} onValueChange={setBeehiveFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Beehives</SelectItem>
                <SelectItem value="unmapped">Unmapped Sensors</SelectItem>
                {availableBeehives.map(beehive => (
                  <SelectItem key={beehive.id} value={beehive.id}>{beehive.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(statusFilter !== "all" || farmFilter !== "all" || beehiveFilter !== "all") && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => {
                setStatusFilter("all");
                setFarmFilter("all");
                setBeehiveFilter("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredSensors.map((sensor) => (
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
                    {getDataCaptureDisplay(sensor.dataCapture)} • {getBeehiveName(sensor.beehiveId)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditSensor(sensor)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteSensor(sensor.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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

        {filteredSensors.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <Wifi className="h-12 w-12 mx-auto mb-2 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {sensors.length === 0 ? "No sensors yet" : "No sensors match the current filters"}
              </p>
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