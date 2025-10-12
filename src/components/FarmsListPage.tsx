import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, Edit, ChevronRight, Plus } from "lucide-react";
import { Farm } from "../types";

interface FarmsListPageProps {
  farms: Farm[];
  onViewFarmDetails: (farm: Farm) => void;
  onEditFarm: (farm: Farm) => void;
  onAddFarm: () => void;
}

export function FarmsListPage({ farms, onViewFarmDetails, onEditFarm, onAddFarm }: FarmsListPageProps) {
  return (
    <div className="p-4 pb-24 space-y-4 bg-gradient-to-b from-amber-50 to-yellow-100 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1>My Farms</h1>
          <p className="text-muted-foreground">Manage all your apiaries</p>
        </div>
        <Button onClick={onAddFarm} size="sm" className="bg-amber-500 hover:bg-amber-600">
          <Plus className="h-4 w-4 mr-1" />
          Add Farm
        </Button>
      </div>

      <div className="space-y-3">
        {farms.map((farm) => (
          <Card key={farm.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-amber-500" />
                    <h3>{farm.name}</h3>
                  </div>
                  <p className="text-muted-foreground">{farm.description}</p>
                  <p className="text-muted-foreground">{farm.address}</p>
                </div>
                <Badge variant="secondary">{farm.beehiveIds.length} hives</Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onEditFarm(farm)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  className="flex-1 bg-amber-500 hover:bg-amber-600"
                  onClick={() => onViewFarmDetails(farm)}
                >
                  View Details
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {farms.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No farms yet</p>
              <Button onClick={onAddFarm} className="bg-amber-500 hover:bg-amber-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Farm
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
