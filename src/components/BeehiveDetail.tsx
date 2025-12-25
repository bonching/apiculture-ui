import {useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card";
import {Badge} from "./ui/badge";
import {Button} from "./ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "./ui/dialog";
import {TrendsDialog} from "./TrendsDialog";
import {
    Activity,
    ArrowLeft,
    Camera,
    CloudRain,
    Droplet,
    Flower,
    Gauge,
    Sun,
    Thermometer,
    TrendingUp,
    Volume2,
    Waves,
    Wind,
    Zap
} from "lucide-react";
import {Beehive} from "../types";
import {ImageWithFallback} from "./figma/ImageWithFallback";
import {formatHoneyWeight} from "../hooks/useHoneyWeight";

interface BeehiveDetailProps {
    beehive: Beehive & {
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
    };
    onBack: () => void;
}

export function BeehiveDetail({beehive, onBack}: BeehiveDetailProps) {
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [trendMetric, setTrendMetric] = useState<"honey" | "temperature" | "humidity" | "beeCount" | "co2" | "sound" | "activity" | "voc" | "vibration" | "lux" | "uvIndex" | "rainfall" | "windSpeed" | "barometricPressure" | "pheromone" | "pollenConcentration" | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "excellent":
                return "bg-green-500";
            case "good":
                return "bg-blue-500";
            case "fair":
                return "bg-yellow-500";
            case "poor":
                return "bg-orange-500";
            case "critical":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-100 pb-6">
            {/* Header */}
            <div className="bg-amber-500 text-white p-4 sticky top-0 z-10 shadow-md">
                <div className="flex items-center gap-3 mb-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-amber-600"
                        onClick={onBack}
                    >
                        <ArrowLeft className="h-5 w-5"/>
                    </Button>
                    <div className="flex-1">
                        <h1>{beehive.name}</h1>
                        <div className="opacity-90">ID: {beehive.id}</div>
                    </div>
                    <Badge className={getStatusColor(beehive.harvestStatus)}>
                        {beehive.harvestStatus}
                    </Badge>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-muted-foreground mb-1">Honey Production</div>
                                    <div>{formatHoneyWeight(beehive.honeyProduction)}</div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-100"
                                    onClick={() => setTrendMetric("honey")}
                                >
                                    <TrendingUp className="h-4 w-4"/>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-muted-foreground mb-1">Est. Bee Count</div>
                                    <div>{beehive.sensors.beeCount.toLocaleString()}</div>
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                        onClick={() => setImageDialogOpen(true)}
                                    >
                                        <Camera className="h-4 w-4"/>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                                        onClick={() => setTrendMetric("beeCount")}
                                    >
                                        <TrendingUp className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Current Sensor Readings - Environmental */}
                <Card>
                    <CardHeader>
                        <CardTitle>Environmental Readings</CardTitle>
                        <CardDescription>Real-time environmental data</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                <Thermometer className="h-5 w-5 text-red-500"/>
                                <div>Temperature</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div>{beehive.sensors.temperature}°C</div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                                    onClick={() => setTrendMetric("temperature")}
                                >
                                    <TrendingUp className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                <Droplet className="h-5 w-5 text-blue-500"/>
                                <div>Humidity</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div>{beehive.sensors.humidity}%</div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                    onClick={() => setTrendMetric("humidity")}
                                >
                                    <TrendingUp className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                <Wind className="h-5 w-5 text-gray-500"/>
                                <div>CO₂ Level</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div>{beehive.sensors.co2} ppm</div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                                    onClick={() => setTrendMetric("co2")}
                                >
                                    <TrendingUp className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                <Zap className="h-5 w-5 text-orange-500"/>
                                <div>VOC Level</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div>{beehive.sensors.voc} kΩ</div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-100"
                                    onClick={() => setTrendMetric("voc")}
                                >
                                    <TrendingUp className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                <Gauge className="h-5 w-5 text-indigo-500"/>
                                <div>Barometric Pressure</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div>{beehive.sensors.barometricPressure} hPa</div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100"
                                    onClick={() => setTrendMetric("barometricPressure")}
                                >
                                    <TrendingUp className="h-4 w-4"/>
                                </Button>
                            </div>
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
                            <div className="flex items-center gap-2">
                                <div>{beehive.sensors.soundLevel} dB</div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                                    onClick={() => setTrendMetric("sound")}
                                >
                                    <TrendingUp className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                <Activity className="h-5 w-5 text-green-500"/>
                                <div>Activity Level</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div>{beehive.sensors.activityLevel}%</div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                                    onClick={() => setTrendMetric("activity")}
                                >
                                    <TrendingUp className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                <Waves className="h-5 w-5 text-cyan-500"/>
                                <div>Vibration</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div>{beehive.sensors.vibration} mm/s</div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-100"
                                    onClick={() => setTrendMetric("vibration")}
                                >
                                    <TrendingUp className="h-4 w-4"/>
                                </Button>
                            </div>
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
                            <div className="flex items-center gap-2">
                                <div>{beehive.sensors.lux} lux</div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100"
                                    onClick={() => setTrendMetric("lux")}
                                >
                                    <TrendingUp className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                <Sun className="h-5 w-5 text-orange-500"/>
                                <div>UV Index</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div>{beehive.sensors.uvIndex}</div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-100"
                                    onClick={() => setTrendMetric("uvIndex")}
                                >
                                    <TrendingUp className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                <CloudRain className="h-5 w-5 text-blue-400"/>
                                <div>Rainfall</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div>{beehive.sensors.rainfall} mm</div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                    onClick={() => setTrendMetric("rainfall")}
                                >
                                    <TrendingUp className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                <Wind className="h-5 w-5 text-teal-500"/>
                                <div>Wind Speed</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div>{beehive.sensors.windSpeed} km/h</div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-teal-600 hover:text-teal-700 hover:bg-teal-100"
                                    onClick={() => setTrendMetric("windSpeed")}
                                >
                                    <TrendingUp className="h-4 w-4"/>
                                </Button>
                            </div>
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
                            <div className="flex items-center gap-2">
                                <div>{beehive.sensors.pheromone}%</div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-pink-600 hover:text-pink-700 hover:bg-pink-100"
                                    onClick={() => setTrendMetric("pheromone")}
                                >
                                    <TrendingUp className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                                <Flower className="h-5 w-5 text-yellow-600"/>
                                <div>Pollen Concentration</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div>{beehive.sensors.pollenConcentration}%</div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100"
                                    onClick={() => setTrendMetric("pollenConcentration")}
                                >
                                    <TrendingUp className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Image Popup Dialog */}
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Camera className="h-5 w-5"/>
                            Latest Captured Image
                        </DialogTitle>
                    </DialogHeader>
                    <div className="relative rounded-lg overflow-hidden">
                        <ImageWithFallback
                            src="https://images.unsplash.com/photo-1730190168042-3bef4553a8f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25leWNvbWIlMjBiZWVoaXZlJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NjAyMjgxMTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="Beehive inspection"
                            className="w-full h-auto object-cover"
                        />
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div>Estimated Count: {beehive.sensors.beeCount.toLocaleString()} bees</div>
                                <Badge className="bg-green-500">Active</Badge>
                            </div>
                            <p className="text-muted-foreground mt-2">Image-based bee counting analysis</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Single Trend Dialog - Lazy Loading */}
            <TrendsDialog
                open={trendMetric !== null}
                onOpenChange={(open) => !open && setTrendMetric(null)}
                beehive={beehive}
                metric={trendMetric}
            />
        </div>
    );
}
