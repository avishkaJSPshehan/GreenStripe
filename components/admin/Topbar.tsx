"use client";

import { Bell, Search, User } from "lucide-react";

export function Topbar() {
    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="relative w-96">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search className="w-5 h-5" />
                </span>
                <input
                    type="text"
                    placeholder="Search anything..."
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">Farm Administrator</p>
                        <p className="text-xs text-gray-500 font-medium">Admin</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-white font-bold">
                        A
                    </div>
                </div>
            </div>
        </header>
    );
}
