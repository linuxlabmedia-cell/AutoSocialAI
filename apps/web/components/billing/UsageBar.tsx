import { cn } from "@/lib/utils";

export function UsageBar({ label, used, max }: { label: string; used: number; max: number }) {
  const pct = max === -1 ? 0 : Math.min((used / max) * 100, 100);
  const isUnlimited = max === -1;
  const isWarning = pct > 80;
  const isCritical = pct > 95;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn("font-medium", isCritical ? "text-red-600" : isWarning ? "text-amber-600" : "")}>
          {used}{isUnlimited ? " / ∞" : ` / ${max}`}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", isCritical ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-primary")}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
