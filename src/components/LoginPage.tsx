import React, {useState} from "react";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card";
import {Hexagon} from "lucide-react";

interface LoginPageProps {
    onLogin: (username: string) => void;
}

export function LoginPage({onLogin}: LoginPageProps) {
    const [username, setUsername] = useState("beekeeper");
    const [password, setPassword] = useState("apiculture");
    const [error, setError] = useState("");

    // Dummy account credentials
    const DUMMY_USERNAME = "beekeeper";
    const DUMMY_PASSWORD = "apiculture";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate credentials against dummy account
        if (username === DUMMY_USERNAME && password === DUMMY_PASSWORD) {
            onLogin(username);
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-amber-500 p-4 rounded-full">
                            <Hexagon className="h-12 w-12 text-white"/>
                        </div>
                    </div>
                    <CardTitle>BeeKeeper Portal</CardTitle>
                    <CardDescription>Login to manage your apiaries</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="beekeeper"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}
                        <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
