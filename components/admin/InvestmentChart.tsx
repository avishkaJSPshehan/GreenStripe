"use client";

import { useEffect, useState } from "react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import { supabase } from "@/lib/supabase";

export function InvestmentChart() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        async function fetchFinancialStats() {
            const { data: finances } = await supabase
                .from('finances')
                .select('amount, date, type')
                .eq('type', 'investment')
                .order('date', { ascending: true });

            const monthlyData = (finances || []).reduce((acc: any, item: any) => {
                const date = new Date(item.date);
                const month = date.toLocaleString('default', { month: 'short' });

                const existing = acc.find((d: any) => d.month === month);
                if (existing) {
                    existing.cost += Number(item.amount);
                } else {
                    acc.push({ month, cost: Number(item.amount) });
                }
                return acc;
            }, []);

            setData(monthlyData);
        }

        fetchFinancialStats();
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[400px]">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Investment Over Time</h3>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            tickFormatter={(value) => `Rs. ${value}`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="cost"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorCost)"
                            dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
