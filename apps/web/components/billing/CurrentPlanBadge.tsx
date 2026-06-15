import { cn } from "@/lib/utils";

const PLAN_COLORS: Record<string, string> = {
  STARTER: "bg-gray-100 text-gray-700",
  GROWTH: "bg-blue-100 text-blue-700",
  AGENCY: "bg-purple-100 text-purple-700",
  ENTERPRISE: "bg-amber-100 text-amber-700",
};

const STATUS_COLORS: Record<string, string> = {
  active: "text-green-600",
  trialing: "text-blue-600",
  past_due: "text-red-600",
  canceled: "text-gray-500",
};

export function CurrentPlanBadge({ plan, status }: { plan: string; status: string }) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <span className={cn("text-sm font-medium px-2.5 py-0.5 rounded-full", PLAN_COLORS[plan] ?? "bg-gray-100 text-gray-700")}>
        {plan}
      </span>
      <span className={cn("text-sm capitalize", STATUS_COLORS[status] ?? "text-muted-foreground")}>
        {status.replace(/_/g, " ")}
      </span>
    </div>
  );
}
