import { cn } from "@/lib/utils";

const PLAN_COLORS: Record<string, string> = {
  STARTER: "bg-slate-500/10 text-slate-300 border border-slate-500/20",
  GROWTH: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  AGENCY: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  ENTERPRISE: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
};

const STATUS_COLORS: Record<string, string> = {
  active: "text-emerald-400",
  trialing: "text-blue-400",
  past_due: "text-red-400",
  canceled: "text-slate-500",
};

export function CurrentPlanBadge({ plan, status }: { plan: string; status: string }) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <span className={cn("text-sm font-medium px-2.5 py-0.5 rounded-full", PLAN_COLORS[plan] ?? "bg-white/[0.04] text-slate-300 border border-[#1a2540]")}>
        {plan}
      </span>
      <span className={cn("text-sm capitalize", STATUS_COLORS[status] ?? "text-slate-500")}>
        {status.replace(/_/g, " ")}
      </span>
    </div>
  );
}
