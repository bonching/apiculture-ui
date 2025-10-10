import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AlertTriangle, Info, AlertCircle, ArrowUpDown } from "lucide-react";
import { Alert as AlertType } from "../types";

interface AlertsPanelProps {
  alerts: AlertType[];
  onViewDetails: (alert: AlertType) => void;
}

export function AlertsPanel({ alerts, onViewDetails }: AlertsPanelProps) {
  const [sortBy, setSortBy] = useState<"criticality" | "timestamp">("criticality");

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

  const getSeverityPriority = (severity: string) => {
    switch (severity) {
      case "critical":
        return 0;
      case "warning":
        return 1;
      case "info":
        return 2;
      default:
        return 3;
    }
  };

  const sortedAlerts = [...alerts].sort((a, b) => {
    if (sortBy === "criticality") {
      const priorityDiff = getSeverityPriority(a.severity) - getSeverityPriority(b.severity);
      if (priorityDiff !== 0) return priorityDiff;
      // If same criticality, sort by timestamp (newest first)
      return b.timestampMs - a.timestampMs;
    } else {
      // Sort by timestamp (newest first)
      return b.timestampMs - a.timestampMs;
    }
  });

  const toggleSort = () => {
    setSortBy(sortBy === "criticality" ? "timestamp" : "criticality");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-100 pb-24">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1>Alerts & Notifications</h1>
            <p className="text-muted-foreground">{alerts.length} total alerts</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSort}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortBy === "criticality" ? "By Severity" : "By Time"}
          </Button>
        </div>

        <div className="space-y-3">
          {sortedAlerts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Info className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No alerts at this time</p>
              </CardContent>
            </Card>
          ) : (
            sortedAlerts.map((alert) => (
              <Card key={alert.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewDetails(alert)}>
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
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">{alert.timestamp}</div>
                    <Button variant="link" className="text-amber-600 p-0 h-auto">
                      View Details →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
