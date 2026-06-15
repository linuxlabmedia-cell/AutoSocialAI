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

type DataPoint = { date: string; reach: number; impressions: number; engagement: number };

export function EngagementChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="font-semibold mb-4">Engagement Trend</h3>
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
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => format(new Date(v), "MMM d")}
            tick={{ fontSize: 11 }}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            labelFormatter={(v) => format(new Date(v as string), "MMM d, yyyy")}
          />
          <Area type="monotone" dataKey="reach" stroke="#8b5cf6" fill="url(#reach)" strokeWidth={2} name="Reach" />
          <Area type="monotone" dataKey="engagement" stroke="#06b6d4" fill="url(#engagement)" strokeWidth={2} name="Engagement" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
