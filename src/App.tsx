import { useState, useEffect } from "react";
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
import { mockFarms, mockAlerts, mockBeehives, mockSensors, generateRandomAlert } from "./data/mockData";
import { Beehive, Farm, Sensor, Alert } from "./types";
import { toast, Toaster } from "sonner@2.0.3";
import { useFetch } from "./hooks/useFetch";
import { API_ROUTES, SSE_ROUTES } from "./util/ApiRoutes";
import { usePost } from "./hooks/usePost";

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
  // const [farms, setFarms] = useState([]);
  // const [beehives, setBeehives] = useState(mockBeehives);
  // const [sensors, setSensors] = useState(mockSensors);
  // const [alerts] = useState(mockAlerts);

  // Fetch API data
  const { data: farms, setData: setFarms, loading: loadingFarms, error: errorFarms } = useFetch(API_ROUTES.farmRoutes);
  const { data: beehives, setData: setBeehives, loading: loadingHives, error: errorHives } = useFetch(API_ROUTES.hiveRoutes);
  const { data: sensors, setData: setSensors, loading: loadingSensors, error: errorSensors } = useFetch(API_ROUTES.sensorRoutes);
  const { data: alerts, setData: setAlerts, loading: loadingAlerts, error: errorAlerts } = useFetch(API_ROUTES.alertRoutes);

  // Delete API
  const { data: farm, loading: deletingFarm, error: errorDeletingFarm, mutate: deleteFarm } = usePost<Farm>({ extractData: true });
  const { data: hive, loading: deletingHive, error: errorDeletingHive, mutate: deleteHive } = usePost<Farm>({ extractData: true });
  const { data: sensor, loading: deletingSensor, error: errorDeletingSensor, mutate: deleteSensor } = usePost<Farm>({ extractData: true });

  // Selection state
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [selectedBeehive, setSelectedBeehive] = useState<Beehive | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  
  // Filter state
  const [sensorStatusFilter, setSensorStatusFilter] = useState<"online" | "offline" | null>(null);

  // Simulated SSE for real-time alerts
  useEffect(() => {
    // Only start SSE when user is logged in
    if (username === "") return;

    // Check for new alerts every 8-15 seconds (random interval)
    // const checkInterval = () => {
    //   const randomInterval = Math.floor(Math.random() * 7000) + 8000; // 8-15 seconds
    //   return randomInterval;
    // };
    //
    // const startSSE = () => {
    //   const interval = setInterval(() => {
    //     const newAlert = generateRandomAlert();
    //
    //     if (newAlert) {
    //       setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
    //
    //       // Show toast notification if not on alerts page
    //       if (currentView !== "alerts") {
    //         if (newAlert.severity === "critical") {
    //           toast.error(`${newAlert.title}: ${newAlert.beehiveName}`, {
    //             description: newAlert.message,
    //             duration: 5000,
    //           });
    //         } else if (newAlert.severity === "warning") {
    //           toast.warning(`${newAlert.title}: ${newAlert.beehiveName}`, {
    //             description: newAlert.message,
    //             duration: 4000,
    //           });
    //         } else {
    //           toast.info(`${newAlert.title}: ${newAlert.beehiveName}`, {
    //             description: newAlert.message,
    //             duration: 3000,
    //           });
    //         }
    //       }
    //     }
    //
    //     // Reset interval with new random time
    //     clearInterval(interval);
    //     startSSE();
    //   }, checkInterval());
    //
    //   return interval;
    // };
    //
    // const intervalId = startSSE();
    //
    // return () => {
    //   clearInterval(intervalId);
    // };

      const eventSource = new EventSource(SSE_ROUTES.alertRoutes);
      eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setAlerts([...alerts, data]);
      };
      eventSource.onerror = (err) => {
          // setError('SSE connection error');
          console.error('SSE Error:', err);
          eventSource.close();  // Close on error
      };
      return () => {
          eventSource.close();
      };
  }, [username, currentView]);

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
        id: farmData.id || "",
        name: farmData.name || "",
        description: farmData.description || "",
        address: farmData.address || "",
        beehiveIds: farmData.beehiveIds || [],
      };
      setFarms([...farms, newFarm]);
      console.log('newFarm: ', newFarm);
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

  const handleAddBeehive = (farmId?: string) => {
    setSelectedBeehive(null);
    // Store the farm context if provided
    if (farmId) {
      setSelectedFarm(farms.find(f => f.id === farmId) || null);
    }
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
        id: beehiveData.id || "",
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
      const updatedFarms = farms.map(f => 
        f.id === newBeehive.farmId 
          ? { ...f, beehiveIds: [...f.beehiveIds, newBeehive.id] }
          : f
      );
      setFarms(updatedFarms);
      
      // Update selectedFarm if we're adding to the selected farm
      if (selectedFarm && selectedFarm.id === newBeehive.farmId) {
        setSelectedFarm({
          ...selectedFarm,
          beehiveIds: [...selectedFarm.beehiveIds, newBeehive.id]
        });
      }
      
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
        id: sensorData.id || "",
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
    setCurrentView("farms");
    setSelectedFarm(null);
  };

  // Delete handlers
  const handleDeleteFarm = async (farmId: string) => {
    const farm = farms.find(f => f.id === farmId);
    if (!farm) return;

    // Check if farm has linked beehives
    if (farm.beehiveIds.length > 0) {
      toast.error("Cannot delete farm with linked beehives. Please delete all beehives first.");
      return;
    }

    setFarms(farms.filter(f => f.id !== farmId));
    await deleteFarm(API_ROUTES.farmRoutes + '/' + farmId, {}, { method: 'DELETE' });
    toast.success("Farm deleted successfully");
    setCurrentView("farms");
    setSelectedFarm(null);
  };

  const handleDeleteBeehive = async (beehiveId: string) => {
    const beehive = beehives.find(b => b.id === beehiveId);
    if (!beehive) return;

    // Check if beehive has linked sensors
    if (beehive.sensorIds.length > 0) {
      toast.error("Cannot delete beehive with linked sensors. Please delete or unlink all sensors first.");
      return;
    }

    // Remove beehive
    setBeehives(beehives.filter(b => b.id !== beehiveId));

    // Remove beehive ID from farm
    setFarms(farms.map(f => ({
      ...f,
      beehiveIds: f.beehiveIds.filter(id => id !== beehiveId),
    })));

    await deleteHive(API_ROUTES.hiveRoutes + '/' + beehiveId, {}, { method: 'DELETE' });
    toast.success("Beehive deleted successfully");
    
    // Navigate back to farm details or farms list
    if (selectedFarm) {
      // Update selectedFarm to remove the beehive ID
      setSelectedFarm({
        ...selectedFarm,
        beehiveIds: selectedFarm.beehiveIds.filter(id => id !== beehiveId),
      });
      setCurrentView("farm-details");
    } else {
      setCurrentView("farms");
    }
    setSelectedBeehive(null);
  };

  const handleDeleteSensor = async (sensorId: string) => {
    const sensor = sensors.find(s => s.id === sensorId);
    if (!sensor) return;

    // Remove sensor
    setSensors(sensors.filter(s => s.id !== sensorId));

    // Remove sensor ID from beehive if it was linked
    if (sensor.beehiveId) {
      setBeehives(beehives.map(b => ({
        ...b,
        sensorIds: b.sensorIds.filter(id => id !== sensorId),
      })));
    }

    await deleteSensor(API_ROUTES.sensorRoutes + '/' + sensorId, {}, { method: 'DELETE' });
    toast.success("Sensor deleted successfully");
    setCurrentView("sensors");
    setSelectedSensor(null);
  };

  const showBottomNav = !["login", "beehive", "farm-details", "farm-edit", "beehive-edit", "sensor-edit", "alert-detail"].includes(currentView);

  const getFarmBeehives = (farm: Farm) => {
    console.log('beehive ids', farm.beehiveIds)
    console.log('beehives', beehives.filter(b => farm.beehiveIds.includes(b.id)))
    return beehives.filter(b => farm.beehiveIds.includes(b.id));
  };

  // Get beehive data for alert details
  const getBeehiveForAlert = (beehiveName: string) => {
    const beehive = beehives.find(b => b.name === beehiveName);
    if (!beehive) return null;
    return {
      ...beehive,
      sensors: getBeehiveSensorsData(beehive),
    };
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
          onDeleteFarm={handleDeleteFarm}
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
          onDeleteBeehive={handleDeleteBeehive}
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
          contextFarmId={selectedFarm?.id}
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
          onDeleteSensor={handleDeleteSensor}
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
          beehive={getBeehiveForAlert(selectedAlert.beehiveName)}
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
      <Toaster />
    </div>
  );
}