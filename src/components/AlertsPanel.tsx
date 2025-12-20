import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AlertTriangle, Info, AlertCircle, ArrowUpDown, LayoutGrid, BarChart3, Eye, Radio } from "lucide-react";
import { Alert as AlertType } from "../types";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { API_ROUTES } from "../util/ApiRoutes";
import { usePost } from "../hooks/usePost";
import { useTimeAgo } from "../hooks/useTimeAgo";

interface AlertsPanelProps {
  alerts: AlertType[];
  onViewDetails: (alert: AlertType) => void;
  onMarkAsRead?: (alertId: string) => void;
}

export function AlertsPanel({ alerts, onViewDetails, onMarkAsRead }: AlertsPanelProps) {
  const [sortBy, setSortBy] = useState<"criticality" | "timestamp">("criticality");
  const [viewMode, setViewMode] = useState<"card" | "graph">("card");
  const [graphType, setGraphType] = useState<"line" | "bar" | "pie" | "stacked">("line");
  const [isLive, setIsLive] = useState(true);

  // Pulse animation for live indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const { data: newAlert, loading, error, mutate } = usePost<AlertType>({ extractData: true });

  const handleViewDetails = async (alert: AlertType) => {
      if (onMarkAsRead && !alert.read) {
          onMarkAsRead(alert.id);
          await mutate(API_ROUTES.alertRoutes + '/' + alert.id, {'read': true}, { method: 'PUT' });
      }
      onViewDetails(alert);
  }

  const unreadCount = alerts.filter(a => !a.read).length;

  // Generate trend data for line chart - alerts over time
  const alertTrendData = useMemo(() => {
    const now = Date.now();
    const hours = 24;
    const intervals: { time: string; critical: number; warning: number; info: number; total: number }[] = [];
    
    for (let i = hours - 1; i >= 0; i--) {
      const hourStart = now - i * 60 * 60 * 1000;
      const hourEnd = hourStart + 60 * 60 * 1000;
      
      const alertsInHour = alerts.filter(a => a.timestampMs >= hourStart && a.timestampMs < hourEnd);
      
      intervals.push({
        time: i === 0 ? "Now" : `${i}h`,
        critical: alertsInHour.filter(a => a.severity === "critical").length,
        warning: alertsInHour.filter(a => a.severity === "warning").length,
        info: alertsInHour.filter(a => a.severity === "info").length,
        total: alertsInHour.length,
      });
    }
    
    return intervals;
  }, [alerts]);

  // Alert counts by type (title)
  const alertsByType = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    alerts.forEach(alert => {
      typeCounts[alert.title] = (typeCounts[alert.title] || 0) + 1;
    });
    return Object.entries(typeCounts).map(([title, count]) => ({
      type: title,
      count,
    }));
  }, [alerts]);

  // Severity distribution for pie chart
  const severityDistribution = useMemo(() => {
    const criticalCount = alerts.filter(a => a.severity === "critical").length;
    const warningCount = alerts.filter(a => a.severity === "warning").length;
    const infoCount = alerts.filter(a => a.severity === "info").length;
    
    return [
      { name: "Critical", value: criticalCount, color: "#ef4444" },
      { name: "Warning", value: warningCount, color: "#eab308" },
      { name: "Info", value: infoCount, color: "#3b82f6" },
    ].filter(item => item.value > 0);
  }, [alerts]);

  // Stacked bar chart - alerts by type and time
  const alertsByTypeAndTime = useMemo(() => {
    const now = Date.now();
    const periods = [
      { label: "0-3h", start: 0, end: 3 },
      { label: "3-6h", start: 3, end: 6 },
      { label: "6-12h", start: 6, end: 12 },
      { label: "12-24h", start: 12, end: 24 },
    ];
    
    return periods.map(period => {
      const periodStart = now - period.end * 60 * 60 * 1000;
      const periodEnd = now - period.start * 60 * 60 * 1000;
      
      const periodAlerts = alerts.filter(a => a.timestampMs >= periodStart && a.timestampMs < periodEnd);
      
      return {
        period: period.label,
        critical: periodAlerts.filter(a => a.severity === "critical").length,
        warning: periodAlerts.filter(a => a.severity === "warning").length,
        info: periodAlerts.filter(a => a.severity === "info").length,
      };
    }).reverse();
  }, [alerts]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-100 pb-24">
      <div className="p-4 space-y-4">
        {/* Live indicator banner */}
        <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
          <CardContent className="py-3">
            <div className="flex items-center justify-center gap-2">
              <Radio className={`h-4 w-4 text-emerald-600 ${isLive ? 'animate-pulse' : ''}`} />
              <span className="text-emerald-700">Real-time monitoring active</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <div>
            <h1>Alerts & Notifications</h1>
            <p className="text-muted-foreground">
                {alerts.length} total alerts ({unreadCount} unread)
            </p>
          </div>
          <div className="flex gap-2">
            {viewMode === "card" && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSort}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortBy === "criticality" ? "By Severity" : "By Time"}
              </Button>
            )}
            <Button
              variant={viewMode === "card" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("card")}
              className={viewMode === "card" ? "bg-amber-500 hover:bg-amber-600" : ""}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "graph" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("graph")}
              className={viewMode === "graph" ? "bg-amber-500 hover:bg-amber-600" : ""}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === "graph" && (
          <>
            {/* Graph Type Selector */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={graphType === "line" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGraphType("line")}
                    className={graphType === "line" ? "bg-amber-500 hover:bg-amber-600" : ""}
                  >
                    Trend Over Time
                  </Button>
                  <Button
                    variant={graphType === "bar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGraphType("bar")}
                    className={graphType === "bar" ? "bg-amber-500 hover:bg-amber-600" : ""}
                  >
                    By Error Type
                  </Button>
                  <Button
                    variant={graphType === "pie" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGraphType("pie")}
                    className={graphType === "pie" ? "bg-amber-500 hover:bg-amber-600" : ""}
                  >
                    Severity Distribution
                  </Button>
                  <Button
                    variant={graphType === "stacked" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGraphType("stacked")}
                    className={graphType === "stacked" ? "bg-amber-500 hover:bg-amber-600" : ""}
                  >
                    By Type & Time
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Line Chart - Trend Over Time */}
            {graphType === "line" && (
              <Card>
                <CardHeader>
                  <CardTitle>Alert Trend (Last 24 Hours)</CardTitle>
                  <CardDescription>Number of alerts over time by severity</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={alertTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
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
            )}

            {/* Bar Chart - Alert Counts by Type */}
            {graphType === "bar" && (
              <Card>
                <CardHeader>
                  <CardTitle>Alert Counts by Error Type</CardTitle>
                  <CardDescription>Total number of alerts for each error type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={alertsByType}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="type" 
                        tick={{ fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#f59e0b" name="Alert Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Pie Chart - Severity Distribution */}
            {graphType === "pie" && (
              <Card>
                <CardHeader>
                  <CardTitle>Alert Severity Distribution</CardTitle>
                  <CardDescription>Percentage breakdown by severity level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={severityDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {severityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Stacked Bar Chart - Alerts by Type and Time */}
            {graphType === "stacked" && (
              <Card>
                <CardHeader>
                  <CardTitle>Alerts by Type and Time</CardTitle>
                  <CardDescription>Alert distribution across time periods by severity</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={alertsByTypeAndTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="critical" stackId="a" fill="#ef4444" name="Critical" />
                      <Bar dataKey="warning" stackId="a" fill="#eab308" name="Warning" />
                      <Bar dataKey="info" stackId="a" fill="#3b82f6" name="Info" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-red-500">
                      {alerts.filter(a => a.severity === "critical").length}
                    </div>
                    <div className="text-muted-foreground">Critical</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-yellow-500">
                      {alerts.filter(a => a.severity === "warning").length}
                    </div>
                    <div className="text-muted-foreground">Warning</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-blue-500">
                      {alerts.filter(a => a.severity === "info").length}
                    </div>
                    <div className="text-muted-foreground">Info</div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                <Card
                    key={alert.id}
                    className={!alert.read ? "!border-l-4 !border-l-orange-600 !border !border-orange-300 shadow-lg" : ""}
                    style={!alert.read ? { backgroundColor: '#fed7aa' } : {}}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        {getAlertIcon(alert.severity)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                              <CardTitle>{alert.title}</CardTitle>
                              {!alert.read && (
                                  <Badge variant="outline" className="bg-orange-200 text-orange-800 border-orange-400 font-semibold" >
                                      New
                                  </Badge>
                              )}
                          </div>
                          <CardDescription className="mt-1">
                            {alert.beehiveName} - {alert.farmName}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          onClick={() => handleViewDetails(alert)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{alert.message}</p>
                    <div className="text-muted-foreground">{useTimeAgo(alert.timestampMs)}</div>
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