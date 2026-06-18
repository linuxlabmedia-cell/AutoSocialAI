import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";

type Stats = { scheduled: number; published: number; pendingApproval: number; failed: number };

export function ClientStatsCards({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "Scheduled",
      value: stats.scheduled,
      icon: Clock,
      border: "border-violet-500/15",
      gradient: "from-violet-600/20 to-violet-600/5",
      iconColor: "text-violet-400",
    },
    {
      label: "Published",
      value: stats.published,
      icon: CheckCircle,
      border: "border-emerald-500/15",
      gradient: "from-emerald-600/20 to-emerald-600/5",
      iconColor: "text-emerald-400",
    },
    {
      label: "Pending Approval",
      value: stats.pendingApproval,
      icon: AlertCircle,
      border: "border-amber-500/15",
      gradient: "from-amber-600/20 to-amber-600/5",
      iconColor: "text-amber-400",
    },
    {
      label: "Failed",
      value: stats.failed,
      icon: XCircle,
      border: "border-red-500/15",
      gradient: "from-red-600/20 to-red-600/5",
      iconColor: "text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className={`rounded-2xl border ${c.border} bg-[#0d1526] p-4`}>
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.gradient} border ${c.border} flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${c.iconColor}`} />
            </div>
            <p className="text-2xl font-bold text-white tabular-nums">{c.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{c.label}</p>
          </div>
        );
      })}
    </div>
  );
}
