import { z } from "zod";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { createTRPCRouter, protectedProcedure } from "../trpc";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });
}

const PRICE_MAP: Record<string, Record<string, string>> = {
  STARTER: {
    monthly: process.env.STRIPE_STARTER_PRICE_ID ?? "",
    annual: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID ?? "",
  },
  GROWTH: {
    monthly: process.env.STRIPE_GROWTH_PRICE_ID ?? "",
    annual: process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID ?? "",
  },
  AGENCY: {
    monthly: process.env.STRIPE_AGENCY_PRICE_ID ?? "",
    annual: process.env.STRIPE_AGENCY_ANNUAL_PRICE_ID ?? "",
  },
};

export const billingRouter = createTRPCRouter({
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const org = await ctx.db.organization.findUnique({
      where: { id: ctx.organizationId },
      select: {
        plan: true,
        subscriptionStatus: true,
        stripeSubscriptionId: true,
        maxClients: true,
        maxPostsPerMonth: true,
      },
    });
    if (!org) throw new TRPCError({ code: "NOT_FOUND" });
    return org;
  }),

  getUsage: protectedProcedure.query(async ({ ctx }) => {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const [usage, org] = await Promise.all([
      ctx.db.usageRecord.findFirst({
        where: { organizationId: ctx.organizationId, periodStart: { gte: start } },
      }),
      ctx.db.organization.findUnique({
        where: { id: ctx.organizationId },
        select: { maxPostsPerMonth: true, maxClients: true },
      }),
    ]);

    const clientCount = await ctx.db.client.count({
      where: { organizationId: ctx.organizationId, status: "ACTIVE" },
    });

    return {
      postsGenerated: usage?.postsGenerated ?? 0,
      imagesGenerated: usage?.imagesGenerated ?? 0,
      maxPostsPerMonth: org?.maxPostsPerMonth ?? 100,
      maxClients: org?.maxClients ?? 3,
      clientCount,
    };
  }),

  createCheckout: protectedProcedure
    .input(
      z.object({
        plan: z.enum(["STARTER", "GROWTH", "AGENCY"]),
        interval: z.enum(["monthly", "annual"]).default("monthly"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const stripe = getStripe();
      const org = await ctx.db.organization.findUnique({
        where: { id: ctx.organizationId },
      });
      if (!org) throw new TRPCError({ code: "NOT_FOUND" });

      const priceId = PRICE_MAP[input.plan][input.interval];
      if (!priceId) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid plan" });

      let customerId = org.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: ctx.user.email,
          name: org.name,
          metadata: { organizationId: org.id },
        });
        customerId = customer.id;
        await ctx.db.organization.update({
          where: { id: ctx.organizationId },
          data: { stripeCustomerId: customerId },
        });
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
        metadata: { organizationId: org.id, plan: input.plan },
        subscription_data: { trial_period_days: org.subscriptionStatus === "trialing" ? 0 : undefined },
        allow_promotion_codes: true,
      });

      return { url: session.url };
    }),

  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const stripe = getStripe();
    const org = await ctx.db.organization.findUnique({
      where: { id: ctx.organizationId },
    });
    if (!org?.stripeCustomerId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "No billing account found" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });

    return { url: session.url };
  }),
});
