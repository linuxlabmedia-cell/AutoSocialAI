import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

type TypeData = { type: string; avgEngagement: number; count: number };

export function PostTypePerformance({ data }: { data: TypeData[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: d.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 12),
  }));

  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="font-semibold mb-4">Avg Engagement by Post Type</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={formatted} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} />
          <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} width={90} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Bar dataKey="avgEngagement" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Avg Engagement" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
