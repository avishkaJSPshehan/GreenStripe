"use client";

import { useEffect, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Search, Loader2, Sprout } from "lucide-react";
import { PlantCard, Plant } from "@/components/admin/PlantCard";
import { PlantModal } from "@/components/admin/PlantModal";
import { AddPlantModal } from "@/components/admin/AddPlantModal";
import { supabase } from "@/lib/supabase";

const ITEMS_PER_PAGE = 12;

export default function AdminPlantsPage() {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    async function fetchPlants() {
        setLoading(true);

        // Get total count
        const { count } = await supabase
            .from('plants')
            .select('*', { count: 'exact', head: true });

        setTotalCount(count || 0);

        // Get paginated data
        const { data, error } = await supabase
            .from('plants')
            .select('*')
            .order('tag_id', { ascending: true })
            .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);
        console.log(data);

        if (error) {
            console.error("Error fetching plants:", error);
        } else {
            setPlants(data || []);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchPlants();
    }, [page]);

    const handleCardClick = (plant: Plant) => {
        setSelectedPlant(plant);
        setIsModalOpen(true);
    };

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Sprout className="w-8 h-8 text-[#10B981]" />
                        Plants Management
                    </h1>
                    <p className="text-gray-500 mt-1">Track and manage all plants in the farm.</p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#10B981] text-white font-bold rounded-xl hover:bg-[#0da672] transition-all shadow-lg shadow-[#10B981]/20"
                >
                    <Plus className="w-5 h-5" />
                    Add New Plant
                </button>
            </div>

            <div className="bg-white p-2 rounded-2xl border border-gray-100 flex items-center shadow-sm max-w-md">
                <span className="px-3 text-gray-400">
                    <Search className="w-5 h-5" />
                </span>
                <input
                    type="text"
                    placeholder="Search species or Tag ID..."
                    className="flex-1 py-2 outline-none text-sm font-medium placeholder:text-gray-600"
                />
            </div>

            {loading ? (
                <div className="h-96 flex flex-col items-center justify-center gap-4 text-gray-400">
                    <Loader2 className="w-10 h-10 animate-spin text-[#10B981]" />
                    <p className="font-medium">Loading plants...</p>
                </div>
            ) : plants.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {plants.map((plant) => (
                            <PlantCard
                                key={plant.id}
                                plant={plant}
                                onClick={handleCardClick}
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-10">
                        <p className="text-sm text-gray-500 font-medium tracking-wide">
                            Showing <span className="text-gray-900 font-bold">{page * ITEMS_PER_PAGE + 1}</span> to <span className="text-gray-900 font-bold">{Math.min((page + 1) * ITEMS_PER_PAGE, totalCount)}</span> of <span className="text-gray-900 font-bold">{totalCount}</span> plants
                        </p>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="p-2 border border-gray-200 rounded-xl hover:bg-white hover:border-[#10B981] disabled:opacity-40 disabled:hover:border-gray-200 transition-all bg-white"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i)}
                                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === i
                                            ? "bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20"
                                            : "text-gray-400 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-200"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                className="p-2 border border-gray-200 rounded-xl hover:bg-white hover:border-[#10B981] disabled:opacity-40 disabled:hover:border-gray-200 transition-all bg-white"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="h-96 flex flex-col items-center justify-center gap-4 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                    <Sprout className="w-12 h-12 opacity-20" />
                    <p className="font-medium">No plants found in the database.</p>
                </div>
            )}

            <PlantModal
                plant={selectedPlant}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <AddPlantModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => fetchPlants()}
            />
        </div>
    );
}
