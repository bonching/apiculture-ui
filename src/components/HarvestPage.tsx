import {useState, useEffect, useRef, useMemo} from "react";
import {Loader2, Check, ArrowLeft} from "lucide-react";
import { Button } from "./ui/button"
import {Beehive, Farm, HarvestDevice} from "../types";
import {usePost} from "../hooks/usePost";
import {API_ROUTES} from "../util/ApiRoutes";
import {toast} from "sonner";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card";
import {Label} from "./ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select";

type HarvestState = "idle" | "calibrating" | "starting_smoker" | "capturing_images" | "analyzing_honeypots" | "harvesting" | "completed"

interface HarvestPageProps {
    farms: Farm[];
    beehives: Beehive[];
    harvestDevices: HarvestDevice[];
    onBack: () => void;
}

export function HarvestPage({ farms, beehives, harvestDevices, onBack }: HarvestPageProps) {
    const [selectedFarmId, setSelectedFarmId] = useState<string>("");
    const [selectedBeehiveId, setSelectedBeehiveId] = useState<string>("");
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
    const [harvestState, setHarvestState] = useState<HarvestState>("idle");
    const [progress, setProgress] = useState<number>(0);
    const [harvestId, setHarvestId] = useState<string | null>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const { loading, mutate: startHarvest } = usePost({ extractData: false}); {}

    // Poll harvest status from api
    useEffect(() => {
        if (!harvestId || harvestState === "idle" || harvestState === "completed") {
            return;
        }

        const pollHarvestStatus = async () => {
            try {
                const response = await fetch(`${API_ROUTES.harvestRoutes}/{harvestId}}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch harvest status");
                }

                const data = await response.json();

                // Update state based on API response
                if (data.state) {
                    setHarvestState(data.state);
                }

                if (data.progress !== undefined) {
                    setProgress(data.progress);
                }

                // Stop polling if completed
                if (data.state === "completed") {
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                        pollingIntervalRef.current = null;
                    }
                }
            } catch (error) {
                console.error("Error polling harvest status: ", error);
                // Continue polling even on error to handle temporary network issues
            }
        };

        // Start polling every 1 second
        pollHarvestStatus(); // Initial fetch
        pollingIntervalRef.current = setInterval(pollHarvestStatus, 1000)

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        }
    }, [harvestId, harvestState]);

    // Filter beehives by selected farm
    const filteredBeehives = selectedFarmId
        ? beehives.filter((hive) => hive.farmId === selectedFarmId)
        : beehives;

    // Filter available harvest devices
    const availableDevices = harvestDevices.filter((device) => device.status === "available");

    const handleStartHarvest = async () => {
        if (!selectedFarmId || !selectedBeehiveId || !selectedDeviceId) {
            toast.error("Please select farm, beehive, and harvest device");
            return;
        }

        const selectedFarm = farms.find((f) => f.id === selectedFarmId);
        const selectedBeehive = beehives.find((b) => b.id === selectedBeehiveId);
        const selectedDevice = harvestDevices.find((device) => device.id === selectedDeviceId);

        try {
            // Start the harvest and get the ID
            const response = await startHarvest(API_ROUTES.harvestRoutes, {
                farmId: selectedFarmId,
                beehiveId: selectedBeehiveId,
                deviceId: selectedDeviceId,
            }) as any;

            // Extract harvest_id from response
            const harvestJobId = response?.harvest_id || response?.id || response?.harvestId;

            if (harvestJobId) {
                setHarvestId(harvestJobId);
                setHarvestState("calibrating");
                setProgress(0);

                toast.success(`Harvest started for ${selectedBeehive.name} at ${selectedFarm.name} using ${selectedDevice.name}`);
            } else {
                // No harvest ID returned, fall back to idle state
                console.warn("No harvest ID returned from API");
                setHarvestState("idle");
                setProgress(0);
                setHarvestId(null);
            }
        } catch (error) {
            toast.error("Failed to start harvest, please try again");
            console.error("Harvest error: ", error);
            setHarvestState("idle");
            setProgress(0);
            setHarvestId(null);
        }
    };

    const handleReset = () => {
        // Clear polling interval if active
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }

        setSelectedFarmId("");
        setSelectedBeehiveId("");
        setSelectedDeviceId("");
        setHarvestState("idle");
        setProgress(0);
        setHarvestId(null);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-amber-500 text-white p-4">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onBack}
                            className="text-white hover:bg-amber-600"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-2xl font-bold">Honey Harvest</h1>
                    </div>
                    <p className="text-amber-50 text-sm ml-12">
                        Map a harvest device to start collecting honey
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-lg mx-auto p-4 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Harvest Configuration</CardTitle>
                        <CardDescription>
                            Select a farm, hive, and harvest device to begin
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Farm Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="farm-select">Farm</Label>
                            <Select
                                value={selectedFarmId}
                                onValueChange={(value) => {
                                    setSelectedFarmId(value);
                                    setSelectedBeehiveId("");
                                }}
                            >
                                <SelectTrigger id="farm-select">
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

                        {/* Beehive Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="beehive-select">Beehive</Label>
                            <Select
                                value={selectedBeehiveId}
                                onValueChange={setSelectedBeehiveId}
                                disabled={!selectedFarmId}
                            >
                                <SelectTrigger id="beehive-select">
                                    <SelectValue placeholder="Select a beehive" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredBeehives.length > 0 ? (
                                        filteredBeehives.map((hive) => (
                                        <SelectItem key={hive.id} value={hive.id}>
                                            {hive.name}
                                        </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="none" disabled>
                                            No beehives available
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Harvest Device Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="device-select">Harvest Device</Label>
                            <Select
                                value={selectedDeviceId}
                                onValueChange={setSelectedDeviceId}
                            >
                                <SelectTrigger id="device-select">
                                    <SelectValue placeholder="Select a harvest device" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableDevices.length > 0 ? (
                                        availableDevices.map((device) => (
                                            <SelectItem key={device.id} value={device.id}>
                                                {device.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="none" disabled>
                                            No devices available
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Start Button */}
                        <Button
                            onClick={handleStartHarvest}
                            disabled={
                                !selectedFarmId ||
                                !selectedBeehiveId ||
                                !selectedDeviceId ||
                                loading ||
                                harvestState !== "idle"
                            }
                            className="w-full bg-amber-500 hover:bg-amber-600"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Starting...
                                </>
                            ) : (
                                "Start harvest"
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}