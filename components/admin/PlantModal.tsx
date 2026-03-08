"use client";

import { useEffect, useState } from "react";
import { X, Calendar, Scale, CircleDollarSign, Tag, Sprout, Activity, Trash2, Edit3, Plus, ArrowUpRight, TrendingDown, Loader2 } from "lucide-react";
import { Plant, GrowthLog, Treatment, Disease } from "./PlantCard";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface PlantModalProps {
    plant: Plant | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (plant: Plant) => void;
    onDeleteSuccess?: () => void;
}

export function PlantModal({ plant, isOpen, onClose, onEdit, onDeleteSuccess }: PlantModalProps) {
    const [growthLogs, setGrowthLogs] = useState<GrowthLog[]>([]);
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [diseases, setDiseases] = useState<Disease[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (isOpen && plant) {
            fetchChildData();
        }
    }, [isOpen, plant]);

    const fetchChildData = async () => {
        if (!plant) return;
        setLoading(true);

        try {
            const [logsRes, treatmentsRes, diseasesRes] = await Promise.all([
                supabase.from('growth_logs').select('*').eq('plant_id', plant.id).order('date', { ascending: false }),
                supabase.from('treatments').select('*').eq('plant_id', plant.id).order('date', { ascending: false }),
                supabase.from('diseases').select('*').eq('plant_id', plant.id).order('date', { ascending: false })
            ]);

            setGrowthLogs(logsRes.data || []);
            setTreatments(treatmentsRes.data || []);
            setDiseases(diseasesRes.data || []);
        } catch (error) {
            console.error("Error fetching plant child data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!plant) return;

        const confirmDelete = confirm(`Are you sure you want to delete plant ${plant.tag_id}?`);
        if (!confirmDelete) return;

        setIsDeleting(true);

        try {
            // 1. Cleanup related records
            await supabase.from('growth_logs').delete().eq('plant_id', plant.id);
            await supabase.from('treatments').delete().eq('plant_id', plant.id);
            await supabase.from('diseases').delete().eq('plant_id', plant.id);

            // 2. Delete the plant record
            // We use .select() because 'count' often returns 0 when RLS is enabled
            // If the row is deleted and returned, we know it worked.
            const { data: idDeleted, error: idError } = await supabase
                .from('plants')
                .delete()
                .eq('id', plant.id)
                .select();

            if (idError) throw idError;

            // 3. Fallback to tag_id if ID delete didn't return data
            if (!idDeleted || idDeleted.length === 0) {
                const { data: tagDeleted, error: tagError } = await supabase
                    .from('plants')
                    .delete()
                    .eq('tag_id', plant.tag_id)
                    .select();

                if (tagError) throw tagError;

                if (!tagDeleted || tagDeleted.length === 0) {
                    throw new Error("Deletion failed. \n\nThis is likely because Supabase Row Level Security (RLS) is blocking the DELETE action for this table. Ensure you have a 'DELETE' policy enabled.");
                }
            }

            alert(`Plant ${plant.tag_id} deleted successfully.`);
            onDeleteSuccess?.();
            onClose();

        } catch (error: any) {
            console.error("Deletion Error:", error);
            alert(`Delete Failed: ${error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen || !plant) return null;

    const healthColors = {
        Good: "text-green-600 bg-green-50",
        Medium: "text-amber-600 bg-amber-50",
        Weak: "text-orange-600 bg-orange-50",
        Critical: "text-red-600 bg-red-50",
    };

    const profitLoss = (plant.revenue || 0) - (plant.cost || 0);
    const isProfitable = profitLoss >= 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto cursor-pointer"
            onClick={onClose}
        >
            <div
                className="bg-[#f8f9fa] w-full max-w-6xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8 cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black tracking-tight text-gray-900">{plant.tag_id}</h2>
                                <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", healthColors[plant.health_status])}>
                                    {plant.health_status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                                <Sprout className="w-4 h-4 text-[#10B981]" />
                                {plant.species}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all font-bold text-sm disabled:opacity-50"
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Delete
                        </button>
                        <button
                            onClick={() => plant && onEdit?.(plant)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#10B981] text-white hover:bg-[#0da672] rounded-xl transition-all font-bold shadow-lg shadow-[#10B981]/20"
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit Plant
                        </button>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Details & Financials */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Details Card */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Details</h3>
                            <div className="space-y-5">
                                <DetailItem icon={<Calendar className="w-4 h-4 text-blue-500" />} label="Planting Date" value={plant.planting_date} />
                                <DetailItem icon={<Calendar className="w-4 h-4 text-orange-500" />} label="Exp. Harvest" value={plant.harvest_date} />
                                <DetailItem icon={<Sprout className="w-4 h-4 text-[#10B981]" />} label="Current Stage" value={plant.growth_stage} />
                                <DetailItem icon={<ArrowUpRight className="w-4 h-4 text-purple-500" />} label="Est. Yield" value={`${plant.est_yield} kg`} />
                                <DetailItem icon={<CircleDollarSign className="w-4 h-4 text-gray-400" />} label="Total Cost" value={`$${plant.cost.toLocaleString()}`} />
                            </div>
                        </div>

                        {/* Financials Card */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Financials</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-500">Revenue</span>
                                    </div>
                                    <span className="text-xl font-black text-[#10B981]">${plant.revenue?.toLocaleString() || '0'}</span>
                                </div>
                                <div className={cn("flex justify-between items-center p-4 rounded-2xl", isProfitable ? "bg-green-50/50" : "bg-red-50/50")}>
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isProfitable ? "bg-green-100" : "bg-red-100")}>
                                            {isProfitable ? <TrendingDown className="w-4 h-4 text-green-600 rotate-180" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">Profit/Loss</span>
                                    </div>
                                    <span className={cn("text-xl font-black", isProfitable ? "text-green-600" : "text-red-600")}>
                                        {isProfitable ? "" : "-"}${Math.abs(profitLoss).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Logs & Tables */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Growth Logs */}
                        <SectionCard title="Growth Logs">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                                        <th className="pb-3 font-black">Date</th>
                                        <th className="pb-3 font-black text-center">Height (cm)</th>
                                        <th className="pb-3 font-black text-center">Leaves</th>
                                        <th className="pb-3 font-black text-center">Fruits</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-bold divide-y divide-gray-50">
                                    {growthLogs.length > 0 ? growthLogs.map((log) => (
                                        <tr key={log.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 text-gray-900">{log.date}</td>
                                            <td className="py-4 text-center text-gray-600">{log.height_cm}</td>
                                            <td className="py-4 text-center text-gray-600">{log.leaves_count}</td>
                                            <td className="py-4 text-center text-gray-600">{log.fruits_count}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="py-10 text-center text-gray-400 font-medium italic">No growth records yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </SectionCard>

                        {/* Treatments & Applications */}
                        <SectionCard title="Treatments & Applications" action={<button className="flex items-center gap-1.5 text-[10px] font-black uppercase text-[#10B981] hover:text-[#0da672]"><Plus className="w-3 h-3" /> Add Treatment</button>}>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                                        <th className="pb-3 font-black">Date</th>
                                        <th className="pb-3 font-black">Type</th>
                                        <th className="pb-3 font-black">Name</th>
                                        <th className="pb-3 font-black text-right">Quantity</th>
                                        <th className="pb-3 font-black text-right">Cost</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-bold divide-y divide-gray-50">
                                    {treatments.length > 0 ? treatments.map((item) => (
                                        <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 text-gray-900">{item.date}</td>
                                            <td className="py-4 italic font-medium">
                                                <span className={cn("px-2 py-0.5 rounded-md text-[9px] font-black uppercase", item.type === 'Fertilizer' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600')}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-900">{item.name}</td>
                                            <td className="py-4 text-right text-gray-600">{item.quantity}</td>
                                            <td className="py-4 text-right text-gray-900">${item.cost.toLocaleString()}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="py-10 text-center text-gray-400 font-medium italic">No treatments applied yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </SectionCard>

                        {/* Diseases */}
                        <SectionCard title="Diseases">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                                        <th className="pb-3 font-black">Date</th>
                                        <th className="pb-3 font-black">Disease Name</th>
                                        <th className="pb-3 font-black text-right">Severity</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-bold divide-y divide-gray-50">
                                    {diseases.length > 0 ? diseases.map((item) => (
                                        <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 text-gray-900">{item.date}</td>
                                            <td className="py-4 text-gray-900">{item.disease_name}</td>
                                            <td className="py-4 text-right">
                                                <span className={cn("px-2 py-0.5 rounded-md text-[9px] font-black uppercase",
                                                    item.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                                                        item.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-amber-100 text-amber-700')}>
                                                    {item.severity}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} className="py-10 text-center text-gray-400 font-medium italic">No diseases recorded.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </SectionCard>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    {icon}
                </div>
                <span className="text-sm font-bold text-gray-500">{label}</span>
            </div>
            <span className="text-sm font-black text-gray-900">{value}</span>
        </div>
    );
}

function SectionCard({ title, children, action }: { title: string, children: React.ReactNode, action?: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">{title}</h3>
                {action}
            </div>
            {children}
        </div>
    );
}
