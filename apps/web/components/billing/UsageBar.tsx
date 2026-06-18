import { cn } from "@/lib/utils";

export function UsageBar({ label, used, max }: { label: string; used: number; max: number }) {
  const pct = max === -1 ? 0 : Math.min((used / max) * 100, 100);
  const isUnlimited = max === -1;
  const isWarning = pct > 80;
  const isCritical = pct > 95;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">{label}</span>
        <span className={cn("font-medium tabular-nums", isCritical ? "text-red-400" : isWarning ? "text-amber-400" : "text-slate-200")}>
          {used}{isUnlimited ? " / ∞" : ` / ${max}`}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-2 bg-[#151f35] rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", isCritical ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-violet-500")}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
