import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";

type Stats = { scheduled: number; published: number; pendingApproval: number; failed: number };

export function ClientStatsCards({ stats }: { stats: Stats }) {
  const cards = [
    { label: "Scheduled", value: stats.scheduled, icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Published", value: stats.published, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Pending Approval", value: stats.pendingApproval, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Failed", value: stats.failed, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className="rounded-xl border bg-card p-4">
            <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center mb-2`}>
              <Icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </div>
        );
      })}
    </div>
  );
}
