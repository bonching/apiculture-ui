import {useEffect, useRef} from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "./ui/dialog";
import {Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Beehive} from "../types";
import {useFetch} from "../hooks/useFetch";
import {API_ROUTES} from "../util/ApiRoutes";
import {AlertCircle, Loader2} from "lucide-react";

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
    honey: {title: "Honey Production Trend (12 Weeks)", color: "#f59e0b", unit: " kg", chartType: "line"},
    temperature: {
        title: "Temperature Trend",
        color: "#ef4444",
        unit: "°C",
        chartType: "line",
        historyKey: "temperatureHistory"
    },
    humidity: {title: "Humidity Trend", color: "#3b82f6", unit: "%", chartType: "area", historyKey: "humidityHistory"},
    beeCount: {
        title: "Bee Population Trend",
        color: "#10b981",
        unit: "",
        chartType: "area",
        historyKey: "beeCountHistory"
    },
    co2: {title: "CO₂ Level Trend", color: "#6b7280", unit: " ppm", chartType: "line", historyKey: "co2History"},
    sound: {title: "Sound Level Trend", color: "#a855f7", unit: " dB", chartType: "line", historyKey: "soundHistory"},
    activity: {
        title: "Activity Level Trend",
        color: "#22c55e",
        unit: "%",
        chartType: "line",
        historyKey: "activityHistory"
    },
    voc: {title: "VOC Level Trend", color: "#f97316", unit: " kΩ", chartType: "line", historyKey: "vocHistory"},
    vibration: {
        title: "Vibration Trend",
        color: "#06b6d4",
        unit: " mm/s",
        chartType: "line",
        historyKey: "vibrationHistory"
    },
    lux: {title: "Light Intensity Trend", color: "#eab308", unit: " lux", chartType: "line", historyKey: "luxHistory"},
    uvIndex: {title: "UV Index Trend", color: "#f97316", unit: "", chartType: "line", historyKey: "uvIndexHistory"},
    rainfall: {
        title: "Rainfall Trend",
        color: "#3b82f6",
        unit: " mm",
        chartType: "area",
        historyKey: "rainfallHistory"
    },
    windSpeed: {
        title: "Wind Speed Trend",
        color: "#14b8a6",
        unit: " km/h",
        chartType: "line",
        historyKey: "windSpeedHistory"
    },
    barometricPressure: {
        title: "Barometric Pressure Trend",
        color: "#6366f1",
        unit: " hPa",
        chartType: "line",
        historyKey: "barometricPressureHistory"
    },
    pheromone: {
        title: "Pheromone Level Trend",
        color: "#ec4899",
        unit: "%",
        chartType: "line",
        historyKey: "pheromoneHistory"
    },
    pollenConcentration: {
        title: "Pollen Concentration Trend",
        color: "#ca8a04",
        unit: "%",
        chartType: "line",
        historyKey: "pollenConcentrationHistory"
    },
};

export function TrendsDialog({open, onOpenChange, beehive, metric}: TrendsDialogProps) {
    const chartRef = useRef<HTMLDivElement>(null);

    // Only fetch data when dialog is open and we have valid beehive and metric
    const fetchUrl = open && beehive?.id && metric
        ? `${API_ROUTES.metricRoutes}/${beehive.id}/${metric}`
        : null;

    const {data, setData, loading, error} = useFetch(fetchUrl);

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
                chartRef.current?.scrollIntoView({behavior: "smooth", block: "center"});
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
                    {loading ? (
                        <div className="flex items-center justify-center h-[300px]">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="h-8 w-8 animate-spin text-amber-500"/>
                                <p className="text-sm text-muted-foreground">Loading trend data...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5"/>
                                <div className="flex-1 space-y-2">
                                    <h3 className="font-medium text-red-900">Failed to Load Data</h3>
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    ) : !data || data.length === 0 ? (
                        <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5"/>
                                <div className="flex-1 space-y-2">
                                    <h3 className="font-medium text-orange-900">No Data Available</h3>
                                    <p className="text-sm text-orange-700">Unable to retrieve trend data for this metric.</p>
                                    <div className="mt-4 space-y-3">
                                        <div>
                                            <p className="font-medium text-sm mb-2 text-orange-900">Possible causes:</p>
                                            <ul className="list-disc list-outside ml-4 space-y-1.5 text-sm text-orange-800">
                                                <li>No sensors are configured to collect this metric</li>
                                                <li>Sensors are offline or not sending readings</li>
                                                <li>Insufficient historical data has been collected</li>
                                                <li>Network connectivity issues</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm mb-2 text-orange-900">Recommended actions:</p>
                                            <ul className="list-disc list-outside ml-4 space-y-1.5 text-sm text-orange-800">
                                                <li>Verify sensors are assigned to this beehive</li>
                                                <li>Check sensor status in the Sensors page</li>
                                                <li>Wait for more data to be collected over time</li>
                                                <li>Ensure sensors have power and network connectivity</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            {config.chartType === "area" ? (
                                <AreaChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                                    <XAxis dataKey="time" stroke="#888" tick={{fontSize: 12}}/>
                                    <YAxis stroke="#888" tick={{fontSize: 12}}/>
                                    <Tooltip formatter={(value) => `${value}${config.unit}`}/>
                                    <Area type="monotone" dataKey="value" stroke={config.color} fill={config.color}
                                          fillOpacity={0.3} name={config.title}/>
                                </AreaChart>
                            ) : (
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                                    <XAxis dataKey="time" stroke="#888" tick={{fontSize: 12}}/>
                                    <YAxis stroke="#888" tick={{fontSize: 12}}/>
                                    <Tooltip formatter={(value) => `${value}${config.unit}`}/>
                                    <Line type="monotone" dataKey="value" stroke={config.color} strokeWidth={2}
                                          name={config.title}/>
                                </LineChart>
                            )}
                        </ResponsiveContainer>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}