"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";

type DataPoint = { date: string; reach: number; impressions: number; engagement: number };

export function EngagementChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] p-5">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-4 h-4 text-cyan-400" />
        <h3 className="font-semibold text-white text-sm">Engagement Trend</h3>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="reach" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="engagement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#151f35" />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => format(new Date(v), "MMM d")}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 12, background: "#0d1526", border: "1px solid #1a2540", color: "#e2e8f0" }}
            labelFormatter={(v) => format(new Date(v as string), "MMM d, yyyy")}
          />
          <Area type="monotone" dataKey="reach" stroke="#8b5cf6" fill="url(#reach)" strokeWidth={2} name="Reach" />
          <Area type="monotone" dataKey="engagement" stroke="#06b6d4" fill="url(#engagement)" strokeWidth={2} name="Engagement" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
