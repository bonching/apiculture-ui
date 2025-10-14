import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Edit, Hexagon, AlertTriangle, Wifi, WifiOff, TrendingUp, Plus, Eye } from "lucide-react";
import { Farm, Beehive, Sensor } from "../types";

interface FarmDetailsPageProps {
  farm: Farm;
  beehives: Beehive[];
  sensors: Sensor[];
  onBack: () => void;
  onEditFarm: () => void;
  onAddBeehive: () => void;
  onEditBeehive: (beehive: Beehive) => void;
  onSelectBeehive: (beehive: Beehive) => void;
}

export function FarmDetailsPage({
  farm,
  beehives,
  sensors,
  onBack,
  onEditFarm,
  onAddBeehive,
  onEditBeehive,
  onSelectBeehive,
}: FarmDetailsPageProps) {
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

  const getBeehiveSensorStatus = (beehive: Beehive) => {
    const beehiveSensors = sensors.filter(s => beehive.sensorIds.includes(s.id));
    const online = beehiveSensors.filter(s => s.status === "online").length;
    const total = beehiveSensors.length;
    return { online, total };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-100 pb-24">
      {/* Header */}
      <div className="bg-amber-500 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-amber-600"
              onClick={onBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1>{farm.name}</h1>
              <div className="opacity-90">{farm.description}</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-amber-600"
            onClick={onEditFarm}
          >
            <Edit className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Farm Info */}
        <Card>
          <CardHeader>
            <CardTitle>Farm Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="text-muted-foreground">Address</div>
              <div>{farm.address}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Total Beehives</div>
              <div>{beehives.length}</div>
            </div>
          </CardContent>
        </Card>

        {/* Beehives Header */}
        <div className="flex items-center justify-between">
          <h2>Beehives</h2>
          <Button onClick={onAddBeehive} size="sm" className="bg-amber-500 hover:bg-amber-600">
            <Plus className="h-4 w-4 mr-1" />
            Add Hive
          </Button>
        </div>

        {/* Beehives List */}
        <div className="space-y-3">
          {beehives.map((beehive) => {
            const sensorStatus = getBeehiveSensorStatus(beehive);
            return (
              <Card key={beehive.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Hexagon className="h-4 w-4" />
                        {beehive.name}
                        {beehive.hasAlert && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </CardTitle>
                      <CardDescription>{beehive.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(beehive.harvestStatus)}>
                        {beehive.harvestStatus}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-muted-foreground">Sensors</div>
                      <div className="flex items-center justify-center gap-1">
                        {sensorStatus.online === sensorStatus.total ? (
                          <Wifi className="h-3 w-3 text-green-500" />
                        ) : (
                          <WifiOff className="h-3 w-3 text-red-500" />
                        )}
                        {sensorStatus.online}/{sensorStatus.total}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground">Harvest</div>
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {beehive.honeyProduction}kg
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground">ID</div>
                      <div className="truncate">{beehive.id.split('-').pop()}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => onEditBeehive(beehive)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      className="flex-1 bg-amber-500 hover:bg-amber-600"
                      onClick={() => onSelectBeehive(beehive)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {beehives.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Hexagon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No beehives in this farm yet</p>
                <Button onClick={onAddBeehive} className="mt-4 bg-amber-500 hover:bg-amber-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Beehive
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
