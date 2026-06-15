"use client";

import { Bell } from "lucide-react";
import { signOutAction } from "@/lib/auth-actions";

export function TopNav() {
  return (
    <header className="h-14 border-b border-[#151f35] bg-[#06090f]/80 backdrop-blur-md flex items-center justify-between px-6">
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        {/* Bell */}
        <button className="relative p-2 rounded-xl hover:bg-white/[0.05] transition-colors group">
          <Bell className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
        </button>

        {/* Sign out */}
        <form action={signOutAction}>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#1a2540] text-slate-500 hover:text-slate-200 hover:border-violet-500/30 hover:bg-violet-500/[0.06] transition-all"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
