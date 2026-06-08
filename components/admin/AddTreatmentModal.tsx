"use client";

import { useState } from "react";
import { X, Plus, Loader2, Calendar, Tag, Activity, CircleDollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface AddTreatmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    plant: any;
}

export function AddTreatmentModal({ isOpen, onClose, onSuccess, plant }: AddTreatmentModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        type: "Fertilizer",
        name: "",
        quantity: "",
        cost: "",
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const treatmentCost = parseFloat(formData.cost) || 0;
            
            const { error } = await supabase.from("treatments").insert([
                {
                    plant_id: plant.id,
                    date: formData.date,
                    type: formData.type,
                    name: formData.name,
                    quantity: formData.quantity,
                    cost: treatmentCost,
                },
            ]);

            if (error) throw error;

            // Update plant's total cost
            if (treatmentCost > 0) {
                const { error: updateError } = await supabase
                    .from("plants")
                    .update({ cost: (plant.cost || 0) + treatmentCost })
                    .eq('id', plant.id);
                
                if (updateError) console.error("Error updating plant cost:", updateError);
            }

            onSuccess();
            onClose();
            setFormData({
                date: new Date().toISOString().split('T')[0],
                type: "Fertilizer",
                name: "",
                quantity: "",
                cost: "",
            });
        } catch (error) {
            console.error("Error adding treatment:", error);
            alert("Error adding treatment. Please try again.");
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
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto cursor-pointer"
            onClick={onClose}
        >
            <div
                className="bg-[#f8f9fa] w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#10B981]/10 rounded-xl flex items-center justify-center">
                            <Plus className="w-6 h-6 text-[#10B981]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tight text-gray-900">Add Treatment</h2>
                            <p className="text-xs text-gray-500 font-medium">Record a new treatment for this plant.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormItem icon={<Calendar className="w-3.5 h-3.5 text-blue-500" />} label="Date" required>
                            <input
                                required
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#10B981]/10 transition-all cursor-pointer"
                            />
                        </FormItem>
                        <FormItem icon={<Activity className="w-3.5 h-3.5 text-[#10B981]" />} label="Type" required>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#10B981]/10 transition-all appearance-none cursor-pointer"
                            >
                                <option value="Fertilizer">Fertilizer</option>
                                <option value="Medicine">Medicine</option>
                                <option value="Other">Other</option>
                            </select>
                        </FormItem>
                    </div>

                    <FormItem icon={<Tag className="w-3.5 h-3.5 text-emerald-500" />} label="Treatment Name" required>
                        <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. NPK 20-20-20"
                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#10B981]/10 transition-all placeholder:text-gray-300"
                        />
                    </FormItem>

                    <div className="grid grid-cols-2 gap-4">
                        <FormItem icon={<Activity className="w-3.5 h-3.5 text-purple-500" />} label="Quantity" required>
                            <input
                                required
                                type="text"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="e.g. 50g"
                                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#10B981]/10 transition-all placeholder:text-gray-300"
                            />
                        </FormItem>
                        <FormItem icon={<CircleDollarSign className="w-3.5 h-3.5 text-orange-500" />} label="Cost (Rs.)" required>
                            <input
                                required
                                type="number"
                                name="cost"
                                value={formData.cost}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#10B981]/10 transition-all placeholder:text-gray-300"
                            />
                        </FormItem>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 bg-[#10B981] text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[#0da672] transition-all shadow-lg shadow-[#10B981]/20 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Treatment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function FormItem({ icon, label, children, required }: { icon?: React.ReactNode, label: string, children: React.ReactNode, required?: boolean }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                {icon}
                {label}
                {required && <span className="text-red-400">*</span>}
            </label>
            {children}
        </div>
    );
}
