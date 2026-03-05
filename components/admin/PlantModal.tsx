"use client";

import { X, Calendar, Scale, CircleDollarSign, Tag, Sprout, Activity } from "lucide-react";
import { Plant } from "./PlantCard";
import { cn } from "@/lib/utils";

interface PlantModalProps {
    plant: Plant | null;
    isOpen: boolean;
    onClose: () => void;
}

export function PlantModal({ plant, isOpen, onClose }: PlantModalProps) {
    if (!isOpen || !plant) return null;

    const healthColors = {
        Good: "text-green-600 bg-green-50",
        Medium: "text-amber-600 bg-amber-50",
        Weak: "text-orange-600 bg-orange-50",
        Critical: "text-red-600 bg-red-50",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                            <Sprout className="w-6 h-6 text-[#10B981]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{plant.tag_id}</h2>
                            <p className="text-sm text-gray-500 font-medium">Plant Details</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Species</p>
                            <div className="flex items-center gap-2 font-semibold text-gray-900">
                                <Tag className="w-4 h-4 text-gray-400" />
                                {plant.species}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Health Status</p>
                            <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold", healthColors[plant.health_status])}>
                                <Activity className="w-3.5 h-3.5" />
                                {plant.health_status}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500">Harvest Date</p>
                            <div className="flex items-center gap-2 font-bold text-gray-900">
                                <Calendar className="w-4 h-4 text-[#10B981]" />
                                {plant.harvest_date}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500">Growth Stage</p>
                            <div className="font-bold text-[#10B981]">{plant.growth_stage}</div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500">Estimated Yield</p>
                            <div className="flex items-center gap-2 font-bold text-gray-900">
                                <Scale className="w-4 h-4 text-[#10B981]" />
                                {plant.est_yield} kg
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500">Cost (LKR)</p>
                            <div className="flex items-center gap-2 font-bold text-gray-900">
                                <CircleDollarSign className="w-4 h-4 text-[#10B981]" />
                                Rs. {plant.cost.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
