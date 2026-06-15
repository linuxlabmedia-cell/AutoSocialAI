"use client";

import { useState } from "react";
import { api } from "@/lib/trpc-provider";
import { toast } from "sonner";
import { Check } from "lucide-react";
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
        <h2 className="text-lg font-semibold">Upgrade Plan</h2>
        <div className="flex items-center gap-2 border rounded-lg p-1">
          <button
            onClick={() => setInterval("monthly")}
            className={cn("text-xs px-3 py-1.5 rounded-md transition-colors", interval === "monthly" ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval("annual")}
            className={cn("text-xs px-3 py-1.5 rounded-md transition-colors", interval === "annual" ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
          >
            Annual <span className="text-green-600 font-medium">20% off</span>
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
                "rounded-xl border p-5 space-y-4 relative",
                isPopular && "border-primary shadow-md",
                isCurrent && "bg-muted/30"
              )}
            >
              {isPopular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-0.5 rounded-full font-medium">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="font-semibold">{plan.name}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold">${price}</span>
                  <span className="text-muted-foreground text-sm">/mo</span>
                </div>
                {interval === "annual" && (
                  <p className="text-xs text-green-600 mt-0.5">
                    Save ${(plan.priceMonthly - plan.priceAnnual) * 12}/year
                  </p>
                )}
              </div>

              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => checkout.mutate({ plan: key, interval })}
                disabled={isCurrent || checkout.isPending}
                className={cn(
                  "w-full py-2 rounded-lg text-sm font-medium transition-colors",
                  isCurrent
                    ? "bg-muted text-muted-foreground cursor-default"
                    : isPopular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border hover:bg-muted"
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
