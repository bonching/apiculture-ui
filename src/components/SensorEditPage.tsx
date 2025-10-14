import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Badge } from "./ui/badge";
import { ArrowLeft, Save, Link2, Database, Shield, TrendingUp } from "lucide-react";
import { Sensor, Beehive, SensorSystem, DataCaptureType, Farm } from "../types";

interface SensorEditPageProps {
  sensor: Sensor | null;
  beehives: Beehive[];
  farms: Farm[];
  onSave: (sensor: Partial<Sensor>) => void;
  onBack: () => void;
}

export function SensorEditPage({ sensor, beehives, farms, onSave, onBack }: SensorEditPageProps) {
  const [formData, setFormData] = useState({
    name: sensor?.name || "",
    dataCapture: sensor?.dataCapture || ["temperature"] as DataCaptureType[],
    farmId: sensor?.beehiveId ? beehives.find(b => b.id === sensor.beehiveId)?.farmId || "" : "",
    beehiveId: sensor?.beehiveId || null,
    hiveLocation: sensor?.hiveLocation || "brood" as "brood" | "honey_super" | "external",
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
      // Clear beehiveId and farmId when switching to harvesting
      setFormData({
        ...formData,
        systems: newSystems,
        beehiveId: null,
        farmId: "",
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
    const { farmId, ...sensorData } = formData;
    onSave(sensorData);
  };

  const isNewSensor = !sensor;

  // Beehive linking is required for defense/data_collection, disabled for harvesting
  const isHarvestingOnly = formData.systems.includes("harvesting") && formData.systems.length === 1;
  const requiresBeehiveLink = formData.systems.includes("defense") || formData.systems.includes("data_collection");
  const beehiveLinkingDisabled = isHarvestingOnly;

  // Filter beehives by selected farm
  const filteredBeehives = formData.farmId 
    ? beehives.filter(b => b.farmId === formData.farmId)
    : beehives;

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
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Sensor Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., BME680 Environmental Alpha-1"
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
          </CardContent>
        </Card>

        {/* Assign to System Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Assign to System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Select which system(s) this sensor should be assigned to. Harvesting is mutually exclusive from Data Collection and Defense.
            </p>
            
            {systemInfo.map((system) => (
              <div key={system.id} className="border rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={system.id}
                    checked={formData.systems.includes(system.id)}
                    onCheckedChange={() => handleSystemToggle(system.id)}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={system.id}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <system.icon className={`h-4 w-4 ${system.color}`} />
                      <span>{system.name}</span>
                    </label>
                    <p className="text-muted-foreground mt-1">
                      {system.description}
                    </p>
                    {system.id === "harvesting" && formData.systems.includes("harvesting") && (
                      <Badge variant="outline" className="mt-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                        Harvesting sensors do not require beehive linking
                      </Badge>
                    )}
                    {(system.id === "defense" || system.id === "data_collection") && 
                     formData.systems.includes(system.id) && (
                      <Badge variant="outline" className="mt-2 bg-blue-100 text-blue-800 border-blue-300">
                        Requires beehive linking
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {formData.systems.length === 0 && (
              <p className="text-red-500">
                Please select at least one system
              </p>
            )}
          </CardContent>
        </Card>

        {/* Farm and Beehive Linking Card */}
        <Card className={beehiveLinkingDisabled ? "opacity-60" : ""}>
          <CardHeader>
            <CardTitle>Beehive Linking</CardTitle>
            {beehiveLinkingDisabled && (
              <CardDescription className="text-yellow-600">
                Beehive linking is disabled for Harvesting System sensors
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="farmId">
                Farm {!beehiveLinkingDisabled && <span className="text-muted-foreground">(Optional - helps filter beehives)</span>}
                {beehiveLinkingDisabled && <span className="text-muted-foreground"> (Disabled for Harvesting System)</span>}
              </Label>
              <Select
                value={formData.farmId || "none"}
                onValueChange={(value) => {
                  const newFarmId = value === "none" ? "" : value;
                  setFormData({ 
                    ...formData, 
                    farmId: newFarmId,
                    // Clear beehive selection if it doesn't belong to the new farm
                    beehiveId: newFarmId && formData.beehiveId 
                      ? (beehives.find(b => b.id === formData.beehiveId)?.farmId === newFarmId ? formData.beehiveId : null)
                      : formData.beehiveId
                  });
                }}
                disabled={beehiveLinkingDisabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a farm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Show all beehives)</SelectItem>
                  {farms.map((farm) => (
                    <SelectItem key={farm.id} value={farm.id}>
                      {farm.name}
                    </SelectItem>
                  ))}
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
                  {filteredBeehives.map((beehive) => (
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

            {/* Hive Location - Moved here after beehive field */}
            <div className="space-y-2">
              <Label>Hive Location</Label>
              <p className="text-muted-foreground">
                Where in the hive is this sensor placed?
              </p>
              <RadioGroup 
                value={formData.hiveLocation} 
                onValueChange={(value) => setFormData({ ...formData, hiveLocation: value as any })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="brood" id="brood" />
                  <Label htmlFor="brood" className="cursor-pointer">Brood</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="honey_super" id="honey_super" />
                  <Label htmlFor="honey_super" className="cursor-pointer">Honey Super</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="external" id="external" />
                  <Label htmlFor="external" className="cursor-pointer">External</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons at Bottom */}
        <div className="flex gap-3">
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
            onClick={handleSubmit}
            disabled={(requiresBeehiveLink && !formData.beehiveId) || formData.dataCapture.length === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Sensor
          </Button>
        </div>
      </div>
    </div>
  );
}
