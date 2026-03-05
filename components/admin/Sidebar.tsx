"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutGrid,
    Sprout,
    BarChart3,
    Users,
    LogOut,
    ChevronRight,
    MapIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutGrid },
    { name: "Plants", href: "/admin/plants", icon: Sprout },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Ground Plans", href: "/admin/ground-plans", icon: MapIcon },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-screen w-64 bg-[#0B1526] text-white border-r border-white/10">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center font-bold text-lg">
                    G
                </div>
                <span className="text-xl font-bold tracking-tight">GreenStripe</span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-white")} />
                                <span className="font-medium">{item.name}</span>
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4 text-white/50" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <LogOut className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
