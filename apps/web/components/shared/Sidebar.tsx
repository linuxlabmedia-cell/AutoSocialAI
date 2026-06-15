"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Zap,
  BarChart3,
  CreditCard,
  Settings,
  Sparkles,
  LayoutTemplate,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/content/approval", label: "Approval Queue", icon: FileText },
  { href: "/workflows", label: "Workflows", icon: Zap },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex flex-col h-full bg-[#06090f] border-r border-[#151f35]">
      {/* Logo */}
      <div className="p-5 border-b border-[#151f35]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center glow-violet">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base text-white tracking-tight">
            AutoSocial <span className="text-gradient">AI</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-violet-600/25 to-indigo-600/10 text-violet-300 border border-violet-500/20 shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive ? "text-violet-400" : "text-slate-600"
                )}
              />
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* AI status */}
      <div className="p-4 border-t border-[#151f35]">
        <div className="rounded-xl bg-gradient-to-br from-violet-600/[0.08] to-indigo-600/[0.04] border border-violet-500/20 p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" />
            <p className="text-xs font-semibold text-violet-300">AI is running</p>
          </div>
          <p className="text-xs text-slate-600">Generating content automatically</p>
        </div>
      </div>
    </aside>
  );
}
