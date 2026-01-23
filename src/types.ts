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
  | "activity"
  | "honey_harvested";

export interface Sensor {
  id: string;
  name: string;
  dataCapture: DataCaptureType[]; // Changed from 'type' to support multiple metrics
  status: "online" | "offline";
  currentValue: number | string;
  beehiveId: string | null;
  hiveLocation: "brood" | "honey_super" | "external";
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
  location: string;
  farmId: string;
  harvestStatus: "excellent" | "good" | "fair" | "poor" | "critical";
  honeyProduction: number;
  sensorIds: string[];
  hasAlert: boolean;
  temperatureHistory: HistoryData[];
  humidityHistory: HistoryData[];
  beeCountHistory: HistoryData[];
  co2History: HistoryData[];
  soundHistory: HistoryData[];
  activityHistory: HistoryData[];
  vocHistory: HistoryData[];
  vibrationHistory: HistoryData[];
  luxHistory: HistoryData[];
  pheromoneHistory: HistoryData[];
  uvIndexHistory: HistoryData[];
  rainfallHistory: HistoryData[];
  windSpeedHistory: HistoryData[];
  barometricPressureHistory: HistoryData[];
  pollenConcentrationHistory: HistoryData[];
}

export interface Farm {
  id: string;
  name: string;
  description: string;
  address: string;
  beehiveIds: string[];
}

export type AlertType = "predator_detected" | "online_sensor" | "offline_sensor" | "honey_harvested" | "anomaly_detected";

export interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  alertType: AlertType;
  title: string;
  message: string;
  beehiveName: string;
  farmName: string;
  timestamp: string;
  timestampMs: number;
  read?: boolean;
  beehiveId?: string;
  dataType?: DataCaptureType;
  sensorValue?: number | string;
}

export interface HarvestDevice {
    id: string;
    name: string;
    status: "available" | "in_use" | "offline";
    lastUsed?: string
}
