"use client";

import { useState } from "react";
import { api } from "@/lib/trpc-provider";
import { BarChart3, Heart, Eye, Users, MessageCircle, Share2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { EngagementChart } from "@/components/analytics/EngagementChart";
import { TopPostsTable } from "@/components/analytics/TopPostsTable";

const statDefs = [
  { label: "Posts Published", key: "totalPostsPublished" as const, icon: BarChart3, border: "border-violet-500/20", bg: "bg-violet-500/10", text: "text-violet-400" },
  { label: "Total Reach", key: "totalReach" as const, icon: Eye, border: "border-cyan-500/20", bg: "bg-cyan-500/10", text: "text-cyan-400" },
  { label: "Likes", key: "totalLikes" as const, icon: Heart, border: "border-pink-500/20", bg: "bg-pink-500/10", text: "text-pink-400" },
  { label: "Comments", key: "totalComments" as const, icon: MessageCircle, border: "border-amber-500/20", bg: "bg-amber-500/10", text: "text-amber-400" },
  { label: "Shares", key: "totalShares" as const, icon: Share2, border: "border-emerald-500/20", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  { label: "Active Clients", key: "activeClients" as const, icon: Users, border: "border-indigo-500/20", bg: "bg-indigo-500/10", text: "text-indigo-400" },
];

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const { data: overview } = api.analytics.getOrgOverview.useQuery({ days });
  const { data: trend } = api.analytics.getOrgEngagementTrend.useQuery({ days });
  const { data: topPosts } = api.analytics.getOrgTopPosts.useQuery({ days });

  const hasData = (overview?.totalReach ?? 0) > 0 || (overview?.totalPostsPublished ?? 0) > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-slate-500 mt-1 text-sm">Performance across all clients and platforms</p>
        </div>
        <select
          className="text-sm border border-[#1a2540] rounded-lg px-3 py-1.5 bg-[#0d1526] text-slate-300"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statDefs.map((card) => (
          <div key={card.label} className={`rounded-2xl border ${card.border} bg-[#0d1526] p-4`}>
            <div className={`w-9 h-9 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center mb-3`}>
              <card.icon className={`w-4 h-4 ${card.text}`} />
            </div>
            <p className="text-2xl font-bold text-white tabular-nums">
              {formatNumber(overview?.[card.key] ?? 0)}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {!hasData ? (
        <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] p-12 text-center">
          <BarChart3 className="w-8 h-8 text-slate-700 mb-3 mx-auto" />
          <p className="text-sm text-slate-600">
            No analytics yet — data appears here once posts are published and Meta syncs engagement
            (runs nightly).
          </p>
        </div>
      ) : (
        <>
          {trend && trend.length > 0 && <EngagementChart data={trend} />}
          {topPosts && (
            <TopPostsTable posts={topPosts as any} title="Top Performing Posts (All Clients)" />
          )}
        </>
      )}
    </div>
  );
}
