import { BarChart3, TrendingUp, Users, Heart, Eye, ArrowUpRight } from "lucide-react";

const statCards = [
  { label: "Total Posts Published", value: "—", icon: BarChart3, color: "violet", border: "border-violet-500/20", bg: "bg-violet-500/10", text: "text-violet-400" },
  { label: "Total Reach", value: "—", icon: Eye, color: "cyan", border: "border-cyan-500/20", bg: "bg-cyan-500/10", text: "text-cyan-400" },
  { label: "Total Engagement", value: "—", icon: Heart, color: "pink", border: "border-pink-500/20", bg: "bg-pink-500/10", text: "text-pink-400" },
  { label: "Active Clients", value: "—", icon: Users, color: "indigo", border: "border-indigo-500/20", bg: "bg-indigo-500/10", text: "text-indigo-400" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-500 mt-1 text-sm">Performance across all clients and platforms</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-2xl border ${card.border} bg-[#0d1526] p-4`}>
            <div className={`w-9 h-9 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center mb-3`}>
              <card.icon className={`w-4 h-4 ${card.text}`} />
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] p-5">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-violet-400" />
            <h2 className="font-semibold text-white text-sm">Posts Over Time</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="w-8 h-8 text-slate-700 mb-3" />
            <p className="text-sm text-slate-600">Data will appear after publishing posts</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] p-5">
          <div className="flex items-center gap-2 mb-6">
            <ArrowUpRight className="w-4 h-4 text-cyan-400" />
            <h2 className="font-semibold text-white text-sm">Engagement Rate</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="w-8 h-8 text-slate-700 mb-3" />
            <p className="text-sm text-slate-600">Connect social accounts to track engagement</p>
          </div>
        </div>
      </div>
    </div>
  );
}
