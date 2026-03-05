"use client";

import { Calendar, Scale, CircleDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Plant {
    id: string;
    tag_id: string;
    species: string;
    health_status: "Critical" | "Good" | "Medium" | "Weak";
    growth_stage: "Seedling" | "Growing" | "Flowering" | "Fruiting" | "Harvested";
    harvest_date: string;
    est_yield: number;
    cost: number;
}

interface PlantCardProps {
    plant: Plant;
    onClick: (plant: Plant) => void;
}

export function PlantCard({ plant, onClick }: PlantCardProps) {
    const healthColors = {
        Good: "bg-green-100 text-green-700",
        Medium: "bg-amber-100 text-amber-700",
        Weak: "bg-orange-100 text-orange-700",
        Critical: "bg-red-100 text-red-700",
    };

    const stageColors = {
        Seedling: "bg-blue-50 text-blue-600",
        Growing: "bg-emerald-50 text-emerald-600",
        Flowering: "bg-purple-50 text-purple-600",
        Fruiting: "bg-orange-50 text-orange-600",
        Harvested: "bg-gray-100 text-gray-600",
    };

    return (
        <div
            onClick={() => onClick(plant)}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">{plant.tag_id}</h3>
                    <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase", healthColors[plant.health_status])}>
                        {plant.health_status}
                    </span>
                </div>
                <span className={cn("px-3 py-1 rounded-lg text-xs font-semibold", stageColors[plant.growth_stage])}>
                    {plant.growth_stage}
                </span>
            </div>

            <p className="text-gray-500 text-sm font-medium mb-6">{plant.species}</p>

            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Harvest</span>
                    </div>
                    <span className="font-bold text-gray-900">{plant.harvest_date}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Scale className="w-4 h-4" />
                        <span>Est. Yield</span>
                    </div>
                    <span className="font-bold text-gray-900">{plant.est_yield} kg</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                        <CircleDollarSign className="w-4 h-4" />
                        <span>Cost</span>
                    </div>
                    <span className="font-bold text-gray-900">Rs. {plant.cost.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
