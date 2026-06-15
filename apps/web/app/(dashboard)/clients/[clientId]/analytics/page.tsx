"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/trpc-provider";
import { EngagementChart } from "@/components/analytics/EngagementChart";
import { TopPostsTable } from "@/components/analytics/TopPostsTable";
import { PostTypePerformance } from "@/components/analytics/PostTypePerformance";
import { AnalyticsStatCards } from "@/components/analytics/AnalyticsStatCards";

export default function ClientAnalyticsPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const [days, setDays] = useState(30);
  const { data: overview } = api.analytics.getClientOverview.useQuery({ clientId, days });
  const { data: trend } = api.analytics.getEngagementTrend.useQuery({ clientId, days });
  const { data: typePerf } = api.analytics.getPostTypePerformance.useQuery({ clientId, days: 90 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Analytics</h2>
          <p className="text-muted-foreground text-sm mt-1">Performance across all connected platforms</p>
        </div>
        <select
          className="text-sm border rounded-lg px-3 py-1.5 bg-background"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {overview && <AnalyticsStatCards overview={overview} />}
      {trend && <EngagementChart data={trend} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {overview && <TopPostsTable posts={overview.topPosts} title="Top Performing Posts" />}
        {typePerf && <PostTypePerformance data={typePerf} />}
      </div>
    </div>
  );
}
