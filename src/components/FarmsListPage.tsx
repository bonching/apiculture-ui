import {Card, CardContent} from "./ui/card";
import {Button} from "./ui/button";
import {Badge} from "./ui/badge";
import {Edit, Eye, MapPin, Plus, Trash2} from "lucide-react";
import {Farm} from "../types";

interface FarmsListPageProps {
    farms: Farm[];
    onViewFarmDetails: (farm: Farm) => void;
    onEditFarm: (farm: Farm) => void;
    onAddFarm: () => void;
    onDeleteFarm: (farmId: string) => void;
}

export function FarmsListPage({farms, onViewFarmDetails, onEditFarm, onAddFarm, onDeleteFarm}: FarmsListPageProps) {
    return (
        <div className="p-4 pb-24 space-y-4 bg-gradient-to-b from-amber-50 to-yellow-100 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1>My Farms</h1>
                    <p className="text-muted-foreground">Manage all your apiaries</p>
                </div>
                <Button onClick={onAddFarm} size="sm" className="bg-amber-500 hover:bg-amber-600">
                    <Plus className="h-4 w-4 mr-1"/>
                    Add Farm
                </Button>
            </div>

            <div className="space-y-3">
                {farms.map((farm) => (
                    <Card key={farm.id}>
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3>{farm.name}</h3>
                                    </div>
                                    <p className="text-muted-foreground mb-3">{farm.description}</p>
                                    <div className="flex items-start gap-2 mb-3">
                                        <MapPin className="h-4 w-4 text-amber-500"/>
                                        <p className="text-xs text-gray-600">{farm.address}</p>
                                    </div>
                                    <div>
                                        <Badge variant="secondary">{farm.beehiveIds.length} hives</Badge>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                        onClick={() => onEditFarm(farm)}
                                    >
                                        <Edit className="h-4 w-4"/>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                        onClick={() => onViewFarmDetails(farm)}
                                    >
                                        <Eye className="h-4 w-4"/>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => onDeleteFarm(farm.id)}
                                    >
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {farms.length === 0 && (
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50 text-muted-foreground"/>
                            <p className="text-muted-foreground mb-4">No farms yet</p>
                            <Button onClick={onAddFarm} className="bg-amber-500 hover:bg-amber-600">
                                <Plus className="h-4 w-4 mr-2"/>
                                Add Your First Farm
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}