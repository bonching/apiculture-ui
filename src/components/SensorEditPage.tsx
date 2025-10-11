import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { ArrowLeft, Save, Link2, Database, Shield, TrendingUp } from "lucide-react";
import { Sensor, Beehive, SensorSystem, DataCaptureType } from "../types";

interface SensorEditPageProps {
  sensor: Sensor | null;
  beehives: Beehive[];
  onSave: (sensor: Partial<Sensor>) => void;
  onBack: () => void;
}

export function SensorEditPage({ sensor, beehives, onSave, onBack }: SensorEditPageProps) {
  const [formData, setFormData] = useState({
    name: sensor?.name || "",
    dataCapture: sensor?.dataCapture || ["temperature"] as DataCaptureType[],
    status: sensor?.status || "online",
    beehiveId: sensor?.beehiveId || null,
    systems: sensor?.systems || [],
  });

  const dataCaptureTypes: { value: DataCaptureType; label: string }[] = [
    { value: "temperature", label: "Temperature" },
    { value: "humidity", label: "Humidity" },
    { value: "co2", label: "CO2" },
    { value: "voc", label: "VOC (Volatile Organic Compounds)" },
    { value: "image", label: "Image Capture" },
    { value: "sound", label: "Sound" },
    { value: "vibration", label: "Vibration" },
    { value: "lux", label: "Lux Levels (Light Intensity)" },
    { value: "pheromone", label: "Pheromone Concentration" },
    { value: "uv_index", label: "UV Index" },
    { value: "rainfall", label: "Rainfall" },
    { value: "wind_speed", label: "Wind Speed" },
    { value: "barometric_pressure", label: "Barometric Pressure" },
    { value: "odor_compounds", label: "Odor Compound Profiles" },
    { value: "pollen_concentration", label: "Pollen Concentration" },
    { value: "bee_count", label: "Bee Count" },
    { value: "activity", label: "Activity Level" },
  ];

  const handleDataCaptureToggle = (type: DataCaptureType) => {
    setFormData({
      ...formData,
      dataCapture: formData.dataCapture.includes(type)
        ? formData.dataCapture.filter(t => t !== type)
        : [...formData.dataCapture, type],
    });
  };

  const handleSystemToggle = (system: SensorSystem) => {
    let newSystems = formData.systems.includes(system)
      ? formData.systems.filter(s => s !== system)
      : [...formData.systems, system];

    // Harvesting is mutually exclusive from defense and data_collection
    if (system === "harvesting" && newSystems.includes("harvesting")) {
      newSystems = ["harvesting"];
      // Clear beehiveId when switching to harvesting
      setFormData({
        ...formData,
        systems: newSystems,
        beehiveId: null,
      });
      return;
    } else if ((system === "defense" || system === "data_collection") && newSystems.includes(system)) {
      newSystems = newSystems.filter(s => s !== "harvesting");
    }

    setFormData({
      ...formData,
      systems: newSystems,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isNewSensor = !sensor;

  // Beehive linking is required for defense/data_collection, disabled for harvesting
  const isHarvestingOnly = formData.systems.includes("harvesting") && formData.systems.length === 1;
  const requiresBeehiveLink = formData.systems.includes("defense") || formData.systems.includes("data_collection");
  const beehiveLinkingDisabled = isHarvestingOnly;

  const systemInfo = [
    {
      id: "harvesting" as SensorSystem,
      name: "Harvesting System",
      icon: TrendingUp,
      description: "Monitors honey production and harvest readiness",
      color: "text-yellow-600",
    },
    {
      id: "data_collection" as SensorSystem,
      name: "Data Collection System",
      icon: Database,
      description: "Collects environmental and health metrics",
      color: "text-blue-600",
    },
    {
      id: "defense" as SensorSystem,
      name: "Defense System",
      icon: Shield,
      description: "Monitors threats and security issues",
      color: "text-red-600",
    },
  ];

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
            <h1>{isNewSensor ? "Add New Sensor" : "Edit Sensor"}</h1>
            <div className="opacity-90">{isNewSensor ? "Create a new sensor" : "Update sensor details"}</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Sensor Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Sensor Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Temp Sensor Alpha-1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Data Capture Types</Label>
                <p className="text-muted-foreground">
                  Select one or more metrics this sensor can capture (e.g., BME680 captures temperature, humidity, CO2, and VOC)
                </p>
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                  {dataCaptureTypes.map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={formData.dataCapture.includes(type.value)}
                        onCheckedChange={() => handleDataCaptureToggle(type.value)}
                      />
                      <label
                        htmlFor={type.value}
                        className="cursor-pointer flex-1"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
                {formData.dataCapture.length === 0 && (
                  <p className="text-red-500">
                    Please select at least one data capture type
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="beehiveId">
                  Linked Beehive {requiresBeehiveLink && <span className="text-red-500">*</span>}
                  {beehiveLinkingDisabled && <span className="text-muted-foreground"> (Disabled for Harvesting System)</span>}
                </Label>
                <Select
                  value={formData.beehiveId || "none"}
                  onValueChange={(value) => setFormData({ ...formData, beehiveId: value === "none" ? null : value })}
                  disabled={beehiveLinkingDisabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a beehive" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Unlinked)</SelectItem>
                    {beehives.map((beehive) => (
                      <SelectItem key={beehive.id} value={beehive.id}>
                        {beehive.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {requiresBeehiveLink && !formData.beehiveId && (
                  <p className="text-red-500">
                    Beehive linking is required for Defense and Data Collection systems
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-600"
                  disabled={(requiresBeehiveLink && !formData.beehiveId) || formData.dataCapture.length === 0}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Sensor
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Assign to Systems */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Assign to Systems
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Note: Harvesting System is mutually exclusive from Defense and Data Collection systems
            </p>
            {systemInfo.map((system) => {
              const Icon = system.icon;
              return (
                <div key={system.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Checkbox
                    id={system.id}
                    checked={formData.systems.includes(system.id)}
                    onCheckedChange={() => handleSystemToggle(system.id)}
                    className="mt-1"
                  />
                  <Label htmlFor={system.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${system.color}`} />
                      <span>{system.name}</span>
                      {formData.systems.includes(system.id) && (
                        <Badge variant="secondary" className="ml-2">Active</Badge>
                      )}
                    </div>
                    <div className="text-muted-foreground mt-1">
                      {system.description}
                    </div>
                  </Label>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
