export interface Sensors {
  temperature: number;
  humidity: number;
  co2: number;
  beeCount: number;
  soundLevel: number;
  activityLevel: "low" | "medium" | "high";
}

export interface HistoryData {
  time: string;
  value: number;
}

export interface Beehive {
  id: string;
  name: string;
  harvestStatus: "excellent" | "good" | "fair" | "poor" | "critical";
  honeyProduction: number;
  sensors: Sensors;
  hasAlert: boolean;
  temperatureHistory: HistoryData[];
  humidityHistory: HistoryData[];
  beeCountHistory: HistoryData[];
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  beehives: Beehive[];
}

export interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  message: string;
  beehiveName: string;
  farmName: string;
  timestamp: string;
}
