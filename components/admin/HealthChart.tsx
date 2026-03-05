"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
    { name: "Critical", value: 252, color: "#EF4444" }, // Red
    { name: "Good", value: 500, color: "#10B981" },   // Green
    { name: "Medium", value: 300, color: "#F59E0B" }, // Amber
    { name: "Weak", value: 150, color: "#F97316" },   // Orange
];

export function HealthChart() {
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
                        <span className="text-sm font-medium text-gray-600">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
