"use client";

import { useEffect, useState } from "react";
import { Sprout, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { HealthChart } from "@/components/admin/HealthChart";
import { InvestmentChart } from "@/components/admin/InvestmentChart";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalPlants: 0,
        netProfit: 0,
        estimatedRevenue: 0,
        criticalStatus: 0
    });

    useEffect(() => {
        async function fetchDashboardData() {
            // 1. Fetch Total Plants
            const { count: plantCount } = await supabase
                .from('plants')
                .select('*', { count: 'exact', head: true });

            // 2. Fetch Critical Status Plants
            const { count: criticalCount } = await supabase
                .from('plants')
                .select('*', { count: 'exact', head: true })
                .eq('health_status', 'Critical');

            // 3. Fetch Financials (Revenue - Investment)
            const { data: finances } = await supabase
                .from('finances')
                .select('amount, type');

            const revenue = finances
                ?.filter(f => f.type === 'revenue')
                .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

            const investment = finances
                ?.filter(f => f.type === 'investment')
                .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

            setStats({
                totalPlants: plantCount || 0,
                netProfit: revenue - investment,
                estimatedRevenue: revenue,
                criticalStatus: criticalCount || 0
            });
        }

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back to your farm management command center.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Plants"
                    value={stats.totalPlants}
                    trend="+5%"
                    icon={Sprout}
                    iconBgColor="bg-green-50"
                    iconColor="text-green-600"
                />
                <StatCard
                    title="Net Profit"
                    value={`Rs. ${stats.netProfit.toLocaleString()}`}
                    trend="+12%"
                    icon={DollarSign}
                    iconBgColor="bg-blue-50"
                    iconColor="text-blue-600"
                />
                <StatCard
                    title="Estimated Revenue"
                    value={`Rs. ${stats.estimatedRevenue.toLocaleString()}`}
                    trend="+7%"
                    icon={TrendingUp}
                    iconBgColor="bg-emerald-50"
                    iconColor="text-emerald-600"
                />
                <StatCard
                    title="Critical Status"
                    value={stats.criticalStatus}
                    trend="-2%"
                    trendType="negative"
                    icon={AlertCircle}
                    iconBgColor="bg-red-50"
                    iconColor="text-red-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <HealthChart />
                <InvestmentChart />
            </div>
        </div>
    );
}
