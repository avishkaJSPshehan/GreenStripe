"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../../../modules/auth/authService";
import { Button } from "../../../components/ui/Button";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const { session } = await authService.getSession();

            if (!session) {
                router.replace("/auth/login");
                return;
            }

            // Redirect to the new admin dashboard
            router.replace("/admin");
        };

        fetchUserData();
    }, [router]);

    const handleLogout = async () => {
        await authService.logout();
        router.push("/auth/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f1f8f4]">
                <div className="w-12 h-12 border-4 border-[#4caf50] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f8f4] p-8 font-sans transition-all">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-green-200">
                <div>
                    <h1 className="text-3xl font-bold text-[#1b5e20] mb-1">GreenStripe</h1>
                    <p className="text-slate-600">Personal Impact Dashboard</p>
                </div>

                <div className="flex items-center gap-6 self-end md:self-auto">
                    <div className="flex items-center gap-3 text-right">
                        <div>
                            <p className="text-sm font-bold text-slate-800">
                                {profile?.username || user?.email?.split('@')[0]}
                            </p>
                            <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-[#4caf50] to-[#2e7d32] rounded-full flex items-center justify-center text-white font-bold shadow-md">
                            {(profile?.username || user?.email)?.[0].toUpperCase()}
                        </div>
                    </div>

                    <Button
                        onClick={handleLogout}
                        variant="danger"
                        className="px-4 py-2 text-sm"
                    >
                        Sign Out
                    </Button>

                </div>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4 text-[#4caf50]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h2 className="font-bold text-slate-800 text-lg mb-2">My Activities</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">Track your daily environmental contributions and carbon foot-print reductions.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4 text-[#4caf50]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </div>
                    <h2 className="font-bold text-slate-800 text-lg mb-2">Global Projects</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">Join community-driven initiatives near you and see global progress in real-time.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4 text-[#4caf50]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h2 className="font-bold text-slate-800 text-lg mb-2">Rewards</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">Redeem your effort points for eco-friendly products and partner discounts.</p>
                </div>
            </main>
        </div>
    );
}
