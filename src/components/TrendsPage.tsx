import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Thermometer, Droplet, TrendingUp } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Beehive } from "../types";

interface TrendsPageProps {
  beehive: Beehive;
  metric?: "honey" | "temperature" | "humidity" | "beeCount";
  onBack: () => void;
}

export function TrendsPage({ beehive, metric, onBack }: TrendsPageProps) {
  const honeyRef = useRef<HTMLDivElement>(null);
  const temperatureRef = useRef<HTMLDivElement>(null);
  const humidityRef = useRef<HTMLDivElement>(null);
  const beeCountRef = useRef<HTMLDivElement>(null);

  // Generate honey production history from beehive.honeyProduction
  const honeyProductionHistory = Array.from({ length: 24 }, (_, i) => {
    const variation = Math.random() * 2 - 1; // Random variation between -1 and 1
    return {
      time: i === 23 ? "Now" : `${23 - i}h`,
      value: Math.max(0, beehive.honeyProduction + variation),
    };
  }).reverse();

  // Scroll to the specific metric chart when metric prop changes
  useEffect(() => {
    if (metric) {
      const refs = {
        honey: honeyRef,
        temperature: temperatureRef,
        humidity: humidityRef,
        beeCount: beeCountRef,
      };
      
      const targetRef = refs[metric];
      if (targetRef?.current) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          targetRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    }
  }, [metric]);

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
            <h1>Trends & Analytics</h1>
            <div className="opacity-90">{beehive.name}</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Honey Production Trend */}
        <Card ref={honeyRef} className={metric === "honey" ? "ring-2 ring-amber-500" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              Honey Production Trend
            </CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={honeyProductionHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} />
                <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} name="Honey (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Temperature Trend */}
        <Card ref={temperatureRef} className={metric === "temperature" ? "ring-2 ring-red-500" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-red-500" />
              Temperature Trend
            </CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={beehive.temperatureHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} />
                <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} name="Temperature (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Humidity Trend */}
        <Card ref={humidityRef} className={metric === "humidity" ? "ring-2 ring-blue-500" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-blue-500" />
              Humidity Trend
            </CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={beehive.humidityHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} />
                <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Humidity (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bee Population Trend */}
        <Card ref={beeCountRef} className={metric === "beeCount" ? "ring-2 ring-green-500" : ""}>
          <CardHeader>
            <CardTitle>Bee Population Trend</CardTitle>
            <CardDescription>Estimated count over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={beehive.beeCountHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 12 }} />
                <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Bee Count" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
