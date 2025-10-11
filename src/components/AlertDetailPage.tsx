import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, AlertTriangle, AlertCircle, Info, Thermometer, Droplets, Wind, Activity } from "lucide-react";
import { Alert as AlertType, Sensor } from "../types";

interface AlertDetailPageProps {
  alert: AlertType;
  sensors: Sensor[];
  onBack: () => void;
}

export function AlertDetailPage({ alert, sensors, onBack }: AlertDetailPageProps) {
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

  const getSensorIcon = (dataCapture: string[]) => {
    // Show icon for primary data type
    const primary = dataCapture[0];
    switch (primary) {
      case "temperature":
        return <Thermometer className="h-5 w-5" />;
      case "humidity":
        return <Droplets className="h-5 w-5" />;
      case "co2":
      case "voc":
        return <Wind className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getDataCaptureDisplay = (dataCapture: string[]) => {
    return dataCapture.map(type => 
      type.replace('_', ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    ).join(', ');
  };

  const formatValue = (sensor: Sensor) => {
    // For multi-metric sensors, just display the currentValue as is
    return String(sensor.currentValue);
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
        <Card>
          <CardHeader>
            <CardTitle>Sensor Readings</CardTitle>
            <CardDescription>Values at time of alert</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sensors.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No sensor data available
              </p>
            ) : (
              sensors.map((sensor) => (
                <div
                  key={sensor.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getSensorIcon(sensor.dataCapture)}
                    <div>
                      <div>{getDataCaptureDisplay(sensor.dataCapture)}</div>
                      <div className="text-muted-foreground">{sensor.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{formatValue(sensor)}</div>
                    <Badge 
                      variant="outline" 
                      className={sensor.status === "online" ? "border-green-500" : "border-red-500"}
                    >
                      {sensor.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

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
