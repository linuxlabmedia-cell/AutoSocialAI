"use client";

import { api } from "@/lib/trpc-provider";
import { PricingCards } from "@/components/billing/PricingCards";
import { UsageBar } from "@/components/billing/UsageBar";
import { CurrentPlanBadge } from "@/components/billing/CurrentPlanBadge";

export default function BillingPage() {
  const { data: subscription } = api.billing.getSubscription.useQuery();
  const { data: usage } = api.billing.getUsage.useQuery();
  const managePortal = api.billing.createPortalSession.useMutation({
    onSuccess: ({ url }) => { if (url) window.location.href = url; },
  });

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Billing & Plans</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription and usage
          </p>
        </div>
        {subscription?.stripeSubscriptionId && (
          <button
            onClick={() => managePortal.mutate()}
            className="text-sm text-primary border border-primary rounded-lg px-4 py-2 hover:bg-primary/5 transition-colors"
          >
            Manage Billing
          </button>
        )}
      </div>

      {subscription && (
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg">Current Plan</h2>
              <CurrentPlanBadge plan={subscription.plan} status={subscription.subscriptionStatus} />
            </div>
          </div>

          {usage && (
            <div className="space-y-3">
              <UsageBar
                label="Posts Generated This Month"
                used={usage.postsGenerated}
                max={usage.maxPostsPerMonth}
              />
              <UsageBar
                label="Active Clients"
                used={usage.clientCount}
                max={usage.maxClients}
              />
            </div>
          )}
        </div>
      )}

      <PricingCards currentPlan={subscription?.plan} />
    </div>
  );
}
