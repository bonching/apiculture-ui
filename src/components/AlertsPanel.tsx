import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowLeft, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { Alert as AlertType } from "../types";

interface AlertsPanelProps {
  alerts: AlertType[];
  onBack: () => void;
}

export function AlertsPanel({ alerts, onBack }: AlertsPanelProps) {
  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5" />;
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-100 pb-6">
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
            <h1>Alerts & Notifications</h1>
            <div className="opacity-90">{alerts.length} total alerts</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <Info className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No alerts at this time</p>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getAlertIcon(alert.severity)}
                    <div className="flex-1">
                      <CardTitle>{alert.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {alert.beehiveName} - {alert.farmName}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{alert.message}</p>
                <div className="text-muted-foreground">{alert.timestamp}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
