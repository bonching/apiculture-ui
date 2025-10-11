export type SensorSystem = "harvesting" | "data_collection" | "defense";

export type DataCaptureType = 
  | "temperature" 
  | "humidity" 
  | "co2" 
  | "voc"
  | "image"
  | "sound" 
  | "vibration"
  | "lux"
  | "pheromone"
  | "uv_index"
  | "rainfall"
  | "wind_speed"
  | "barometric_pressure"
  | "odor_compounds"
  | "pollen_concentration"
  | "bee_count" 
  | "activity";

export interface Sensor {
  id: string;
  name: string;
  dataCapture: DataCaptureType[]; // Changed from 'type' to support multiple metrics
  status: "online" | "offline";
  currentValue: number | string;
  beehiveId: string | null;
  systems: SensorSystem[];
  lastUpdated: string;
}

export interface HistoryData {
  time: string;
  value: number;
}

export interface Beehive {
  id: string;
  name: string;
  description: string;
  farmId: string;
  harvestStatus: "excellent" | "good" | "fair" | "poor" | "critical";
  honeyProduction: number;
  sensorIds: string[];
  hasAlert: boolean;
  temperatureHistory: HistoryData[];
  humidityHistory: HistoryData[];
  beeCountHistory: HistoryData[];
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  address: string;
  beehiveIds: string[];
}

export interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  message: string;
  beehiveName: string;
  farmName: string;
  timestamp: string;
  timestampMs: number;
}
