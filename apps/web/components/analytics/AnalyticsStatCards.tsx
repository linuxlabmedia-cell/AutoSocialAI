import { formatNumber } from "@/lib/utils";
import { Eye, TrendingUp, Heart, Users } from "lucide-react";

type Overview = {
  totalReach: number;
  totalImpressions: number;
  totalEngagement: number;
  avgEngagementRate: number;
  totalPosts: number;
};

export function AnalyticsStatCards({ overview }: { overview: Overview }) {
  const cards = [
    { label: "Total Reach", value: formatNumber(overview.totalReach), icon: Users, border: "border-violet-500/15", gradient: "from-violet-600/20 to-violet-600/5", iconColor: "text-violet-400" },
    { label: "Impressions", value: formatNumber(overview.totalImpressions), icon: Eye, border: "border-cyan-500/15", gradient: "from-cyan-600/20 to-cyan-600/5", iconColor: "text-cyan-400" },
    { label: "Total Engagement", value: formatNumber(overview.totalEngagement), icon: Heart, border: "border-pink-500/15", gradient: "from-pink-600/20 to-pink-600/5", iconColor: "text-pink-400" },
    { label: "Avg Engagement Rate", value: `${(overview.avgEngagementRate * 100).toFixed(2)}%`, icon: TrendingUp, border: "border-emerald-500/15", gradient: "from-emerald-600/20 to-emerald-600/5", iconColor: "text-emerald-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className={`rounded-2xl border ${c.border} bg-[#0d1526] p-4 space-y-3`}>
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.gradient} border ${c.border} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${c.iconColor}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-white tabular-nums">{c.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{c.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
