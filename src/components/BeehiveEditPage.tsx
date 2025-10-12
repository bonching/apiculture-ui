import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { ArrowLeft, Save, Link2 } from "lucide-react";
import { Beehive, Farm, Sensor } from "../types";

interface BeehiveEditPageProps {
  beehive: Beehive | null;
  farms: Farm[];
  allSensors: Sensor[];
  onSave: (beehive: Partial<Beehive>) => void;
  onBack: () => void;
}

export function BeehiveEditPage({ beehive, farms, allSensors, onSave, onBack }: BeehiveEditPageProps) {
  const [formData, setFormData] = useState({
    name: beehive?.name || "",
    description: beehive?.description || "",
    location: beehive?.location || "",
    farmId: beehive?.farmId || farms[0]?.id || "",
    honeyProduction: beehive?.honeyProduction?.toString() || "0",
    sensorIds: beehive?.sensorIds || [],
  });

  const handleSensorToggle = (sensorId: string) => {
    setFormData({
      ...formData,
      sensorIds: formData.sensorIds.includes(sensorId)
        ? formData.sensorIds.filter(id => id !== sensorId)
        : [...formData.sensorIds, sensorId],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      honeyProduction: parseFloat(formData.honeyProduction),
    });
  };

  const isNewBeehive = !beehive;
  const availableSensors = allSensors.filter(s => !s.beehiveId || s.beehiveId === beehive?.id);

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
            <h1>{isNewBeehive ? "Add New Beehive" : "Edit Beehive"}</h1>
            <div className="opacity-90">{isNewBeehive ? "Create a new hive" : "Update hive details"}</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Beehive Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Hive Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Hive Alpha"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Primary production hive with full sensor suite"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location within Farm</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., North sector, Row 3, Position 5"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmId">Farm</Label>
                <Select value={formData.farmId} onValueChange={(value) => setFormData({ ...formData, farmId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a farm" />
                  </SelectTrigger>
                  <SelectContent>
                    {farms.map((farm) => (
                      <SelectItem key={farm.id} value={farm.id}>
                        {farm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="honeyProduction">Honey Production (kg)</Label>
                <Input
                  id="honeyProduction"
                  type="number"
                  step="0.1"
                  value={formData.honeyProduction}
                  onChange={(e) => setFormData({ ...formData, honeyProduction: e.target.value })}
                  required
                />
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
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Beehive
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Link Sensors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Link Sensors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableSensors.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No available sensors to link
              </p>
            ) : (
              availableSensors.map((sensor) => (
                <div key={sensor.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Checkbox
                    id={sensor.id}
                    checked={formData.sensorIds.includes(sensor.id)}
                    onCheckedChange={() => handleSensorToggle(sensor.id)}
                  />
                  <Label htmlFor={sensor.id} className="flex-1 cursor-pointer">
                    <div>{sensor.name}</div>
                    <div className="text-muted-foreground">
                      Captures: {sensor.dataCapture.map(t => t.replace('_', ' ')).join(', ')} • Status: {sensor.status}
                    </div>
                  </Label>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
