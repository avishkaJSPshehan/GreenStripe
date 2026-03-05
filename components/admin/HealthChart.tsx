"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "@/lib/supabase";

const COLORS = {
    Critical: "#EF4444",
    Good: "#10B981",
    Medium: "#F59E0B",
    Weak: "#F97316",
};

export function HealthChart() {
    const [data, setData] = useState([
        { name: "Critical", value: 0, color: COLORS.Critical },
        { name: "Good", value: 0, color: COLORS.Good },
        { name: "Medium", value: 0, color: COLORS.Medium },
        { name: "Weak", value: 0, color: COLORS.Weak },
    ]);

    useEffect(() => {
        async function fetchHealthStats() {
            const { data: plants } = await supabase.from('plants').select('health_status');

            const counts = (plants || []).reduce((acc: any, plant: any) => {
                acc[plant.health_status] = (acc[plant.health_status] || 0) + 1;
                return acc;
            }, {});

            setData([
                { name: "Critical", value: counts.Critical || 0, color: COLORS.Critical },
                { name: "Good", value: counts.Good || 0, color: COLORS.Good },
                { name: "Medium", value: counts.Medium || 0, color: COLORS.Medium },
                { name: "Weak", value: counts.Weak || 0, color: COLORS.Weak },
            ]);
        }

        fetchHealthStats();
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[400px]">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Plant Health Distribution</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {data.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-sm font-medium text-gray-600">
                            {entry.name} ({entry.value})
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
