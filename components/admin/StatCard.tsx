import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    trend?: string;
    trendType?: "positive" | "negative";
    icon: LucideIcon;
    iconBgColor?: string;
    iconColor?: string;
}

export function StatCard({
    title,
    value,
    trend,
    trendType = "positive",
    icon: Icon,
    iconBgColor = "bg-green-50",
    iconColor = "text-green-600"
}: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                </div>
                <div className={cn("p-2.5 rounded-xl", iconBgColor)}>
                    <Icon className={cn("w-5 h-5", iconColor)} />
                </div>
            </div>

            {trend && (
                <div className="flex items-center gap-1.5">
                    <span className={cn(
                        "text-sm font-bold",
                        trendType === "positive" ? "text-green-500" : "text-red-500"
                    )}>
                        {trend}
                    </span>
                    <span className="text-gray-400 text-xs">from last month</span>
                </div>
            )}
        </div>
    );
}
