import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowLeft, Thermometer, Droplet, Wind, Activity, Volume2 } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Beehive } from "../types";

interface BeehiveDetailProps {
  beehive: Beehive;
  onBack: () => void;
}

export function BeehiveDetail({ beehive, onBack }: BeehiveDetailProps) {
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
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-muted-foreground mb-1">Est. Bee Count</div>
              <div>{beehive.sensors.beeCount.toLocaleString()}</div>
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

        {/* Temperature Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Temperature Trend</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={beehive.temperatureHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Humidity Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Humidity Trend</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={beehive.humidityHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bee Count Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Bee Population</CardTitle>
            <CardDescription>Estimated count over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={beehive.beeCountHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
