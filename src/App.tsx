import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { HomePage } from "./components/HomePage";
import { FarmsListPage } from "./components/FarmsListPage";
import { FarmDetailsPage } from "./components/FarmDetailsPage";
import { FarmEditPage } from "./components/FarmEditPage";
import { BeehiveDetail } from "./components/BeehiveDetail";
import { BeehiveEditPage } from "./components/BeehiveEditPage";
import { SensorsListPage } from "./components/SensorsListPage";
import { SensorEditPage } from "./components/SensorEditPage";
import { AlertsPanel } from "./components/AlertsPanel";
import { AlertDetailPage } from "./components/AlertDetailPage";
import { ProfilePage } from "./components/ProfilePage";
import { BottomNavigation } from "./components/BottomNavigation";
import { mockFarms, mockAlerts, mockBeehives, mockSensors } from "./data/mockData";
import { Beehive, Farm, Sensor, Alert } from "./types";
import { toast } from "sonner@2.0.3";

type View = 
  | "login" 
  | "home" 
  | "farms" 
  | "farm-details"
  | "farm-edit"
  | "beehive" 
  | "beehive-edit"
  | "sensors"
  | "sensor-edit"
  | "alerts"
  | "alert-detail"
  | "profile";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("login");
  const [username, setUsername] = useState<string>("");
  
  // Data state
  const [farms, setFarms] = useState(mockFarms);
  const [beehives, setBeehives] = useState(mockBeehives);
  const [sensors, setSensors] = useState(mockSensors);
  const [alerts] = useState(mockAlerts);
  
  // Selection state
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [selectedBeehive, setSelectedBeehive] = useState<Beehive | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  
  // Filter state
  const [sensorStatusFilter, setSensorStatusFilter] = useState<"online" | "offline" | null>(null);

  const handleLogin = (user: string) => {
    setUsername(user);
    setCurrentView("home");
  };

  const handleLogout = () => {
    setUsername("");
    setCurrentView("login");
    setSelectedFarm(null);
    setSelectedBeehive(null);
    setSelectedSensor(null);
  };

  // Farm handlers
  const handleViewFarmDetails = (farm: Farm) => {
    setSelectedFarm(farm);
    setCurrentView("farm-details");
  };

  const handleEditFarm = (farm: Farm | null) => {
    setSelectedFarm(farm);
    setCurrentView("farm-edit");
  };

  const handleAddFarm = () => {
    setSelectedFarm(null);
    setCurrentView("farm-edit");
  };

  const handleSaveFarm = (farmData: Partial<Farm>) => {
    if (selectedFarm) {
      // Edit existing farm
      setFarms(farms.map(f => 
        f.id === selectedFarm.id 
          ? { ...selectedFarm, ...farmData }
          : f
      ));
      toast.success("Farm updated successfully");
    } else {
      // Add new farm
      const newFarm: Farm = {
        id: `farm-${Date.now()}`,
        name: farmData.name || "",
        description: farmData.description || "",
        address: farmData.address || "",
        beehiveIds: [],
      };
      setFarms([...farms, newFarm]);
      toast.success("Farm added successfully");
    }
    setCurrentView("farms");
    setSelectedFarm(null);
  };

  // Beehive handlers
  const handleSelectBeehive = (beehive: Beehive) => {
    setSelectedBeehive(beehive);
    setCurrentView("beehive");
  };

  const handleEditBeehive = (beehive: Beehive | null) => {
    setSelectedBeehive(beehive);
    setCurrentView("beehive-edit");
  };

  const handleAddBeehive = () => {
    setSelectedBeehive(null);
    setCurrentView("beehive-edit");
  };

  const handleSaveBeehive = (beehiveData: Partial<Beehive>) => {
    if (selectedBeehive) {
      // Edit existing beehive
      setBeehives(beehives.map(b => 
        b.id === selectedBeehive.id 
          ? { ...selectedBeehive, ...beehiveData }
          : b
      ));
      
      // Update sensors' beehiveId
      if (beehiveData.sensorIds) {
        setSensors(sensors.map(s => ({
          ...s,
          beehiveId: beehiveData.sensorIds.includes(s.id) ? selectedBeehive.id : s.beehiveId,
        })));
      }
      
      toast.success("Beehive updated successfully");
    } else {
      // Add new beehive
      const newBeehive: Beehive = {
        id: `hive-${Date.now()}`,
        name: beehiveData.name || "",
        description: beehiveData.description || "",
        location: beehiveData.location || "",
        farmId: beehiveData.farmId || farms[0]?.id || "",
        harvestStatus: beehiveData.harvestStatus || "good",
        honeyProduction: beehiveData.honeyProduction || 0,
        sensorIds: beehiveData.sensorIds || [],
        hasAlert: false,
        temperatureHistory: [],
        humidityHistory: [],
        beeCountHistory: [],
        co2History: [],
        soundHistory: [],
        activityHistory: [],
        vocHistory: [],
        vibrationHistory: [],
        luxHistory: [],
        pheromoneHistory: [],
        uvIndexHistory: [],
        rainfallHistory: [],
        windSpeedHistory: [],
        barometricPressureHistory: [],
        pollenConcentrationHistory: [],
      };
      setBeehives([...beehives, newBeehive]);
      
      // Update farm's beehiveIds
      setFarms(farms.map(f => 
        f.id === newBeehive.farmId 
          ? { ...f, beehiveIds: [...f.beehiveIds, newBeehive.id] }
          : f
      ));
      
      // Update sensors' beehiveId
      if (beehiveData.sensorIds) {
        setSensors(sensors.map(s => ({
          ...s,
          beehiveId: beehiveData.sensorIds.includes(s.id) ? newBeehive.id : s.beehiveId,
        })));
      }
      
      toast.success("Beehive added successfully");
    }
    
    if (selectedFarm) {
      setCurrentView("farm-details");
    } else {
      setCurrentView("farms");
    }
    setSelectedBeehive(null);
  };

  // Sensor handlers
  const handleEditSensor = (sensor: Sensor | null) => {
    setSelectedSensor(sensor);
    setCurrentView("sensor-edit");
  };

  const handleAddSensor = () => {
    setSelectedSensor(null);
    setCurrentView("sensor-edit");
  };

  const handleSaveSensor = (sensorData: Partial<Sensor>) => {
    if (selectedSensor) {
      // Edit existing sensor
      setSensors(sensors.map(s => 
        s.id === selectedSensor.id 
          ? { ...selectedSensor, ...sensorData }
          : s
      ));
      
      // Update beehive's sensorIds
      if (sensorData.beehiveId !== selectedSensor.beehiveId) {
        setBeehives(beehives.map(b => ({
          ...b,
          sensorIds: sensorData.beehiveId === b.id
            ? [...b.sensorIds, selectedSensor.id]
            : b.sensorIds.filter(id => id !== selectedSensor.id),
        })));
      }
      
      toast.success("Sensor updated successfully");
    } else {
      // Add new sensor
      const newSensor: Sensor = {
        id: `sensor-${Date.now()}`,
        name: sensorData.name || "",
        dataCapture: sensorData.dataCapture || ["temperature"],
        status: sensorData.status || "online",
        currentValue: 0,
        beehiveId: sensorData.beehiveId || null,
        hiveLocation: sensorData.hiveLocation || "brood",
        systems: sensorData.systems || [],
        lastUpdated: "just now",
      };
      setSensors([...sensors, newSensor]);
      
      // Update beehive's sensorIds
      if (newSensor.beehiveId) {
        setBeehives(beehives.map(b => 
          b.id === newSensor.beehiveId 
            ? { ...b, sensorIds: [...b.sensorIds, newSensor.id] }
            : b
        ));
      }
      
      toast.success("Sensor added successfully");
    }
    setCurrentView("sensors");
    setSelectedSensor(null);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as View);
    if (view === "farms") {
      setSelectedFarm(null);
      setSelectedBeehive(null);
    }
    if (view === "sensors") {
      setSensorStatusFilter(null);
    }
  };

  const handleNavigateToSensors = (statusFilter?: "online" | "offline") => {
    setSensorStatusFilter(statusFilter || null);
    setCurrentView("sensors");
  };

  const handleViewAlertDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setCurrentView("alert-detail");
  };

  const handleBackFromBeehive = () => {
    if (selectedFarm) {
      setCurrentView("farm-details");
    } else {
      setCurrentView("farms");
    }
    setSelectedBeehive(null);
  };

  const handleBackFromFarmDetails = () => {
    setSelectedFarm(null);
    setCurrentView("farms");
  };

  const showBottomNav = !["login", "beehive", "farm-details", "farm-edit", "beehive-edit", "sensor-edit", "alert-detail"].includes(currentView);

  const getFarmBeehives = (farm: Farm) => {
    return beehives.filter(b => farm.beehiveIds.includes(b.id));
  };

  // Get sensors for a beehive (for alert details)
  const getBeehiveSensors = (beehiveName: string) => {
    const beehive = beehives.find(b => b.name === beehiveName);
    if (!beehive) return [];
    return sensors.filter(s => beehive.sensorIds.includes(s.id));
  };

  // Helper to get sensor data for a beehive (for BeehiveDetail)
  const getBeehiveSensorsData = (beehive: Beehive) => {
    const beehiveSensors = sensors.filter(s => beehive.sensorIds.includes(s.id));
    
    // Build sensors object from individual sensors with multi-metric support
    const tempSensor = beehiveSensors.find(s => s.dataCapture.includes("temperature"));
    const humiditySensor = beehiveSensors.find(s => s.dataCapture.includes("humidity"));
    const co2Sensor = beehiveSensors.find(s => s.dataCapture.includes("co2"));
    const beeCountSensor = beehiveSensors.find(s => s.dataCapture.includes("bee_count"));
    const soundSensor = beehiveSensors.find(s => s.dataCapture.includes("sound"));
    const activitySensor = beehiveSensors.find(s => s.dataCapture.includes("activity"));
    const vocSensor = beehiveSensors.find(s => s.dataCapture.includes("voc"));
    const vibrationSensor = beehiveSensors.find(s => s.dataCapture.includes("vibration"));
    const luxSensor = beehiveSensors.find(s => s.dataCapture.includes("lux"));
    const pheromoneSensor = beehiveSensors.find(s => s.dataCapture.includes("pheromone"));
    const uvIndexSensor = beehiveSensors.find(s => s.dataCapture.includes("uv_index"));
    const rainfallSensor = beehiveSensors.find(s => s.dataCapture.includes("rainfall"));
    const windSpeedSensor = beehiveSensors.find(s => s.dataCapture.includes("wind_speed"));
    const barometricPressureSensor = beehiveSensors.find(s => s.dataCapture.includes("barometric_pressure"));
    const pollenConcentrationSensor = beehiveSensors.find(s => s.dataCapture.includes("pollen_concentration"));
    
    const hasOfflineSensor = beehiveSensors.some(s => s.status === "offline");
    
    // Extract numeric values from multi-value strings
    const extractFirstNumber = (value: number | string): number => {
      if (typeof value === "number") return value;
      const match = String(value).match(/[\d.]+/);
      return match ? parseFloat(match[0]) : 0;
    };
    
    return {
      temperature: tempSensor ? extractFirstNumber(tempSensor.currentValue) : 0,
      humidity: humiditySensor ? extractFirstNumber(humiditySensor.currentValue) : 0,
      co2: co2Sensor ? extractFirstNumber(co2Sensor.currentValue) : 0,
      beeCount: beeCountSensor ? Number(beeCountSensor.currentValue) : 0,
      soundLevel: soundSensor ? extractFirstNumber(soundSensor.currentValue) : 0,
      activityLevel: activitySensor ? extractFirstNumber(activitySensor.currentValue) : 0,
      voc: vocSensor ? extractFirstNumber(vocSensor.currentValue) : 0,
      vibration: vibrationSensor ? extractFirstNumber(vibrationSensor.currentValue) : 0,
      lux: luxSensor ? extractFirstNumber(luxSensor.currentValue) : 0,
      pheromone: pheromoneSensor ? extractFirstNumber(pheromoneSensor.currentValue) : 0,
      uvIndex: uvIndexSensor ? extractFirstNumber(uvIndexSensor.currentValue) : 0,
      rainfall: rainfallSensor ? extractFirstNumber(rainfallSensor.currentValue) : 0,
      windSpeed: windSpeedSensor ? extractFirstNumber(windSpeedSensor.currentValue) : 0,
      barometricPressure: barometricPressureSensor ? extractFirstNumber(barometricPressureSensor.currentValue) : 0,
      pollenConcentration: pollenConcentrationSensor ? extractFirstNumber(pollenConcentrationSensor.currentValue) : 0,
      status: hasOfflineSensor ? "offline" as const : "online" as const,
    };
  };

  return (
    <div className="size-full">
      {currentView === "login" && (
        <LoginPage onLogin={handleLogin} />
      )}
      
      {currentView === "home" && (
        <HomePage
          farms={farms}
          beehives={beehives}
          sensors={sensors}
          alertCount={alerts.length}
          onNavigateToSensors={handleNavigateToSensors}
        />
      )}
      
      {currentView === "farms" && (
        <FarmsListPage
          farms={farms}
          onViewFarmDetails={handleViewFarmDetails}
          onEditFarm={(farm) => handleEditFarm(farm)}
          onAddFarm={handleAddFarm}
        />
      )}

      {currentView === "farm-details" && selectedFarm && (
        <FarmDetailsPage
          farm={selectedFarm}
          beehives={getFarmBeehives(selectedFarm)}
          sensors={sensors}
          onBack={handleBackFromFarmDetails}
          onEditFarm={() => handleEditFarm(selectedFarm)}
          onAddBeehive={handleAddBeehive}
          onEditBeehive={handleEditBeehive}
          onSelectBeehive={handleSelectBeehive}
        />
      )}

      {currentView === "farm-edit" && (
        <FarmEditPage
          farm={selectedFarm}
          onSave={handleSaveFarm}
          onBack={() => {
            if (selectedFarm) {
              setSelectedFarm(selectedFarm);
              setCurrentView("farm-details");
            } else {
              setCurrentView("farms");
            }
          }}
        />
      )}
      
      {currentView === "beehive" && selectedBeehive && (
        <BeehiveDetail
          beehive={{
            ...selectedBeehive,
            sensors: getBeehiveSensorsData(selectedBeehive),
          }}
          onBack={handleBackFromBeehive}
        />
      )}

      {currentView === "beehive-edit" && (
        <BeehiveEditPage
          beehive={selectedBeehive}
          farms={farms}
          allSensors={sensors}
          onSave={handleSaveBeehive}
          onBack={() => {
            if (selectedFarm) {
              setCurrentView("farm-details");
            } else {
              setCurrentView("farms");
            }
            setSelectedBeehive(null);
          }}
        />
      )}

      {currentView === "sensors" && (
        <SensorsListPage
          sensors={sensors}
          beehives={beehives}
          farms={farms}
          onEditSensor={handleEditSensor}
          onAddSensor={handleAddSensor}
          initialStatusFilter={sensorStatusFilter}
        />
      )}

      {currentView === "sensor-edit" && (
        <SensorEditPage
          sensor={selectedSensor}
          beehives={beehives}
          farms={farms}
          onSave={handleSaveSensor}
          onBack={() => {
            setCurrentView("sensors");
            setSelectedSensor(null);
          }}
        />
      )}
      
      {currentView === "alerts" && (
        <AlertsPanel alerts={alerts} onViewDetails={handleViewAlertDetails} />
      )}

      {currentView === "alert-detail" && selectedAlert && (
        <AlertDetailPage
          alert={selectedAlert}
          sensors={getBeehiveSensors(selectedAlert.beehiveName)}
          onBack={() => {
            setSelectedAlert(null);
            setCurrentView("alerts");
          }}
        />
      )}
      
      {currentView === "profile" && (
        <ProfilePage
          username={username}
          farms={farms}
          beehives={beehives}
          onLogout={handleLogout}
        />
      )}

      {showBottomNav && (
        <BottomNavigation
          currentView={currentView}
          onNavigate={handleNavigate}
          alertCount={alerts.length}
        />
      )}
    </div>
  );
}
