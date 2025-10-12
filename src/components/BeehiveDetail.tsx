import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
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
  onViewTrends: (metric?: "honey" | "temperature" | "humidity" | "beeCount") => void;
}

export function BeehiveDetail({ beehive, onBack, onViewTrends }: BeehiveDetailProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

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
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-muted-foreground mb-1">Honey Production</div>
                  <div>{beehive.honeyProduction} kg</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-100"
                  onClick={() => onViewTrends("honey")}
                >
                  <TrendingUp className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-muted-foreground mb-1">Est. Bee Count</div>
                  <div>{beehive.sensors.beeCount.toLocaleString()}</div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                    onClick={() => setImageDialogOpen(true)}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                    onClick={() => onViewTrends("beeCount")}
                  >
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Sensor Readings */}
        <Card>
          <CardHeader>
            <CardTitle>Current Readings</CardTitle>
            <CardDescription>Real-time sensor data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Thermometer className="h-5 w-5 text-red-500" />
                <div>Temperature</div>
              </div>
              <div className="flex items-center gap-2">
                <div>{beehive.sensors.temperature}°C</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                  onClick={() => onViewTrends("temperature")}
                >
                  <TrendingUp className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Droplet className="h-5 w-5 text-blue-500" />
                <div>Humidity</div>
              </div>
              <div className="flex items-center gap-2">
                <div>{beehive.sensors.humidity}%</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                  onClick={() => onViewTrends("humidity")}
                >
                  <TrendingUp className="h-4 w-4" />
                </Button>
              </div>
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
      </div>

      {/* Image Popup Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Latest Captured Image
            </DialogTitle>
          </DialogHeader>
          <div className="relative rounded-lg overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1730190168042-3bef4553a8f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25leWNvbWIlMjBiZWVoaXZlJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NjAyMjgxMTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Beehive inspection"
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
              <div className="flex items-center justify-between">
                <div>Estimated Count: {beehive.sensors.beeCount.toLocaleString()} bees</div>
                <Badge className="bg-green-500">Active</Badge>
              </div>
              <p className="text-muted-foreground mt-2">Image-based bee counting analysis</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
