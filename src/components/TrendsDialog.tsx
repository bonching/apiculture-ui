import { useEffect, useRef, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Beehive, HistoryData } from "../types";
import { useFetch } from "../hooks/useFetch";
import { API_ROUTES } from "../util/ApiRoutes";

type TrendMetric = 
  | "honey"
  | "temperature"
  | "humidity"
  | "beeCount"
  | "co2"
  | "sound"
  | "activity"
  | "voc"
  | "vibration"
  | "lux"
  | "uvIndex"
  | "rainfall"
  | "windSpeed"
  | "barometricPressure"
  | "pheromone"
  | "pollenConcentration";

interface TrendsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  beehive: Beehive | null;
  metric: TrendMetric | null;
}

const metricConfig: Record<TrendMetric, { 
  title: string; 
  color: string; 
  unit: string; 
  chartType: "line" | "area";
  historyKey?: keyof Beehive;
}> = {
  honey: { title: "Honey Production Trend (12 Weeks)", color: "#f59e0b", unit: " kg", chartType: "line" },
  temperature: { title: "Temperature Trend", color: "#ef4444", unit: "°C", chartType: "line", historyKey: "temperatureHistory" },
  humidity: { title: "Humidity Trend", color: "#3b82f6", unit: "%", chartType: "area", historyKey: "humidityHistory" },
  beeCount: { title: "Bee Population Trend", color: "#10b981", unit: "", chartType: "area", historyKey: "beeCountHistory" },
  co2: { title: "CO₂ Level Trend", color: "#6b7280", unit: " ppm", chartType: "line", historyKey: "co2History" },
  sound: { title: "Sound Level Trend", color: "#a855f7", unit: " dB", chartType: "line", historyKey: "soundHistory" },
  activity: { title: "Activity Level Trend", color: "#22c55e", unit: "%", chartType: "line", historyKey: "activityHistory" },
  voc: { title: "VOC Level Trend", color: "#f97316", unit: " kΩ", chartType: "line", historyKey: "vocHistory" },
  vibration: { title: "Vibration Trend", color: "#06b6d4", unit: " mm/s", chartType: "line", historyKey: "vibrationHistory" },
  lux: { title: "Light Intensity Trend", color: "#eab308", unit: " lux", chartType: "line", historyKey: "luxHistory" },
  uvIndex: { title: "UV Index Trend", color: "#f97316", unit: "", chartType: "line", historyKey: "uvIndexHistory" },
  rainfall: { title: "Rainfall Trend", color: "#3b82f6", unit: " mm", chartType: "area", historyKey: "rainfallHistory" },
  windSpeed: { title: "Wind Speed Trend", color: "#14b8a6", unit: " km/h", chartType: "line", historyKey: "windSpeedHistory" },
  barometricPressure: { title: "Barometric Pressure Trend", color: "#6366f1", unit: " hPa", chartType: "line", historyKey: "barometricPressureHistory" },
  pheromone: { title: "Pheromone Level Trend", color: "#ec4899", unit: "%", chartType: "line", historyKey: "pheromoneHistory" },
  pollenConcentration: { title: "Pollen Concentration Trend", color: "#ca8a04", unit: "%", chartType: "line", historyKey: "pollenConcentrationHistory" },
};

export function TrendsDialog({ open, onOpenChange, beehive, metric }: TrendsDialogProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const { data, setData, loading, error } = useFetch(API_ROUTES.metricRoutes + '/' + beehive['id'] + '/' + metric);

  // Lazy load data only when dialog is open
  // const data = useMemo<HistoryData[]>(() => {
  //   if (!open || !beehive || !metric) return [];
  //
  //   // Special case for honey production - generate synthetic data
  //   if (metric === "honey") {
  //     const weeksCount = 12;
  //     return Array.from({ length: weeksCount }, (_, i) => {
  //       const weeklyProduction = (beehive.honeyProduction / weeksCount) * (i + 1) + (Math.random() - 0.5) * 3;
  //       return {
  //         time: i === weeksCount - 1 ? "Now" : `Week ${i + 1}`,
  //         value: Math.max(0, weeklyProduction),
  //       };
  //     });
  //   }
  //
  //   // Get history data from beehive
  //   const config = metricConfig[metric];
  //   if (config.historyKey && config.historyKey in beehive) {
  //     return beehive[config.historyKey] as HistoryData[];
  //   }
  //
  //   return [];
  // }, [open, beehive, metric]);

  const config = metric ? metricConfig[metric] : null;

  useEffect(() => {
    if (open && chartRef.current) {
      setTimeout(() => {
        chartRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [open]);

  if (!config) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>Historical data visualization over time</DialogDescription>
        </DialogHeader>
        <div ref={chartRef} className="py-4">
          <ResponsiveContainer width="100%" height={300}>
            {config.chartType === "area" ? (
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} />
                <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `${value}${config.unit}`} />
                <Area type="monotone" dataKey="value" stroke={config.color} fill={config.color} fillOpacity={0.3} name={config.title} />
              </AreaChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} />
                <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `${value}${config.unit}`} />
                <Line type="monotone" dataKey="value" stroke={config.color} strokeWidth={2} name={config.title} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}