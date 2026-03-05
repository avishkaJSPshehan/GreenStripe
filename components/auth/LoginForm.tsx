"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

import { authService } from "../../modules/auth/authService";
import { useRouter } from "next/navigation";

export function LoginForm() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        try {
            if (isSignUp) {
                const { user, error } = await authService.signUp({ email, password, username });
                if (error) {
                    setErrorMsg(error);
                } else if (user) {
                    alert("Account created! Check your email for confirmation.");
                    setIsSignUp(false);
                }
            } else {
                const { user, error } = await authService.login({ email, password });
                if (user) {
                    router.push("/admin");
                } else {
                    setErrorMsg(error || "Invalid login credentials");
                }
            }
        } catch (err: any) {
            setErrorMsg(err.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[420px] p-8 sm:p-10 bg-white/95 backdrop-blur-[10px] rounded-[20px] shadow-[0_15px_35px_rgba(0,0,0,0.05)] transition-all duration-300">
            <div className="flex justify-center items-center w-[60px] h-[60px] bg-[#e8f5e9] rounded-full mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-[#4caf50]">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-[1.75rem] font-bold text-[#1b5e20] mb-2">GreenStripe</h1>
                <p className="text-[#666] text-[0.95rem]">{isSignUp ? "Create an account" : "Sign in to continue"}</p>
            </div>

            {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">
                    {errorMsg}
                </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {isSignUp && (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Your display name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col gap-2">
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

                <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                    {isLoading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-[#4caf50] hover:underline text-sm font-medium"
                >
                    {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
            </div>
        </div>
    );
}
