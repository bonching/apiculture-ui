import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AlertTriangle, Info, AlertCircle, ArrowUpDown, LayoutGrid, List } from "lucide-react";
import { Alert as AlertType } from "../types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AlertsPanelProps {
  alerts: AlertType[];
  onViewDetails: (alert: AlertType) => void;
}

export function AlertsPanel({ alerts, onViewDetails }: AlertsPanelProps) {
  const [sortBy, setSortBy] = useState<"criticality" | "timestamp">("criticality");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

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

  const getAlertIconSmall = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4" />;
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

  // Generate trend data for alerts over time
  const alertTrendData = useMemo(() => {
    const now = Date.now();
    const hours = 24;
    const intervals: { time: string; critical: number; warning: number; info: number; total: number }[] = [];
    
    for (let i = hours - 1; i >= 0; i--) {
      const hourStart = now - i * 60 * 60 * 1000;
      const hourEnd = hourStart + 60 * 60 * 1000;
      
      const alertsInHour = alerts.filter(a => a.timestampMs >= hourStart && a.timestampMs < hourEnd);
      
      intervals.push({
        time: i === 0 ? "Now" : `${i}h ago`,
        critical: alertsInHour.filter(a => a.severity === "critical").length,
        warning: alertsInHour.filter(a => a.severity === "warning").length,
        info: alertsInHour.filter(a => a.severity === "info").length,
        total: alertsInHour.length,
      });
    }
    
    return intervals;
  }, [alerts]);

  // Summary counts
  const criticalCount = alerts.filter(a => a.severity === "critical").length;
  const warningCount = alerts.filter(a => a.severity === "warning").length;
  const infoCount = alerts.filter(a => a.severity === "info").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-100 pb-24">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1>Alerts & Notifications</h1>
            <p className="text-muted-foreground">{alerts.length} total alerts</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSort}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortBy === "criticality" ? "By Severity" : "By Time"}
            </Button>
            <Button
              variant={viewMode === "card" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("card")}
              className={viewMode === "card" ? "bg-amber-500 hover:bg-amber-600" : ""}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-amber-500 hover:bg-amber-600" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === "list" && (
          <>
            {/* Alert Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Trend (Last 24 Hours)</CardTitle>
                <CardDescription>Number of alerts over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={alertTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="critical" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Critical"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="warning" 
                      stroke="#eab308" 
                      strokeWidth={2}
                      name="Warning"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="info" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Info"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-red-500">{criticalCount}</div>
                    <div className="text-muted-foreground">Critical</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-yellow-500">{warningCount}</div>
                    <div className="text-muted-foreground">Warning</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-blue-500">{infoCount}</div>
                    <div className="text-muted-foreground">Info</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summarized List View */}
            <Card>
              <CardHeader>
                <CardTitle>Current Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sortedAlerts.length === 0 ? (
                  <div className="text-center text-muted-foreground py-4">
                    <Info className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No alerts at this time</p>
                  </div>
                ) : (
                  sortedAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                      onClick={() => onViewDetails(alert)}
                    >
                      {getAlertIconSmall(alert.severity)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="truncate">{alert.title}</div>
                          <Badge variant="outline" className={`${getSeverityColor(alert.severity)} text-white border-0 shrink-0`}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground truncate">
                          {alert.beehiveName} - {alert.farmName}
                        </div>
                      </div>
                      <div className="text-muted-foreground shrink-0">
                        {alert.timestamp}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </>
        )}

        {viewMode === "card" && (
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
        )}
      </div>
    </div>
  );
}
