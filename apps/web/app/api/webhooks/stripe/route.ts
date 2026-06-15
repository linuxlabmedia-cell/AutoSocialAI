import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@autosocial/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });

const PLAN_LIMITS: Record<string, { maxClients: number; maxPostsPerMonth: number }> = {
  STARTER: { maxClients: 3, maxPostsPerMonth: 150 },
  GROWTH: { maxClients: 10, maxPostsPerMonth: 500 },
  AGENCY: { maxClients: -1, maxPostsPerMonth: 2000 },
  ENTERPRISE: { maxClients: -1, maxPostsPerMonth: -1 },
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { organizationId, plan } = session.metadata ?? {};
        if (!organizationId || !plan) break;

        const limits = PLAN_LIMITS[plan] ?? PLAN_LIMITS.STARTER;
        await db.organization.update({
          where: { id: organizationId },
          data: {
            plan: plan as "STARTER" | "GROWTH" | "AGENCY" | "ENTERPRISE",
            stripeSubscriptionId: session.subscription as string,
            subscriptionStatus: "active",
            stripeCustomerId: session.customer as string,
            ...limits,
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const org = await db.organization.findFirst({
          where: { stripeSubscriptionId: sub.id },
        });
        if (!org) break;

        await db.organization.update({
          where: { id: org.id },
          data: { subscriptionStatus: sub.status },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const org = await db.organization.findFirst({
          where: { stripeSubscriptionId: sub.id },
        });
        if (!org) break;

        await db.organization.update({
          where: { id: org.id },
          data: {
            plan: "STARTER",
            subscriptionStatus: "canceled",
            maxClients: 3,
            maxPostsPerMonth: 100,
          },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const org = await db.organization.findFirst({
          where: { stripeCustomerId: invoice.customer as string },
        });
        if (!org) break;

        await db.organization.update({
          where: { id: org.id },
          data: { subscriptionStatus: "past_due" },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
