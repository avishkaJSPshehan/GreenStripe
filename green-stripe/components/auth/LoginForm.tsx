"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

export function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Connect with Supabase authentication in the future
        console.log("Login attempt:", { username, password });
    };

    return (
        <div className="w-full max-w-[420px] p-8 sm:p-10 bg-white/95 backdrop-blur-[10px] rounded-[20px] shadow-[0_15px_35px_rgba(0,0,0,0.05),_0_5px_15px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),_0_8px_20px_rgba(0,0,0,0.04)]">
            <div className="flex justify-center items-center w-[60px] h-[60px] bg-[#e8f5e9] rounded-full mx-auto mb-6 shadow-[0_4px_10px_rgba(76,175,80,0.2)]">
                {/* Leaf Icon representing 'GreenStripe' */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-8 h-8 text-[#4caf50]"
                >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-[1.75rem] font-bold text-[#1b5e20] tracking-tight mb-2">GreenStripe</h1>
                <p className="text-[#666] text-[0.95rem]">Welcome back, please log in to continue.</p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
                <div className="flex flex-col gap-2 text-left">
                    <Label htmlFor="username">Username or Email</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full"
                    />
                </div>

                <div className="flex flex-col gap-2 text-left">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full"
                    />
                </div>

                <Button type="submit" className="w-full mt-2 text-[1.05rem]">
                    Sign In
                </Button>
            </form>
        </div>
    );
}
