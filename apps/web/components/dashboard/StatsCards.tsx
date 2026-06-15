"use client";

import { api } from "@/lib/trpc-provider";
import { Calendar, CheckCircle, Clock, AlertTriangle, Users } from "lucide-react";
import { formatNumber } from "@/lib/utils";

const cardDefs = [
  {
    label: "Scheduled",
    key: "scheduled" as const,
    icon: Clock,
    gradient: "from-violet-600/20 to-violet-600/5",
    border: "border-violet-500/15",
    iconColor: "text-violet-400",
    glow: "rgba(139,92,246,0.25)",
  },
  {
    label: "Published this month",
    key: "publishedThisMonth" as const,
    icon: CheckCircle,
    gradient: "from-emerald-600/20 to-emerald-600/5",
    border: "border-emerald-500/15",
    iconColor: "text-emerald-400",
    glow: "rgba(52,211,153,0.2)",
  },
  {
    label: "Pending Approval",
    key: "pendingApproval" as const,
    icon: Calendar,
    gradient: "from-amber-600/20 to-amber-600/5",
    border: "border-amber-500/15",
    iconColor: "text-amber-400",
    glow: "rgba(251,191,36,0.2)",
  },
  {
    label: "Active Clients",
    key: "totalClients" as const,
    icon: Users,
    gradient: "from-cyan-600/20 to-cyan-600/5",
    border: "border-cyan-500/15",
    iconColor: "text-cyan-400",
    glow: "rgba(34,211,238,0.2)",
  },
  {
    label: "Failed",
    key: "failed" as const,
    icon: AlertTriangle,
    gradient: "from-red-600/20 to-red-600/5",
    border: "border-red-500/15",
    iconColor: "text-red-400",
    glow: "rgba(248,113,113,0.2)",
  },
];

export function StatsCards() {
  const { data: stats } = api.posts.getDashboardStats.useQuery();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cardDefs.map((card) => {
        const Icon = card.icon;
        const value = stats?.[card.key] ?? 0;
        return (
          <div
            key={card.label}
            className={`rounded-2xl border ${card.border} bg-[#0d1526] p-4 space-y-3 transition-all duration-300 card-glow group cursor-default`}
            style={{ "--glow": card.glow } as React.CSSProperties}
          >
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.gradient} border ${card.border} flex items-center justify-center`}
            >
              <Icon className={`w-4 h-4 ${card.iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">
                {formatNumber(value)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
