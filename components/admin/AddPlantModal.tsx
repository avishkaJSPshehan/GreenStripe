"use client";

import { useState, useEffect } from "react";
import { X, Plus, Loader2, Tag, Sprout, Activity, Calendar, Scale, CircleDollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface AddPlantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    plantToEdit?: any; // Added to support editing
}

export function AddPlantModal({ isOpen, onClose, onSuccess, plantToEdit }: AddPlantModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        tag_id: "",
        species: "",
        health_status: "Good",
        growth_stage: "Seedling",
        planting_date: new Date().toISOString().split('T')[0],
        harvest_date: "",
        est_yield: "",
        cost: "",
        revenue: "0",
        // Growth log details
        height_cm: "",
        leaves_count: "",
        fruits_count: "",
    });

    // Initialize form when editing
    useEffect(() => {
        if (plantToEdit && isOpen) {
            setFormData({
                tag_id: plantToEdit.tag_id || "",
                species: plantToEdit.species || "",
                health_status: plantToEdit.health_status || "Good",
                growth_stage: plantToEdit.growth_stage || "Seedling",
                planting_date: plantToEdit.planting_date || new Date().toISOString().split('T')[0],
                harvest_date: plantToEdit.harvest_date || "",
                est_yield: plantToEdit.est_yield?.toString() || "",
                cost: plantToEdit.cost?.toString() || "",
                revenue: plantToEdit.revenue?.toString() || "0",
                height_cm: "",
                leaves_count: "",
                fruits_count: "",
            });
        } else if (!plantToEdit && isOpen) {
            setFormData({
                tag_id: "",
                species: "",
                health_status: "Good",
                growth_stage: "Seedling",
                planting_date: new Date().toISOString().split('T')[0],
                harvest_date: "",
                est_yield: "",
                cost: "",
                revenue: "0",
                height_cm: "",
                leaves_count: "",
                fruits_count: "",
            });
        }
    }, [plantToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (plantToEdit) {
                // Update existing plant
                const { error } = await supabase
                    .from("plants")
                    .update({
                        tag_id: formData.tag_id,
                        species: formData.species,
                        health_status: formData.health_status,
                        growth_stage: formData.growth_stage,
                        planting_date: formData.planting_date,
                        harvest_date: formData.harvest_date,
                        est_yield: parseFloat(formData.est_yield),
                        cost: parseFloat(formData.cost),
                        revenue: parseFloat(formData.revenue),
                    })
                    .eq('id', plantToEdit.id);

                if (error) throw error;
            } else {
                // Insert new plant
                const { data: plantData, error: plantError } = await supabase.from("plants").insert([
                    {
                        tag_id: formData.tag_id,
                        species: formData.species,
                        health_status: formData.health_status,
                        growth_stage: formData.growth_stage,
                        planting_date: formData.planting_date,
                        harvest_date: formData.harvest_date,
                        est_yield: parseFloat(formData.est_yield),
                        cost: parseFloat(formData.cost),
                        revenue: parseFloat(formData.revenue),
                    },
                ]).select();

                if (plantError) throw plantError;

                // If growth data is provided, insert a growth log
                if (plantData && (formData.height_cm || formData.leaves_count || formData.fruits_count)) {
                    const { error: logError } = await supabase.from("growth_logs").insert([
                        {
                            plant_id: plantData[0].id,
                            date: formData.planting_date,
                            height_cm: parseFloat(formData.height_cm) || 0,
                            leaves_count: parseInt(formData.leaves_count) || 0,
                            fruits_count: parseInt(formData.fruits_count) || 0,
                        }
                    ]);
                    if (logError) console.error("Error adding initial growth log:", logError);
                }
            }

            onSuccess();
            onClose();
            setFormData({
                tag_id: "",
                species: "",
                health_status: "Good",
                growth_stage: "Seedling",
                planting_date: new Date().toISOString().split('T')[0],
                harvest_date: "",
                est_yield: "",
                cost: "",
                revenue: "0",
                height_cm: "",
                leaves_count: "",
                fruits_count: "",
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
        <div
            className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto cursor-pointer"
            onClick={onClose}
        >
            <div
                className="bg-[#f8f9fa] w-full max-w-5xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8 cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#10B981]/10 rounded-2xl flex items-center justify-center">
                            <Plus className="w-7 h-7 text-[#10B981]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-gray-900">
                                {plantToEdit ? "Update Plant Details" : "Add New Plant"}
                            </h2>
                            <p className="text-sm text-gray-500 font-medium">
                                {plantToEdit ? `Modifying plant ${plantToEdit.tag_id}` : "Record a new addition to your collection."}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Details & Financials */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-gray-50 pb-4 mb-2">
                                    Details
                                </h3>

                                {/* Tag ID & Species */}
                                <div className="grid grid-cols-2 gap-4">
                                    <FormItem
                                        icon={<Tag className="w-4 h-4 text-emerald-500" />}
                                        label="Tag ID"
                                        required
                                    >
                                        <input
                                            required
                                            type="text"
                                            name="tag_id"
                                            value={formData.tag_id}
                                            onChange={handleChange}
                                            placeholder="PLT-001"
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#10B981]/10 transition-all placeholder:text-gray-300"
                                        />
                                    </FormItem>
                                    <FormItem
                                        icon={<Sprout className="w-4 h-4 text-emerald-500" />}
                                        label="Species"
                                        required
                                    >
                                        <input
                                            required
                                            type="text"
                                            name="species"
                                            value={formData.species}
                                            onChange={handleChange}
                                            placeholder="e.g. Tomato"
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#10B981]/10 transition-all placeholder:text-gray-300"
                                        />
                                    </FormItem>
                                </div>

                                <FormItem icon={<Activity className="w-4 h-4 text-[#10B981]" />} label="Current Stage">
                                    <select
                                        name="growth_stage"
                                        value={formData.growth_stage}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#10B981]/10 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Seedling">Seedling</option>
                                        <option value="Growing">Growing</option>
                                        <option value="Flowering">Flowering</option>
                                        <option value="Fruiting">Fruiting</option>
                                        <option value="Harvested">Harvested</option>
                                    </select>
                                </FormItem>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormItem icon={<Calendar className="w-4 h-4 text-blue-500" />} label="Planting Date" required>
                                        <input
                                            required
                                            type="date"
                                            name="planting_date"
                                            value={formData.planting_date}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#10B981]/10 transition-all cursor-pointer"
                                        />
                                    </FormItem>
                                    <FormItem icon={<Calendar className="w-4 h-4 text-orange-500" />} label="Exp. Harvest" required>
                                        <input
                                            required
                                            type="date"
                                            name="harvest_date"
                                            value={formData.harvest_date}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#10B981]/10 transition-all cursor-pointer"
                                        />
                                    </FormItem>
                                </div>

                                <FormItem icon={<Scale className="w-4 h-4 text-purple-500" />} label="Est. Yield (kg)" required>
                                    <input
                                        required
                                        type="number"
                                        step="0.1"
                                        name="est_yield"
                                        value={formData.est_yield}
                                        onChange={handleChange}
                                        placeholder="0.0"
                                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#10B981]/10 transition-all placeholder:text-gray-300"
                                    />
                                </FormItem>
                            </div>

                            {/* Financials Section */}
                            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-gray-50 pb-4 mb-2">
                                    Financials
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormItem icon={<CircleDollarSign className="w-4 h-4 text-gray-400" />} label="Total Cost (Rs.)" required>
                                        <input
                                            required
                                            type="number"
                                            name="cost"
                                            value={formData.cost}
                                            onChange={handleChange}
                                            placeholder="0"
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#10B981]/10 transition-all placeholder:text-gray-300"
                                        />
                                    </FormItem>
                                    <FormItem icon={<CircleDollarSign className="w-4 h-4 text-emerald-500" />} label="Revenue (Rs.)">
                                        <input
                                            type="number"
                                            name="revenue"
                                            value={formData.revenue}
                                            onChange={handleChange}
                                            placeholder="0"
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#10B981]/10 transition-all placeholder:text-gray-300"
                                        />
                                    </FormItem>
                                </div>
                                <div className={cn(
                                    "p-4 rounded-2xl flex justify-between items-center",
                                    (parseFloat(formData.revenue || "0") - parseFloat(formData.cost || "0")) >= 0 ? "bg-green-50/50" : "bg-red-50/50"
                                )}>
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-7 h-7 rounded-lg flex items-center justify-center",
                                            (parseFloat(formData.revenue || "0") - parseFloat(formData.cost || "0")) >= 0 ? "bg-green-100/50 text-green-600" : "bg-red-100/50 text-red-600"
                                        )}>
                                            <CircleDollarSign className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500">Est. Profit/Loss</span>
                                    </div>
                                    <span className={cn(
                                        "text-lg font-black",
                                        (parseFloat(formData.revenue || "0") - parseFloat(formData.cost || "0")) >= 0 ? "text-green-600" : "text-red-600"
                                    )}>
                                        Rs. {(parseFloat(formData.revenue || "0") - parseFloat(formData.cost || "0")).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Growth Logs & Measurements */}
                        <div className="lg:col-span-7 space-y-8">
                            <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 h-full flex flex-col">
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-gray-50 pb-4 mb-6">
                                    Initial measurements
                                </h3>

                                <div className="space-y-8 flex-1">
                                    <div className="p-8 rounded-[24px] bg-[#f8f9fa] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-2">
                                            <Scale className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900">Record Initial Growth</p>
                                            <p className="text-xs text-gray-500 font-medium">Capture the current state of the seedling.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <FormItem label="Height (cm)">
                                            <input
                                                type="number"
                                                step="0.1"
                                                name="height_cm"
                                                value={formData.height_cm}
                                                onChange={handleChange}
                                                placeholder="0.0"
                                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#10B981]/10 transition-all placeholder:text-gray-300"
                                            />
                                        </FormItem>
                                        <FormItem label="Leaves">
                                            <input
                                                type="number"
                                                name="leaves_count"
                                                value={formData.leaves_count}
                                                onChange={handleChange}
                                                placeholder="0"
                                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#10B981]/10 transition-all placeholder:text-gray-300"
                                            />
                                        </FormItem>
                                        <FormItem label="Fruits">
                                            <input
                                                type="number"
                                                name="fruits_count"
                                                value={formData.fruits_count}
                                                onChange={handleChange}
                                                placeholder="0"
                                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#10B981]/10 transition-all placeholder:text-gray-300"
                                            />
                                        </FormItem>
                                    </div>

                                    <FormItem icon={<Activity className="w-4 h-4 text-emerald-500" />} label="Health Status">
                                        <div className="grid grid-cols-4 gap-2">
                                            {["Good", "Medium", "Weak", "Critical"].map((status) => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, health_status: status }))}
                                                    className={cn(
                                                        "py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2",
                                                        formData.health_status === status
                                                            ? "bg-[#10B981] text-white border-[#10B981] shadow-lg shadow-[#10B981]/20"
                                                            : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"
                                                    )}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </FormItem>
                                </div>

                                <div className="mt-8 flex items-center gap-4 pt-6 border-t border-gray-50">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-8 py-4 bg-white border border-gray-200 text-gray-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] flex items-center justify-center gap-3 px-8 py-4 bg-[#10B981] text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[#0da672] transition-all shadow-xl shadow-[#10B981]/25 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            plantToEdit ? "Update Plant" : "Confirm & Save Plant"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

function FormItem({ icon, label, children, required }: { icon?: React.ReactNode, label: string, children: React.ReactNode, required?: boolean }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                {icon}
                {label}
                {required && <span className="text-red-400">*</span>}
            </label>
            {children}
        </div>
    );
}

