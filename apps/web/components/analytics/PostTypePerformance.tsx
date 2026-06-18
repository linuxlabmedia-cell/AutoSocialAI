import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { BarChart3 } from "lucide-react";

type TypeData = { type: string; avgEngagement: number; count: number };

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 12,
  background: "#0d1526",
  border: "1px solid #1a2540",
  color: "#e2e8f0",
};

export function PostTypePerformance({ data }: { data: TypeData[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: d.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 12),
  }));

  return (
    <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] p-5">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-4 h-4 text-violet-400" />
        <h3 className="font-semibold text-white text-sm">Avg Engagement by Post Type</h3>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={formatted} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#151f35" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} />
          <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} width={90} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="avgEngagement" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="Avg Engagement" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
