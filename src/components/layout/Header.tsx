"use client";

import { Bell, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E5E7EB] shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-[#111827]">{title}</h1>
        {subtitle && (
          <p className="text-sm text-[#6B7280] mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
            size={15}
          />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-9 pr-4 py-2 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-colors placeholder:text-[#9CA3AF]"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors">
          <Bell size={18} className="text-[#6B7280]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7C3AED] rounded-full" />
        </button>

        {/* Avatar */}
        <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#F9FAFB] transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#0D9488] flex items-center justify-center text-white text-sm font-semibold">
            U
          </div>
        </button>
      </div>
    </header>
  );
}
