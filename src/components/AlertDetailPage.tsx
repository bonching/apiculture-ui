import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card";
import {Button} from "./ui/button";
import {Badge} from "./ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    CloudRain,
    Droplet,
    Flower,
    Gauge,
    Info,
    Sun,
    Thermometer,
    Volume2,
    Waves,
    Wind,
    Zap
} from "lucide-react";
import {Alert as AlertType, Beehive} from "../types";
import {useState, useEffect} from "react";
import {API_ROUTES} from "../util/ApiRoutes";

interface AlertDetailPageProps {
    alert: AlertType;
    beehive: (Beehive & {
        sensors: {
            temperature: number;
            humidity: number;
            co2: number;
            beeCount: number;
            soundLevel: number;
            activityLevel: number;
            voc: number;
            vibration: number;
            lux: number;
            pheromone: number;
            uvIndex: number;
            rainfall: number;
            windSpeed: number;
            barometricPressure: number;
            pollenConcentration: number;
            status: "online" | "offline";
        };
    }) | null;
    onBack: () => void;
}

export function AlertDetailPage({alert, beehive, onBack}: AlertDetailPageProps) {
    const isPredatorAlert = alert.alertType === "predator_detected";
    const isBeeCountAlert = alert.dataType === "bee_count";
    const isHoneyHarvestedAlert = alert.alertType === "honey_harvested";
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [imageData, setImageData] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const [honeypotDetails, setHoneypotDetails] = useState<any>(null);
    const [honeypotLoading, setHoneypotLoading] = useState(false);

    // Eager load honeypot details for honey_harvested alerts
    useEffect(() => {
        if (isHoneyHarvestedAlert && alert.imageId && !honeypotDetails) {
            fetchHoneypotDetails();
        }
    }, [isHoneyHarvestedAlert, alert.imageId]);

    const fetchImage = async () => {
        if (!alert.imageId) {
            setImageError("No image ID available");
            return;
        }

        setImageLoading(true);
        setImageError(null);
        setIsImageDialogOpen(false);

        try {
            const response = await fetch(`${API_ROUTES.imageRoutes}/${alert.imageId}?include_data=true`);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            const result = await response.json();

            // Debug: Log the response structure
            console.log('API Response:', result);

            // Try multiple possible response structures
            let imageBase64Data = null;

            if (result.data && typeof result.data === 'string') {
                // Case 1: { data: "base64string" } }
                imageBase64Data = result.data;
            } else if (result.data && typeof result.data.data) {
                // Case 2: {data: { data: "base64string" } }
                imageBase64Data = result.data.data;
            } else if (typeof result === 'string') {
                // Case 3: Direct base64 string
                imageBase64Data = result;
            } else if (result.image) {
                // Case 4: { image: "base64string" }
                imageBase64Data = result.image;
            }

            if (imageBase64Data) {
                setImageData(imageBase64Data);
            } else {
                console.error('Response structure:', JSON.stringify(result, null, 2));
                throw new Error("Image data not found in response")
            }
        } catch (error) {
            setImageError(error instanceof Error ? error.message : "Failed to load image");
        } finally {
            setImageLoading(false);
        }
    }

    const fetchHoneypotDetails = async () => {
        if (!alert.imageId) {
            setImageError("No image ID available");
            return;
        }

        setHoneypotLoading(true);
        setImageError(null);

        try {
            const response = await fetch(`${API_ROUTES.imageRoutes}/${alert.imageId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch honeypot details: ${response.statusText}`);
            }
            const result = await response.json();
            console.log('Honeypot Details:', result['honeypot_analysis'] || result);
            setHoneypotDetails(result);
        } catch (error) {
            console.error('Honeypot fetching honeypot details:', error);
            setImageError(error instanceof Error ? error.message : "Failed to load honeypot details");
        } finally {
            setHoneypotLoading(false);
        }
    };

    const viewHoneypotImage = async () => {
        if (!honeypotDetails) {
            await fetchHoneypotDetails();
        }
        await fetchImage();
    }

    const getAlertIcon = (severity: string) => {
        switch (severity) {
            case "critical":
                return <AlertTriangle className="h-8 w-8 text-red-500"/>;
            case "warning":
                return <AlertCircle className="h-8 w-8 text-yellow-500"/>;
            case "info":
                return <Info className="h-8 w-8 text-blue-500"/>;
            default:
                return <Info className="h-8 w-8"/>;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "critical":
                return "bg-red-500";
            case "warning":
                return "bg-yellow-500";
            case "info":
                return "bg-blue-500";
            default:
                return "bg-gray-500";
        }
    };

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
                        <ArrowLeft className="h-5 w-5"/>
                    </Button>
                    <div>
                        <h1>Alert Details</h1>
                        <div className="opacity-90">{alert.beehiveName}</div>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Alert Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start gap-4">
                            {getAlertIcon(alert.severity)}
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <CardTitle>{alert.title}</CardTitle>
                                    <Badge className={getSeverityColor(alert.severity)}>
                                        {alert.severity}
                                    </Badge>
                                </div>
                                <CardDescription>
                                    {[alert.beehiveName, alert.farmName].filter(Boolean).join(" - ") || "N/A"}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <div className="text-muted-foreground">Message</div>
                            <p>{alert.message}</p>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Timestamp</div>
                            <div>{new Date(alert.timestampMs).toLocaleString()}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Honeypot Details for Honey Harvested */}
                {isHoneyHarvestedAlert && alert.imageId && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Honeypot Details</CardTitle>
                            <CardDescription>Harvest Information and analysis</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {honeypotLoading && (
                                    <div className="text-center py-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
                                        <p className="text-sm text-muted-foreground">Loading details...</p>
                                    </div>
                                )}

                                {honeypotDetails && !honeypotLoading && (
                                    <div className="space-y-4">
                                        {/* Summary Stats */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {honeypotDetails.honeypots_detected !== undefined && (
                                                <div className="p-3 bg-muted rounded-lg">
                                                    <div className="text-xs text-muted-foreground mb-1">Honeypots Detected</div>
                                                    <div className="text-sm font-medium">
                                                        {honeypotDetails.honeypots_detected ? "Yes" : "No"}
                                                    </div>
                                                </div>
                                            )}
                                            {honeypotDetails.total_honeypots !== undefined && (
                                                <div className="p-3 bg-muted rounded-lg">
                                                    <div className="text-xs text-muted-foreground mb-1">Total Honeypots</div>
                                                    <div className="text-sm font-medium">{honeypotDetails.total_honeypots}</div>
                                                </div>
                                            )}
                                            {honeypotDetails.filled_honeypots !== undefined && (
                                                <div className="p-3 bg-muted rounded-lg">
                                                    <div className="text-xs text-muted-foreground mb-1">Filled Honeypots</div>
                                                    <div className="text-sm font-medium">{honeypotDetails.filled_honeypots}</div>
                                                </div>
                                            )}
                                            {honeypotDetails.empty_honeypots !== undefined && (
                                                <div className="p-3 bg-muted rounded-lg">
                                                    <div className="text-xs text-muted-foreground mb-1">Empty Honeypots</div>
                                                    <div className="text-sm font-medium">{honeypotDetails.empty_honeypots}</div>
                                                </div>
                                            )}
                                            {honeypotDetails.fill_percentage !== undefined && (
                                                <div className="p-3 bg-muted rounded-lg">
                                                    <div className="text-xs text-muted-foreground mb-1">Fill Percentage</div>
                                                    <div className="text-sm font-medium">{honeypotDetails.fill_percentage}</div>
                                                </div>
                                            )}
                                            {honeypotDetails.confidence !== undefined && (
                                                <div className="p-3 bg-muted rounded-lg">
                                                    <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                                                    <div className="text-sm font-medium">{honeypotDetails.confidence}</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Grid Analysis */}
                                        {honeypotDetails.grid_analysis && (
                                            <div className="space-y-2">
                                                <div className="text-sm font-semibold">Grid Analysis</div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {Object.entries(honeypotDetails.grid_analysis).map(([position, data]: [string, any]) => (
                                                        data.total > 0 && (
                                                            <div key={position} className="p-2 bg-muted rounded border border-border">
                                                                <div className="text-xs font-medium capitalize mb-1">
                                                                    {position.replace(/_/g, ' ')}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    <div>Total: {data.total}</div>
                                                                    <div>Filled: {data.filled}</div>
                                                                    <div className="text-amber-600 font-medium">
                                                                        Fill: {data.fill_percentage.toFixed(0)}%
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Honeypot Locations */}
                                        {honeypotDetails.honeypot_locations && honeypotDetails.honeypot_locations.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="text-sm font-semibold">
                                                    Honeypot Locations ({honeypotDetails.honeypot_locations.length})
                                                </div>
                                                <div className="max-h-48 overflow-y-auto space-y-2">
                                                    {honeypotDetails.honeypot_locations.map((location: any, index: number) => (
                                                        <div key={location.id || index} className="p-2 bg-muted rounded text-xs">
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <span className="text-muted-foreground">ID:</span> {location.id}
                                                                </div>
                                                                <div>
                                                                    <span className="text-muted-foreground">Quadrant:</span> {location.quadrant}
                                                                </div>
                                                                <div>
                                                                    <span className="text-muted-foreground">Position:</span> ({location.center_x}, {location.center_y})
                                                                </div>
                                                                <div>
                                                                    <span className="text-muted-foreground">Size:</span> {location.width}*{location.height}
                                                                </div>
                                                                {location.position_3d && (
                                                                    <>
                                                                        <div className="col-span-2">
                                                                            <span className="text-muted-foreground">3D Position:</span> ({location.position_3d.x_mm.toFixed(1)}, {location.position_3d.y_mm.toFixed(1)}, {location.position_3d.z_mm.toFixed(1)}) mm
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-muted-foreground">Distance:</span> {location.position_3d.distance_from_center_mm.toFixed(1)} mm
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-muted-foreground">Angle:</span> {location.position_3d.angle_degrees.toFixed(1)}°
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Detection Details */}
                                        {honeypotDetails.details && (
                                            <div className="p-3 bg-muted rounded-lg space-y-1">
                                                <div className="text-xs font-semibold mb-2">Detection Details</div>
                                                {honeypotDetails.details.description && (
                                                    <div className="text-xs">
                                                        <span className="text-muted-foreground">Method:</span> {honeypotDetails.details.description}
                                                    </div>
                                                )}
                                                {honeypotDetails.details.image_size && (
                                                    <div className="text-xs">
                                                        <span className="text-muted-foreground">Image Size:</span> {honeypotDetails.details.image_size}
                                                    </div>
                                                )}
                                                {honeypotDetails.details.content_type && (
                                                    <div className="text-xs">
                                                        <span className="text-muted-foreground">Content Type:</span> {honeypotDetails.details.content_type}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Analyzed At */}
                                        {honeypotDetails.analyzed_at && (
                                            <div className="text-xs text-muted-foreground">
                                                Analyzed at: {new Date(honeypotDetails.analyzed_at.$date || honeypotDetails.analyzed_at).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-3">
                                        View the captured image from the honey harvest operation.
                                    </p>
                                    <Button
                                        className="w-full"
                                        variant="default"
                                        onClick={viewHoneypotImage}
                                        disabled={!alert.imageId}
                                    >
                                        View Honeypot Image
                                    </Button>
                                </div>

                                {imageError && (
                                    <div className="text-sm text-red-500 text-center">
                                        {imageError}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Bee Count Image */}
                {isBeeCountAlert && alert.imageId && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Bee Count Analysis</CardTitle>
                            <CardDescription>Captured image and report</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 bg-muted-rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Review the captured image from the bee count analysis.
                                    </p>
                                    <Button
                                        className="w-full"
                                        variant="default"
                                        onClick={fetchImage}
                                        disabled={!alert.imageId}
                                    >
                                        View Captured Image
                                    </Button>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {alert.details?.method && (
                                        <p><strong>Detection Method:</strong> {alert.details.method}</p>
                                    )}
                                    {alert.sensorValue && (
                                        <p><strong>Bee Count:</strong> {Number(alert.sensorValue).toLocaleString()}</p>
                                    )}
                                    <p><strong>Timestamp:</strong> {new Date(alert.timestampMs).toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Sensor Readings at Alert Time */}
                {beehive && (alert.alertType === "anomaly_detected") && (
                    <>
                        {/* Environmental Readings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Environmental Readings</CardTitle>
                                <CardDescription>Values at time of alert</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Thermometer className="h-5 w-5 text-red-500"/>
                                        <div>Temperature</div>
                                    </div>
                                    <div>{beehive.sensors.temperature}°C</div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Droplet className="h-5 w-5 text-blue-500"/>
                                        <div>Humidity</div>
                                    </div>
                                    <div>{beehive.sensors.humidity}%</div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Wind className="h-5 w-5 text-gray-500"/>
                                        <div>CO₂ Level</div>
                                    </div>
                                    <div>{beehive.sensors.co2} ppm</div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Zap className="h-5 w-5 text-orange-500"/>
                                        <div>VOC Level</div>
                                    </div>
                                    <div>{beehive.sensors.voc} kΩ</div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Gauge className="h-5 w-5 text-indigo-500"/>
                                        <div>Barometric Pressure</div>
                                    </div>
                                    <div>{beehive.sensors.barometricPressure} hPa</div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Acoustic & Activity Readings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Acoustic & Activity Readings</CardTitle>
                                <CardDescription>Sound and movement monitoring</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Volume2 className="h-5 w-5 text-purple-500"/>
                                        <div>Sound Level</div>
                                    </div>
                                    <div>{beehive.sensors.soundLevel} dB</div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Activity className="h-5 w-5 text-green-500"/>
                                        <div>Activity Level</div>
                                    </div>
                                    <div>{beehive.sensors.activityLevel}%</div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Waves className="h-5 w-5 text-cyan-500"/>
                                        <div>Vibration</div>
                                    </div>
                                    <div>{beehive.sensors.vibration} mm/s</div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Activity className="h-5 w-5 text-amber-500"/>
                                        <div>Bee Count</div>
                                    </div>
                                    <div>{beehive.sensors.beeCount.toLocaleString()}</div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Light & Weather Readings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Light & Weather Readings</CardTitle>
                                <CardDescription>External environmental conditions</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Sun className="h-5 w-5 text-yellow-500"/>
                                        <div>Light Intensity</div>
                                    </div>
                                    <div>{beehive.sensors.lux} lux</div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Sun className="h-5 w-5 text-orange-500"/>
                                        <div>UV Index</div>
                                    </div>
                                    <div>{beehive.sensors.uvIndex}</div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CloudRain className="h-5 w-5 text-blue-400"/>
                                        <div>Rainfall</div>
                                    </div>
                                    <div>{beehive.sensors.rainfall} mm</div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Wind className="h-5 w-5 text-teal-500"/>
                                        <div>Wind Speed</div>
                                    </div>
                                    <div>{beehive.sensors.windSpeed} km/h</div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Chemical & Biological Readings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Chemical & Biological Readings</CardTitle>
                                <CardDescription>Pheromone and pollen monitoring</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Zap className="h-5 w-5 text-pink-500"/>
                                        <div>Pheromone Level</div>
                                    </div>
                                    <div>{beehive.sensors.pheromone}%</div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Flower className="h-5 w-5 text-yellow-600"/>
                                        <div>Pollen Concentration</div>
                                    </div>
                                    <div>{beehive.sensors.pollenConcentration}%</div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Predator Detection Image */}
                {isPredatorAlert && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Predator Detection</CardTitle>
                            <CardDescription>Captured image and evidence</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-3">
                                        A predator was detected by the defense system sensors. Review the captured image for identification and assessment.
                                    </p>
                                    <Button
                                        className="w-full"
                                        variant="default"
                                        onClick={fetchImage}
                                        disabled={!alert.imageId}
                                    >
                                        View Captured Image
                                    </Button>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {(alert.details?.method || alert.details?.predatorDetectionMethod) && (
                                        <p><strong>Detection Method:</strong> {alert.details.method || alert.details.predatorDetectionMethod}</p>
                                    )}
                                    <p><strong>Timestamp:</strong> {new Date(alert.timestampMs).toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/*{!beehive && (*/}
                {/*    <Card>*/}
                {/*        <CardContent className="py-8">*/}
                {/*            <p className="text-muted-foreground text-center">*/}
                {/*                No sensor data available for this beehive*/}
                {/*            </p>*/}
                {/*        </CardContent>*/}
                {/*    </Card>*/}
                {/*)}*/}

                {/* Recommended Actions */}
                {alert.alertType !== "online_sensor" && alert.alertType !== "honey_harvested" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Recommended Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 list-disc list-outside ml-6 text-muted-foreground">
                                {alert.alertType === "predator_detected" && (
                                    <>
                                        <li>Review the captured image immediately to identify the predator type</li>
                                        <li>Check if the predator is still in the vicinity</li>
                                        <li>Activate additional defense measures if available</li>
                                        <li>Monitor bee activity and stress levels</li>
                                        <li>Consider installing physical barriers or deterrents</li>
                                        <li>Document the incident for pattern analysis</li>
                                    </>
                                )}
                                {alert.alertType === "offline_sensor" && (
                                    <>
                                        <li>Check sensor power supply and connections</li>
                                        <li>Verify network connectivity</li>
                                        <li>Replace batteries if applicable</li>
                                        <li>Contact support if issue persists</li>
                                    </>
                                )}
                                {alert.severity === "critical" && alert.title.includes("Temperature") && (
                                    <>
                                        <li>Ensure proper ventilation</li>
                                        <li>Check for direct sunlight exposure</li>
                                        <li>Monitor bee colony behavior</li>
                                        <li>Consider emergency cooling measures</li>
                                    </>
                                )}
                                {alert.alertType === "anomaly_detected" && alert.severity === "warning" && (
                                    <>
                                        <li>Monitor the situation closely</li>
                                        <li>Check sensor readings regularly</li>
                                        <li>Prepare to take action if conditions worsen</li>
                                    </>
                                )}
                                {alert.severity === "info" && alert.alertType === "anomaly_detected" && (
                                    <>
                                        <li>No immediate action required</li>
                                        <li>Continue regular monitoring</li>
                                    </>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Image Dialog */}
            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            {isPredatorAlert ? "Predator Detection Image" : isBeeCountAlert ? "Bee Count Analysis Image" : isHoneyHarvestedAlert ? "Honeypot Image" : "Image"}
                        </DialogTitle>
                        <DialogDescription>
                            Captured on {new Date(alert.timestampMs).toLocaleString()}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center items-center min-h-[300px]">
                        {imageLoading && (
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                                <p className="text-muted-foreground">Loading image...</p>
                            </div>
                        )}
                        {imageError && (
                            <div className="text-center text-red-500">
                                <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                                <p>{imageError}</p>
                            </div>
                        )}
                        {imageData && !imageLoading && !imageError && (
                            <img
                                src={`data:image/jpeg;base64,${imageData}`}
                                alt={isPredatorAlert ? "Predator Detection" : isBeeCountAlert ? "Bee Count Analysis" : isHoneyHarvestedAlert ? "Honeypot" : "Alert Image"}
                                className="max-w-full h-auto rounded-lg"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
