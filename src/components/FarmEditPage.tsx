import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {Textarea} from "./ui/textarea";
import {ArrowLeft, Save} from "lucide-react";
import {Farm} from "../types";
import {usePost} from "../hooks/usePost";
import {API_ROUTES} from "../util/ApiRoutes";

interface FarmEditPageProps {
    farm: Farm | null;
    onSave: (farm: Partial<Farm>) => void;
    onBack: () => void;
}

export function FarmEditPage({farm, onSave, onBack}: FarmEditPageProps) {
    const [formData, setFormData] = useState({
        id: farm?.id || "",
        name: farm?.name || "",
        description: farm?.description || "",
        address: farm?.address || "",
        beehiveIds: farm?.beehiveIds || []
    });

    const {data: newFarm, loading, error, mutate} = usePost<Farm>({extractData: true});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (farm?.id) {
            await mutate(API_ROUTES.farmRoutes + '/' + farm.id, formData, {method: 'PUT'});
            onSave(formData);
        } else {
            const result = await mutate(API_ROUTES.farmRoutes, [formData]);
            console.log('result: ', result[0]);
            const updatedFormData = {...formData, id: result[0]};
            onSave(updatedFormData);
            setFormData(updatedFormData)
        }
    };

    const isNewFarm = !farm;

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
                        <h1>{isNewFarm ? "Add New Farm" : "Edit Farm"}</h1>
                        <div className="opacity-90">{isNewFarm ? "Create a new apiary" : "Update farm details"}</div>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Farm Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Farm Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="e.g., Meadow Valley Farm"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="e.g., Main production farm with organic certification"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    placeholder="e.g., 123 Honey Lane, North Valley, CA 94530"
                                    required
                                    rows={3}
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
                                    <Save className="h-4 w-4 mr-2"/>
                                    Save Farm
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
