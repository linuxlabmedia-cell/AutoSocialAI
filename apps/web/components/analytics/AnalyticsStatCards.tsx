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
    { label: "Total Reach", value: formatNumber(overview.totalReach), icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Impressions", value: formatNumber(overview.totalImpressions), icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Engagement", value: formatNumber(overview.totalEngagement), icon: Heart, color: "text-pink-600", bg: "bg-pink-50" },
    { label: "Avg Engagement Rate", value: `${(overview.avgEngagementRate * 100).toFixed(2)}%`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className="rounded-xl border bg-card p-4 space-y-2">
            <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold">{c.value}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
