import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowLeft, Thermometer, Droplet, Wind, Activity, Volume2, Camera, TrendingUp } from "lucide-react";
import { Beehive } from "../types";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface BeehiveDetailProps {
  beehive: Beehive & {
    sensors: {
      temperature: number;
      humidity: number;
      co2: number;
      beeCount: number;
      soundLevel: number;
      activityLevel: "low" | "medium" | "high";
      status: "online" | "offline";
    };
  };
  onBack: () => void;
  onViewTrends: () => void;
}

export function BeehiveDetail({ beehive, onBack, onViewTrends }: BeehiveDetailProps) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-100 pb-6">
      {/* Header */}
      <div className="bg-amber-500 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-amber-600"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1>{beehive.name}</h1>
            <div className="opacity-90">ID: {beehive.id}</div>
          </div>
          <Badge className={getStatusColor(beehive.harvestStatus)}>
            {beehive.harvestStatus}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-muted-foreground mb-1">Honey Production</div>
              <div>{beehive.honeyProduction} kg</div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1">
                Est. Bee Count
                <Camera className="h-3 w-3" />
              </div>
              <div>{beehive.sensors.beeCount.toLocaleString()}</div>
              <Button 
                variant="link" 
                className="text-amber-600 p-0 h-auto mt-1"
                onClick={() => {
                  // This would open a modal or navigate to captured image
                  alert("View captured image - would open image viewer");
                }}
              >
                View Image →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Current Sensor Readings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Readings</CardTitle>
                <CardDescription>Real-time sensor data</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onViewTrends}
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                View Trends
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Thermometer className="h-5 w-5 text-red-500" />
                <div>Temperature</div>
              </div>
              <div>{beehive.sensors.temperature}°C</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Droplet className="h-5 w-5 text-blue-500" />
                <div>Humidity</div>
              </div>
              <div>{beehive.sensors.humidity}%</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Wind className="h-5 w-5 text-gray-500" />
                <div>CO₂ Level</div>
              </div>
              <div>{beehive.sensors.co2} ppm</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Volume2 className="h-5 w-5 text-purple-500" />
                <div>Sound Level</div>
              </div>
              <div>{beehive.sensors.soundLevel} dB</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-green-500" />
                <div>Activity Level</div>
              </div>
              <Badge variant={beehive.sensors.activityLevel === "high" ? "default" : "secondary"}>
                {beehive.sensors.activityLevel}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Captured Image Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Latest Captured Image
            </CardTitle>
            <CardDescription>Image-based bee counting analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-lg overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1730190168042-3bef4553a8f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25leWNvbWIlMjBiZWVoaXZlJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NjAyMjgxMTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Beehive inspection"
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                <div className="flex items-center justify-between">
                  <div>Estimated Count: {beehive.sensors.beeCount.toLocaleString()} bees</div>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
