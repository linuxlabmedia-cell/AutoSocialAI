"use client";

import Link from "next/link";
import { api } from "@/lib/trpc-provider";
import { Eye, Heart, MessageCircle, ArrowRight, BarChart3 } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export function EngagementSummary() {
  const { data: overview } = api.analytics.getOrgOverview.useQuery({ days: 30 });

  const hasData = (overview?.totalReach ?? 0) > 0;

  return (
    <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#151f35]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h2 className="font-semibold text-white text-sm">Engagement (Last 30 Days)</h2>
        </div>
        <Link
          href="/analytics"
          className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {!hasData ? (
        <div className="p-8 text-center">
          <BarChart3 className="w-6 h-6 text-slate-700 mx-auto mb-2" />
          <p className="text-sm text-slate-600">No engagement data yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 divide-x divide-[#0f1a2e]">
          <div className="p-4 text-center">
            <Eye className="w-4 h-4 text-cyan-400 mx-auto mb-1.5" />
            <p className="text-lg font-bold text-white tabular-nums">{formatNumber(overview?.totalReach ?? 0)}</p>
            <p className="text-xs text-slate-500">Reach</p>
          </div>
          <div className="p-4 text-center">
            <Heart className="w-4 h-4 text-pink-400 mx-auto mb-1.5" />
            <p className="text-lg font-bold text-white tabular-nums">{formatNumber(overview?.totalLikes ?? 0)}</p>
            <p className="text-xs text-slate-500">Likes</p>
          </div>
          <div className="p-4 text-center">
            <MessageCircle className="w-4 h-4 text-amber-400 mx-auto mb-1.5" />
            <p className="text-lg font-bold text-white tabular-nums">{formatNumber(overview?.totalComments ?? 0)}</p>
            <p className="text-xs text-slate-500">Comments</p>
          </div>
        </div>
      )}
    </div>
  );
}
