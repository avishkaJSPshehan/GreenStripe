"use client";

import { useEffect, useState } from "react";
import { userService } from "../../../modules/user/userService";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        userService.getProfile("1").then(setUser);
    }, []);

    if (!user) return <div className="p-8">Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-[#f1f8f4] p-8 font-sans">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-[#1b5e20]">GreenStripe Dashboard</h1>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4caf50] rounded-full flex items-center justify-center text-white font-bold">
                        {user.name[0]}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e0e0e0]">
                    <h2 className="font-semibold text-slate-800 mb-2">Activities</h2>
                    <p className="text-slate-600">Your recent environmental impacts.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e0e0e0]">
                    <h2 className="font-semibold text-slate-800 mb-2">Projects</h2>
                    <p className="text-slate-600">Overview of your green initiatives.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e0e0e0]">
                    <h2 className="font-semibold text-slate-800 mb-2">Rewards</h2>
                    <p className="text-slate-600">Claim your environmental credits.</p>
                </div>
            </main>
        </div>
    );
}
