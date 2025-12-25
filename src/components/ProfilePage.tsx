import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";
import {Button} from "./ui/button";
import {Avatar, AvatarFallback} from "./ui/avatar";
import {Bell, Calendar, LogOut, Mail, MapPin, Settings, Shield, User} from "lucide-react";
import {Farm} from "../types";

interface ProfilePageProps {
    username: string;
    farms: Farm[];
    beehives: any[];
    onLogout: () => void;
}

export function ProfilePage({username, farms, beehives, onLogout}: ProfilePageProps) {
    const totalBeehives = beehives.length;
    const totalHoney = beehives.reduce((sum, hive) => sum + hive.honeyProduction, 0);

    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="p-4 pb-24 space-y-4 bg-gradient-to-b from-amber-50 to-yellow-100 min-h-screen">
            {/* Profile Header */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-20 w-20">
                            <AvatarFallback className="bg-amber-500 text-white">
                                {getInitials(username)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h2>Beekeeper Profile</h2>
                            <p className="text-muted-foreground">@{username}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                        <div className="text-center">
                            <div>{farms.length}</div>
                            <div className="text-muted-foreground">Farms</div>
                        </div>
                        <div className="text-center">
                            <div>{totalBeehives}</div>
                            <div className="text-muted-foreground">Hives</div>
                        </div>
                        <div className="text-center">
                            <div>{totalHoney.toFixed(0)}kg</div>
                            <div className="text-muted-foreground">Honey</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <User className="h-5 w-5 text-muted-foreground"/>
                        <div className="flex-1">
                            <div className="text-muted-foreground">Username</div>
                            <div>@{username}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Mail className="h-5 w-5 text-muted-foreground"/>
                        <div className="flex-1">
                            <div className="text-muted-foreground">Role</div>
                            <div>Beekeeper</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <Calendar className="h-5 w-5 text-muted-foreground"/>
                        <div className="flex-1">
                            <div className="text-muted-foreground">Member Since</div>
                            <div>January 2024</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <MapPin className="h-5 w-5 text-muted-foreground"/>
                        <div className="flex-1">
                            <div className="text-muted-foreground">Primary Farm</div>
                            <div>{farms.length > 0 ? farms[0].name : "Not set"}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Settings Menu */}
            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" disabled>
                        <Settings className="h-5 w-5 mr-3"/>
                        General Settings
                    </Button>

                    <Button variant="ghost" className="w-full justify-start" disabled>
                        <Bell className="h-5 w-5 mr-3"/>
                        Notification Preferences
                    </Button>

                    <Button variant="ghost" className="w-full justify-start" disabled>
                        <Shield className="h-5 w-5 mr-3"/>
                        Privacy & Security
                    </Button>
                </CardContent>
            </Card>

            {/* Logout */}
            <Button
                variant="destructive"
                className="w-full"
                onClick={onLogout}
            >
                <LogOut className="h-5 w-5 mr-2"/>
                Logout
            </Button>
        </div>
    );
}
