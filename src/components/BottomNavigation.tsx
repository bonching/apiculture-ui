import {Bell, Droplet, Home, MapPin, MoreHorizontal, User, Wifi} from "lucide-react";
import {Badge} from "./ui/badge";
import {Popover, PopoverContent, PopoverTrigger} from "./ui/popover";
import {useState} from "react";

interface BottomNavigationProps {
    currentView: string;
    onNavigate: (view: string) => void;
    alertCount: number;
}

export function BottomNavigation({currentView, onNavigate, alertCount}: BottomNavigationProps) {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        {id: "home", label: "Home", icon: Home},
        {id: "farms", label: "Farms", icon: MapPin},
        {id: "sensors", label: "Sensors", icon: Wifi},
        {id: "alerts", label: "Alerts", icon: Bell, badge: alertCount},
        {id: "harvest", label: "Harvest", icon: Droplet},
        {id: "profile", label: "Profile", icon: User},
    ];

    // Show the first 4 items on mobile, all items on larger screens
    const visibleItems = navItems.slice(0, 4);
    const overflowItems = navItems.slice(4);

    const handleNavigate = (viewId: string) => {
        onNavigate(viewId);
        setIsOpen(false);
    };

    const renderNavButton = (item: typeof navItems[0], compact: boolean = false) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;

        return (
            <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`flex items-center justify-center py-3 transition-colors ${
                    compact 
                        ? "w-full text-left flex-row gap-3 px-3 hover:bg-gray-100 rounded-md" 
                        : "flex-col px-1 min-w-0 flex-1"
                } ${
                    isActive
                        ? "text-amber-500"
                        : "text-muted-foreground hover:text-foreground"
                }`}
            >
                <div className="relative flex-shrink-0">
                    <Icon className={compact ? "h-5 w-5" : "h-6 w-6"} />
                    {item.badge !== undefined && item.badge > 0 && (
                        <Badge className="absolute -top-2 -right-2 h5 w5 p0 flex items-center justify-center bg-red-500">
                            {item.badge > 9 ? "9+" : item.badge}
                        </Badge>
                    )}
                </div>
                <span className={`${compact ? "text-sm" : "text-[10px] mt-1 truncate"} max-w-full`}>{item.label}</span>
            </button>
        );
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-50">
            <div className="max-w-lg mx-auto">
                {/* Visible items on mobile (4 items + More buttons) */}
                <div className="flex flex-nowrap items-center justify-around md:hidden">
                    {visibleItems.map((item) => renderNavButton(item))}

                    {/* More button for overflow items on mobile */}
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                            <button
                                className="flex flex-col items-center justify-center py-3 px-1 transition-colors text-muted-foreground hover:text-foreground min-w-0 flex-1"
                            >
                                <MoreHorizontal className="h-6 w-6 flex-shrink-0" />
                                <span className="text-[10px] mt-1 truncate max-w-full">More</span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-48 p-2 mb-2"
                            side="top"
                            align="end"
                        >
                            <div className="flex flex-col gap-1">
                                {overflowItems.map((item) => renderNavButton(item, true))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    );
}
