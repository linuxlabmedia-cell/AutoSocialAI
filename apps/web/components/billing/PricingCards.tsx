"use client";

import { useState } from "react";
import { api } from "@/lib/trpc-provider";
import { toast } from "sonner";
import { Check, Sparkles } from "lucide-react";
import { PLANS } from "@autosocial/shared";
import { cn } from "@/lib/utils";

const PLAN_KEYS = ["STARTER", "GROWTH", "AGENCY"] as const;

export function PricingCards({ currentPlan }: { currentPlan?: string }) {
  const [interval, setInterval] = useState<"monthly" | "annual">("monthly");
  const checkout = api.billing.createCheckout.useMutation({
    onSuccess: ({ url }) => { if (url) window.location.href = url; },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Upgrade Plan</h2>
        <div className="flex items-center gap-1 border border-[#1a2540] rounded-xl p-1 bg-[#0d1526]">
          <button
            onClick={() => setInterval("monthly")}
            className={cn(
              "text-xs px-3 py-1.5 rounded-lg transition-colors",
              interval === "monthly" ? "bg-violet-600 text-white" : "text-slate-400 hover:bg-white/[0.04]"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval("annual")}
            className={cn(
              "text-xs px-3 py-1.5 rounded-lg transition-colors",
              interval === "annual" ? "bg-violet-600 text-white" : "text-slate-400 hover:bg-white/[0.04]"
            )}
          >
            Annual <span className="text-emerald-400 font-medium">20% off</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLAN_KEYS.map((key) => {
          const plan = PLANS[key];
          const price = interval === "monthly" ? plan.priceMonthly : plan.priceAnnual;
          const isCurrent = currentPlan === key;
          const isPopular = key === "GROWTH";

          return (
            <div
              key={key}
              className={cn(
                "rounded-2xl border p-5 space-y-4 relative bg-[#0d1526]",
                isPopular
                  ? "border-violet-500/50 shadow-[0_0_30px_rgba(139,92,246,0.12)]"
                  : "border-[#151f35]",
                isCurrent && "bg-white/[0.02]"
              )}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </span>
              )}

              <div>
                <h3 className="font-semibold text-white">{plan.name}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">${price}</span>
                  <span className="text-slate-500 text-sm">/mo</span>
                </div>
                {interval === "annual" && (
                  <p className="text-xs text-emerald-400 mt-0.5">
                    Save ${(plan.priceMonthly - plan.priceAnnual) * 12}/year
                  </p>
                )}
              </div>

              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-400">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => checkout.mutate({ plan: key, interval })}
                disabled={isCurrent || checkout.isPending}
                className={cn(
                  "w-full py-2 rounded-xl text-sm font-medium transition-colors",
                  isCurrent
                    ? "bg-white/[0.04] text-slate-600 cursor-default"
                    : isPopular
                    ? "bg-violet-600 hover:bg-violet-500 text-white"
                    : "border border-[#1a2540] text-slate-300 hover:bg-white/[0.04]"
                )}
              >
                {isCurrent ? "Current Plan" : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
