"use client";

import { useEffect, useState, useRef } from "react";
import { Sprout, Loader2, Info, Map as MapIcon, ZoomIn, ZoomOut, Search, Grab } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Plant } from "@/components/admin/PlantCard";
import { cn } from "@/lib/utils";

const getPlantPosition = (index: number) => {
    const PLANTS_PER_ROW = 10;
    const SPACING_X = 120;
    const SPACING_Y = 140;
    const BLOCK_MARGIN = 60;
    
    const col = index % PLANTS_PER_ROW;
    const row = Math.floor(index / PLANTS_PER_ROW);
    
    const pathOffsetX = Math.floor(col / 5) * BLOCK_MARGIN;
    const pathOffsetY = Math.floor(row / 5) * BLOCK_MARGIN;
    
    return {
        x: (col * SPACING_X) + 120 + pathOffsetX,
        y: (row * SPACING_Y) + 120 + pathOffsetY
    };
};

export default function GroundPlanPage() {
    const [plants, setPlants] = useState<(Plant & { x: number, y: number })[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredPlant, pHoveredPlant] = useState<(Plant & { x: number, y: number }) | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Pan and Zoom State
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    
    const containerRef = useRef<HTMLDivElement>(null);

    async function fetchPlants() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('plants')
                .select('*')
                .order('tag_id', { ascending: true });

            if (error) throw error;

            if (data) {
                const plantsWithPos = data.map((plant, index) => ({
                    ...plant,
                    ...getPlantPosition(index)
                }));
                setPlants(plantsWithPos);
            }
        } catch (error: any) {
            console.error("Error fetching plants:", error.message || error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPlants();
    }, []);

    // Handle Wheel Zoom
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const zoomSpeed = 0.001;
        const delta = -e.deltaY;
        const newScale = Math.min(Math.max(0.3, transform.scale + delta * zoomSpeed), 3);
        
        setTransform(prev => ({
            ...prev,
            scale: newScale
        }));
    };

    // Handle Pan
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0) { // Left click only for pan
            setIsDragging(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            const dx = e.clientX - lastMousePos.x;
            const dy = e.clientY - lastMousePos.y;
            
            setTransform(prev => ({
                ...prev,
                x: prev.x + dx,
                y: prev.y + dy
            }));
            
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const filteredPlants = plants.filter(p => 
        p.tag_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.species.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const healthColors = {
        Good: "bg-emerald-500",
        Medium: "bg-amber-500",
        Weak: "bg-orange-500",
        Critical: "bg-red-500",
    };

    const stageColors = {
        Seedling: "text-blue-500",
        Growing: "text-emerald-500",
        Flowering: "text-purple-500",
        Fruiting: "text-orange-500",
        Harvested: "text-gray-500",
    };

    return (
        <div className="flex flex-col h-full space-y-6 select-none">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <MapIcon className="w-8 h-8 text-[#10B981]" />
                        Ground Plan Top View
                    </h1>
                    <p className="text-gray-500 mt-1">Spatial visualization of your plantation field. Drag to pan, scroll to zoom.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white px-3 py-2 rounded-xl border border-gray-100 flex items-center shadow-sm max-w-xs transition-all focus-within:ring-2 focus-within:ring-[#10B981]/20">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Find a plant..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="outline-none text-sm font-medium text-black placeholder:text-gray-400 w-full"
                        />
                    </div>
                    
                    <div className="flex items-center bg-white border border-gray-100 rounded-xl p-2 shadow-sm text-xs font-bold text-gray-400">
                        <Grab className="w-4 h-4 mr-2" />
                        DRAG TO MOVE
                    </div>

                    <div className="flex items-center bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
                        <button 
                            onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(0.3, prev.scale - 0.1) }))}
                            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <ZoomOut className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="text-xs font-bold text-gray-500 px-2 min-w-[3rem] text-center">
                            {Math.round(transform.scale * 100)}%
                        </span>
                        <button 
                            onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(3, prev.scale + 0.1) }))}
                            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <ZoomIn className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400 bg-white rounded-[32px] border border-gray-100 min-h-[500px]">
                    <Loader2 className="w-10 h-10 animate-spin text-[#10B981]" />
                    <p className="font-medium italic">Scanning plantation field...</p>
                </div>
            ) : (
                <div 
                    className={cn(
                        "relative flex-1 bg-[#EEF2F5] rounded-[40px] border-8 border-white shadow-inner overflow-hidden min-h-[600px] cursor-grab active:cursor-grabbing",
                        isDragging && "cursor-grabbing"
                    )}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                >
                    {/* North Indicator */}
                    <div className="absolute top-8 left-8 z-20 flex flex-col items-center pointer-events-none opacity-50">
                        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
                            <div className="text-[#10B981] font-black text-sm">N</div>
                        </div>
                        <div className="w-1 h-6 bg-gradient-to-b from-[#10B981] to-transparent -mt-1"></div>
                    </div>

                    {/* Transform Layer */}
                    <div 
                        className="absolute inset-0 will-change-transform transition-transform duration-75 ease-out"
                        style={{ 
                            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                            transformOrigin: '0 0'
                        }}
                    >
                        {/* Grid Background Patterns */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ 
                            backgroundImage: `radial-gradient(#10B981 1px, transparent 1px)`, 
                            backgroundSize: `40px 40px`,
                            width: '4000px',
                            height: '3000px'
                        }}></div>

                        <div className="relative w-[4000px] h-[3000px] p-20">
                            {/* Map Blocks Decoration */}
                            <div className="absolute inset-0 pointer-events-none">
                                {[...Array(8)].map((_, i) => (
                                    [...Array(6)].map((_, j) => (
                                        <div 
                                            key={`${i}-${j}`}
                                            className="absolute border border-[#10B981]/10 bg-[#10B981]/5 rounded-[32px] flex items-center justify-center font-black text-[40px] text-[#10B981]/10 uppercase tracking-[20px]"
                                            style={{
                                                left: `${i * (120 * 5 + 60) + 60}px`,
                                                top: `${j * (140 * 5 + 60) + 60}px`,
                                                width: `${120 * 5 - 20}px`,
                                                height: `${140 * 5 - 20}px`
                                            }}
                                        >
                                            Block {String.fromCharCode(65 + i)}{j + 1}
                                        </div>
                                    ))
                                ))}
                            </div>

                            {/* Coordinate Labels */}
                            <div className="absolute inset-0 pointer-events-none">
                                {Array.from({ length: 30 }).map((_, i) => (
                                    <div key={`x-${i}`} className="absolute top-0 text-[10px] font-black text-gray-300" style={{ left: `${(i * 120) + 120}px` }}>L{i + 1}</div>
                                ))}
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div key={`y-${i}`} className="absolute left-0 text-[10px] font-black text-gray-300" style={{ top: `${(i * 140) + 120}px` }}>R{i + 1}</div>
                                ))}
                            </div>

                            {filteredPlants.map((plant) => (
                                <div
                                    key={plant.id}
                                    className="absolute group cursor-pointer"
                                    style={{ 
                                        left: `${plant.x}px`, 
                                        top: `${plant.y}px`,
                                        zIndex: hoveredPlant?.id === plant.id ? 50 : 10
                                    }}
                                    onMouseEnter={() => pHoveredPlant(plant)}
                                    onMouseLeave={() => pHoveredPlant(null)}
                                >
                                    {/* Plant Marker */}
                                    <div className={cn(
                                        "relative flex items-center justify-center w-10 h-10 rounded-2xl bg-white shadow-sm border-2 transform transition-all duration-300 group-hover:-translate-y-1",
                                        hoveredPlant?.id === plant.id ? "border-[#10B981] scale-125 shadow-xl" : "border-white"
                                    )}>
                                        <Sprout className={cn("w-6 h-6 animate-pulse-slow", stageColors[plant.growth_stage as keyof typeof stageColors] || "text-[#10B981]")} />
                                        <div className={cn(
                                            "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm",
                                            healthColors[plant.health_status as keyof typeof healthColors] || "bg-gray-400"
                                        )}></div>
                                    </div>

                                    {/* Mini Label */}
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-40 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900">
                                            {plant.tag_id}
                                        </span>
                                    </div>

                                    {/* Tooltip Fix: Positioned to the RIGHT to avoid covering the plant */}
                                    {hoveredPlant?.id === plant.id && (
                                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-6 z-[100] animate-in fade-in zoom-in slide-in-from-left-2 duration-200">
                                            <div className="bg-white rounded-[24px] shadow-2xl border border-gray-100 p-5 w-72 pointer-events-none relative">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-xl font-black text-gray-900">{plant.tag_id}</h3>
                                                            <span className={cn(
                                                                "px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white shadow-sm",
                                                                healthColors[plant.health_status as keyof typeof healthColors]
                                                            )}>
                                                                {plant.health_status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-500">{plant.species}</p>
                                                    </div>
                                                    <div className="p-2 bg-[#10B981]/10 rounded-xl">
                                                        <Sprout className={cn("w-5 h-5", stageColors[plant.growth_stage as keyof typeof stageColors])} />
                                                    </div>
                                                </div>

                                                <div className="space-y-3 border-t border-gray-50 pt-4">
                                                    <div className="flex justify-between">
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Growth Stage</span>
                                                        <span className="text-xs font-black text-gray-900">{plant.growth_stage}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Est. Yield</span>
                                                        <span className="text-xs font-black text-gray-900">{plant.est_yield} kg</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Harvest Date</span>
                                                        <span className="text-xs font-black text-gray-900">{plant.harvest_date}</span>
                                                    </div>
                                                </div>

                                                {/* Tooltip Arrow pointing to the left */}
                                                <div className="absolute right-full top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-l border-b border-gray-100 rotate-45 -mr-2 shadow-[-4px_4px_10px_rgba(0,0,0,0.05)]"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
