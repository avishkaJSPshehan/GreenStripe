"use client";

import { useState } from "react";
import { X, Plus, Loader2, Tag, Sprout, Activity, Calendar, Scale, CircleDollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface AddPlantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddPlantModal({ isOpen, onClose, onSuccess }: AddPlantModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        tag_id: "",
        species: "",
        health_status: "Good",
        growth_stage: "Seedling",
        harvest_date: "",
        est_yield: "",
        cost: "",
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from("plants").insert([
                {
                    tag_id: formData.tag_id,
                    species: formData.species,
                    health_status: formData.health_status,
                    growth_stage: formData.growth_stage,
                    harvest_date: formData.harvest_date,
                    est_yield: parseFloat(formData.est_yield),
                    cost: parseFloat(formData.cost),
                },
            ]);

            if (error) throw error;

            onSuccess();
            onClose();
            setFormData({
                tag_id: "",
                species: "",
                health_status: "Good",
                growth_stage: "Seedling",
                harvest_date: "",
                est_yield: "",
                cost: "",
            });
        } catch (error) {
            console.error("Error adding plant:", error);
            alert("Error adding plant. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#10B981]/10 rounded-xl flex items-center justify-center">
                            <Plus className="w-6 h-6 text-[#10B981]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Add New Plant</h2>
                            <p className="text-sm text-gray-500 font-medium">Enter the details of the new plant.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tag ID */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Tag className="w-3.5 h-3.5" />
                                Tag ID
                            </label>
                            <input
                                required
                                type="text"
                                name="tag_id"
                                value={formData.tag_id}
                                onChange={handleChange}
                                placeholder="e.g. PLT-001"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all font-medium text-black placeholder:text-gray-400"
                            />
                        </div>

                        {/* Species */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Sprout className="w-3.5 h-3.5" />
                                Species
                            </label>
                            <input
                                required
                                type="text"
                                name="species"
                                value={formData.species}
                                onChange={handleChange}
                                placeholder="e.g. Tomato"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all font-medium text-black placeholder:text-gray-400"
                            />
                        </div>

                        {/* Health Status */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5" />
                                Health Status
                            </label>
                            <select
                                name="health_status"
                                value={formData.health_status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all font-medium appearance-none cursor-pointer text-black"
                            >
                                <option value="Good">Good</option>
                                <option value="Medium">Medium</option>
                                <option value="Weak">Weak</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>

                        {/* Growth Stage */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5" />
                                Growth Stage
                            </label>
                            <select
                                name="growth_stage"
                                value={formData.growth_stage}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all font-medium appearance-none cursor-pointer text-black"
                            >
                                <option value="Seedling">Seedling</option>
                                <option value="Growing">Growing</option>
                                <option value="Flowering">Flowering</option>
                                <option value="Fruiting">Fruiting</option>
                                <option value="Harvested">Harvested</option>
                            </select>
                        </div>

                        {/* Harvest Date */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" />
                                Estimated Harvest Date
                            </label>
                            <input
                                required
                                type="date"
                                name="harvest_date"
                                value={formData.harvest_date}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all font-medium cursor-pointer text-black"
                            />
                        </div>

                        {/* Estimated Yield */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Scale className="w-3.5 h-3.5" />
                                Estimated Yield (kg)
                            </label>
                            <input
                                required
                                type="number"
                                step="0.1"
                                name="est_yield"
                                value={formData.est_yield}
                                onChange={handleChange}
                                placeholder="0.0"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all font-medium text-black placeholder:text-gray-400"
                            />
                        </div>

                        {/* Cost */}
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <CircleDollarSign className="w-3.5 h-3.5" />
                                Cost (LKR)
                            </label>
                            <input
                                required
                                type="number"
                                name="cost"
                                value={formData.cost}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all font-medium text-black placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 bg-[#10B981] text-white font-bold rounded-xl hover:bg-[#0da672] transition-all shadow-lg shadow-[#10B981]/20 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Plant"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
