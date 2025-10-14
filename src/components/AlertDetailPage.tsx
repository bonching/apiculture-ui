import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, AlertTriangle, AlertCircle, Info, Thermometer, Droplet, Wind, Activity, Volume2, Zap, Sun, CloudRain, Waves, Gauge, Flower } from "lucide-react";
import { Alert as AlertType, Beehive } from "../types";

interface AlertDetailPageProps {
  alert: AlertType;
  beehive: (Beehive & {
    sensors: {
      temperature: number;
      humidity: number;
      co2: number;
      beeCount: number;
      soundLevel: number;
      activityLevel: number;
      voc: number;
      vibration: number;
      lux: number;
      pheromone: number;
      uvIndex: number;
      rainfall: number;
      windSpeed: number;
      barometricPressure: number;
      pollenConcentration: number;
      status: "online" | "offline";
    };
  }) | null;
  onBack: () => void;
}

export function AlertDetailPage({ alert, beehive, onBack }: AlertDetailPageProps) {
  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-8 w-8 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-8 w-8 text-yellow-500" />;
      case "info":
        return <Info className="h-8 w-8 text-blue-500" />;
      default:
        return <Info className="h-8 w-8" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-100 pb-24">
      {/* Header */}
      <div className="bg-amber-500 text-white p-4 sticky top-0 z-10 shadow-md">
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
            <h1>Alert Details</h1>
            <div className="opacity-90">{alert.beehiveName}</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Alert Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              {getAlertIcon(alert.severity)}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <CardTitle>{alert.title}</CardTitle>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
                <CardDescription>
                  {alert.beehiveName} - {alert.farmName}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-muted-foreground">Message</div>
              <p>{alert.message}</p>
            </div>
            <div>
              <div className="text-muted-foreground">Timestamp</div>
              <div>{alert.timestamp}</div>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Readings at Alert Time */}
        {beehive && (
          <>
            {/* Environmental Readings */}
            <Card>
              <CardHeader>
                <CardTitle>Environmental Readings</CardTitle>
                <CardDescription>Values at time of alert</CardDescription>
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
                    <Zap className="h-5 w-5 text-orange-500" />
                    <div>VOC Level</div>
                  </div>
                  <div>{beehive.sensors.voc} kΩ</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-indigo-500" />
                    <div>Barometric Pressure</div>
                  </div>
                  <div>{beehive.sensors.barometricPressure} hPa</div>
                </div>
              </CardContent>
            </Card>

            {/* Acoustic & Activity Readings */}
            <Card>
              <CardHeader>
                <CardTitle>Acoustic & Activity Readings</CardTitle>
                <CardDescription>Sound and movement monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <div>{beehive.sensors.activityLevel}%</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Waves className="h-5 w-5 text-cyan-500" />
                    <div>Vibration</div>
                  </div>
                  <div>{beehive.sensors.vibration} mm/s</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-amber-500" />
                    <div>Bee Count</div>
                  </div>
                  <div>{beehive.sensors.beeCount.toLocaleString()}</div>
                </div>
              </CardContent>
            </Card>

            {/* Light & Weather Readings */}
            <Card>
              <CardHeader>
                <CardTitle>Light & Weather Readings</CardTitle>
                <CardDescription>External environmental conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <div>Light Intensity</div>
                  </div>
                  <div>{beehive.sensors.lux} lux</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Sun className="h-5 w-5 text-orange-500" />
                    <div>UV Index</div>
                  </div>
                  <div>{beehive.sensors.uvIndex}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <CloudRain className="h-5 w-5 text-blue-400" />
                    <div>Rainfall</div>
                  </div>
                  <div>{beehive.sensors.rainfall} mm</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wind className="h-5 w-5 text-teal-500" />
                    <div>Wind Speed</div>
                  </div>
                  <div>{beehive.sensors.windSpeed} km/h</div>
                </div>
              </CardContent>
            </Card>

            {/* Chemical & Biological Readings */}
            <Card>
              <CardHeader>
                <CardTitle>Chemical & Biological Readings</CardTitle>
                <CardDescription>Pheromone and pollen monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-pink-500" />
                    <div>Pheromone Level</div>
                  </div>
                  <div>{beehive.sensors.pheromone}%</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Flower className="h-5 w-5 text-yellow-600" />
                    <div>Pollen Concentration</div>
                  </div>
                  <div>{beehive.sensors.pollenConcentration}%</div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!beehive && (
          <Card>
            <CardContent className="py-8">
              <p className="text-muted-foreground text-center">
                No sensor data available for this beehive
              </p>
            </CardContent>
          </Card>
        )}

        {/* Recommended Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              {alert.severity === "critical" && alert.title.includes("Sensor Non-Responsive") && (
                <>
                  <li>Check sensor power supply and connections</li>
                  <li>Verify network connectivity</li>
                  <li>Replace batteries if applicable</li>
                  <li>Contact support if issue persists</li>
                </>
              )}
              {alert.severity === "critical" && alert.title.includes("Temperature") && (
                <>
                  <li>Ensure proper ventilation</li>
                  <li>Check for direct sunlight exposure</li>
                  <li>Monitor bee colony behavior</li>
                  <li>Consider emergency cooling measures</li>
                </>
              )}
              {alert.severity === "warning" && (
                <>
                  <li>Monitor the situation closely</li>
                  <li>Check sensor readings regularly</li>
                  <li>Prepare to take action if conditions worsen</li>
                </>
              )}
              {alert.severity === "info" && (
                <>
                  <li>No immediate action required</li>
                  <li>Continue regular monitoring</li>
                </>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
