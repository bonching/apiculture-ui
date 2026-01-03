import {useState, useEffect, useRef} from "react";
import {Loader2, Check, ArrowLeft, X} from "lucide-react";
import { Button } from "./ui/button"
import {Beehive, Farm, HarvestDevice} from "../types";
import {usePost} from "../hooks/usePost";
import {API_ROUTES} from "../util/ApiRoutes";
import {toast} from "sonner";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card";
import {Label} from "./ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select";

type HarvestState = "idle" | "calibrating" | "starting_smoker" | "capturing_images" | "analyzing_honeypots" | "harvesting" | "completed" | "failed"

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
        if (!harvestId || harvestState === "idle" || harvestState === "completed" || harvestState === "failed") {
            return;
        }

        const pollHarvestStatus = async () => {
            try {
                const response = await fetch(`${API_ROUTES.harvestRoutes}/${harvestId}`);
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

                // Stop polling if completed or failed
                if (data.state === "completed" || data.state === "failed") {
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                        pollingIntervalRef.current = null;
                    }

                    // Show error toast if failed
                    if (data.state === "idle") {
                        const errorMessage = data.message || data.error || "Harvest failed. Please try again later.";
                        toast.error(errorMessage);
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

                        {/* Progress Bar */}
                        {harvestState !== "idle" && (
                            <div className="space-y-4 animate-in fade-in slide-in-form-bottom-2 duration-300">
                                {/* Status Card */}
                                <div className={`relative overflow-hidden rounded-lg border p-4 transition-all duration-500 ${
                                    harvestState === "calibrating"
                                        ? "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
                                        : harvestState === "starting_smoker"
                                        ? "bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800" 
                                        : harvestState === "capturing_images"
                                        ? "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800" 
                                        : harvestState === "analyzing_honeypots"
                                        ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:indigo-purple-800"
                                        : harvestState === "harvesting"
                                        ? "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:amber-purple-800"
                                        : harvestState === "failed"
                                        ? "bg-amber-50 border-red-200 dark:bg-red-950 dark:red-purple-800"
                                        : "bg-green-50 border-green-200 dark:bg-green-950 dark:green-purple-800"
                                }`}>
                                    {/* Animated background gradient */}
                                    {harvestState !== "completed" && (
                                        <div className="absolute inset-0 opacity-30">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"
                                                 style={{
                                                     backgroundSize: "200% 100%",
                                                     animation: "shimmer 2s infinite linear"
                                                 }}
                                            />
                                        </div>
                                    )}

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                {harvestState === "calibrating" && (
                                                    <div className="relative">
                                                        <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                                                        <div className="absolute inset-0 h-5 w-5 rounded-full bg-blue-400 animate-ping opacity-20" />
                                                    </div>
                                                )}
                                                {harvestState === "starting_smoker" && (
                                                    <div className="relative">
                                                        <Loader2 className="h-5 w-5 text-gray-600 animate-spin" />
                                                        <div className="absolute inset-0 h-5 w-5 rounded-full bg-gray-400 animate-ping opacity-20" />
                                                    </div>
                                                )}
                                                {harvestState === "capturing_images" && (
                                                    <div className="relative">
                                                        <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />
                                                        <div className="absolute inset-0 h-5 w-5 rounded-full bg-purple-400 animate-ping opacity-20" />
                                                    </div>
                                                )}
                                                {harvestState === "analyzing_honeypots" && (
                                                    <div className="relative">
                                                        <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                                                        <div className="absolute inset-0 h-5 w-5 rounded-full bg-indigo-400 animate-ping opacity-20" />
                                                    </div>
                                                )}
                                                {harvestState === "harvesting" && (
                                                    <div className="relative">
                                                        <Loader2 className="h-5 w-5 text-amber-600 animate-spin" />
                                                        <div className="absolute inset-0 h-5 w-5 rounded-full bg-amber-400 animate-ping opacity-20" />
                                                    </div>
                                                )}
                                                {harvestState === "completed" && (
                                                    <div className="relative">
                                                        <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center animate-in zoom-in duration-300">
                                                            <Check className="h-3 w-3 text-white" />
                                                        </div>
                                                        <div className="absolute inset-0 h-5 w-5 rounded-full bg-green-400 animate-ping" />
                                                    </div>
                                                )}
                                                {harvestState === "failed" && (
                                                    <div className="relative">
                                                        <div className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center animate-in zoom-in duration-300">
                                                            <X className="h-3 w-3 text-white" />
                                                        </div>
                                                        <div className="absolute inset-0 h-5 w-5 rounded-full bg-red-400 animate-ping" />
                                                    </div>
                                                )}
                                                <span className={`text-sm font-semibold transition-colors duration-300 ${
                                                    harvestState === "calibrating"
                                                        ? "text-blue-700 dark:text-blue-300"
                                                        : harvestState === "starting_smoker"
                                                        ? "text-gray-700 dark:text-gray-300"
                                                        : harvestState === "capturing_images"
                                                        ? "text-purple-700 dark:text-purple-300"
                                                        : harvestState === "analyzing_honeypots"
                                                        ? "text-indigo-700 dark:text-indigo-300"
                                                        : harvestState === "harvesting"
                                                        ? "text-amber-700 dark:text-amber-300"
                                                        : harvestState === "failed"
                                                        ? "text-red-700 dark:text-red-300"
                                                        : "text-green-700 dark:text-green-300"
                                                }`}>
                                                    {harvestState === "calibrating" && "Calibrating the device..."}
                                                    {harvestState === "starting_smoker" && "Starting smoker..."}
                                                    {harvestState === "capturing_images" && "Capturing beehive interior images..."}
                                                    {harvestState === "analyzing_honeypots" && "Analyzing honeypots..."}
                                                    {harvestState === "harvesting" && "Harvesting honey..."}
                                                    {harvestState === "completed" && "Harvest completed!"}
                                                    {harvestState === "failed" && "Harvest failed!"}
                                                </span>
                                            </div>
                                            <span className={`text-lg font-bold tabular-nums transition-all duration-300 ${
                                                harvestState === "completed" ? "text-green-600 scale-110" : "text-muted-foreground"
                                            }`}>
                                                {Math.round(progress)}%
                                            </span>
                                        </div>

                                        {/* Enhanced Progress Bar */}
                                        <div className="relative">
                                            <div className="h-3 w-full bg-white dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className={`h-full transition-all duration-500 ease-out relative ${
                                                        harvestState === "calibrating" 
                                                        ? "bg-gradient-to-r from-blue-400 to-blue-600"
                                                        : harvestState === "starting_smoker"
                                                        ? "bg-gradient-to-r from-gray-400 to-gray-600"
                                                        : harvestState === "capturing_images"
                                                        ? "bg-gradient-to-r from-purple-400 to-purple-600"
                                                        : harvestState === "analyzing_honeypots"
                                                        ? "bg-gradient-to-r from-indigo-400 to-indigo-600"
                                                        : harvestState === "harvesting"
                                                        ? "bg-gradient-to-r from-amber-400 to-amber-600"
                                                        : harvestState === "failed"
                                                        ? "bg-gradient-to-r from-red-400 to-red-600"
                                                        : "bg-gradient-to-r from-green-400 to-green-600"
                                                    }`}
                                                    style={{ width: `${progress}%` }}
                                                >
                                                    {/* Shimmer effect on progress bar */}
                                                    {harvestState !== "completed" && (
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-fast"
                                                             style={{
                                                                 backgroundSize: "200% 100%",
                                                                 animation: "shimmer 1.5s infinite linear",
                                                             }}
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Progress milestone markers - now 6 stages */}
                                            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-0.5">
                                                {[16.67, 33.33, 50, 66.67, 83.33].map((milestone, index) => (
                                                    <div
                                                        key={index}
                                                        className={`w-0.5 h-4 rounded-full transition-full duration-300 ${
                                                            progress >= milestone
                                                                ? "bg-white/80 shadow-sm"
                                                                : "bg-gray-300 dark:bg-gray-600"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* State-specific messages */}
                                        <p className="text-xs text-muted-foreground mt-2 animate-in fade-in duration-300">
                                            {harvestState === "calibrating" && "Preparing extraction system and verifying sensor readings..."}
                                            {harvestState === "starting_smoker" && "Activating smoker to calm the bees..."}
                                            {harvestState === "capturing_images" && "Taking high-resolution photos of honeycomb frames..."}
                                            {harvestState === "analyzing_honeypots" && "AI analyzing honeycomb cells for optimal extraction..."}
                                            {harvestState === "harvesting" && "Extracting honey from frames. Please wait..."}
                                            {harvestState === "completed" && "Honey extraction complete. Ready for collection..."}
                                            {harvestState === "failed" && "An error occurred during the harvest process. Please check the device and try again."}
                                        </p>
                                    </div>
                                </div>

                                {harvestState === "completed" && (
                                    <Button
                                        onClick={handleReset}
                                        variant="outline"
                                        className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150 border-green-300 hover:bg-green-50 hover:border-green-400 dark:border-green-800 dark:hover:bg-green-950"
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        Start New Harvest
                                    </Button>
                                )}

                                {harvestState === "failed" && (
                                    <Button
                                        onClick={handleReset}
                                        variant="outline"
                                        className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150 border-red-300 hover:bg-red-50 hover:border-red-400 dark:border-red-800 dark:hover:bg-red-950"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Try Again
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}