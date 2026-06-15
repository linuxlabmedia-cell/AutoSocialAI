import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const clientProfileSchema = z.object({
  businessName: z.string().min(1),
  industry: z.string().min(1),
  businessType: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().default("UTC"),
  targetAudience: z.string().optional(),
  brandVoice: z.string().optional(),
  brandVoiceNotes: z.string().optional(),
  brandColors: z.array(z.string()).default([]),
  brandGuidelines: z.string().optional(),
  logoUrl: z.string().optional(),
  products: z.array(z.string()).default([]),
  services: z.array(z.string()).default([]),
  competitors: z.array(z.string()).default([]),
  specialOffers: z.string().optional(),
  ctaPreferences: z.string().optional(),
  contentPillars: z.array(z.string()).default([]),
  postingFrequency: z
    .enum(["DAILY", "THREE_PER_WEEK", "WEEKLY", "CUSTOM"])
    .default("DAILY"),
  customSchedule: z.any().optional(),
  autoApprove: z.boolean().default(false),
  clientPortalEnabled: z.boolean().default(true),
});

export const clientsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.client.findMany({
      where: { organizationId: ctx.organizationId, status: { not: "ARCHIVED" } },
      include: {
        socialAccounts: { select: { platform: true, isConnected: true, accountName: true } },
        _count: { select: { posts: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  get: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
        include: {
          socialAccounts: true,
          _count: { select: { posts: true } },
        },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });
      return client;
    }),

  create: protectedProcedure
    .input(clientProfileSchema)
    .mutation(async ({ ctx, input }) => {
      // Enforce plan limits
      const org = await ctx.db.organization.findUnique({
        where: { id: ctx.organizationId },
        include: { _count: { select: { clients: true } } },
      });
      if (!org) throw new TRPCError({ code: "NOT_FOUND" });
      if (org.maxClients !== -1 && org._count.clients >= org.maxClients) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Your plan allows a maximum of ${org.maxClients} clients. Please upgrade.`,
        });
      }

      return ctx.db.client.create({
        data: {
          ...input,
          organizationId: ctx.organizationId!,
          createdByUserId: ctx.userId!,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ clientId: z.string(), data: clientProfileSchema.partial() }))
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.db.client.update({
        where: { id: input.clientId },
        data: input.data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.client.update({
        where: { id: input.clientId },
        data: { status: "ARCHIVED" },
      });
    }),

  getCalendar: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.db.contentCalendarSlot.findMany({
        where: {
          clientId: input.clientId,
          scheduledDate: {
            gte: new Date(input.startDate),
            lte: new Date(input.endDate),
          },
        },
        include: {
          post: {
            select: {
              id: true,
              caption: true,
              status: true,
              imageUrl: true,
              postType: true,
              qaScore: true,
            },
          },
        },
        orderBy: [{ scheduledDate: "asc" }, { scheduledTime: "asc" }],
      });
    }),

  getStats: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      const [scheduled, published, pendingApproval, failed] = await Promise.all([
        ctx.db.post.count({ where: { clientId: input.clientId, status: "SCHEDULED" } }),
        ctx.db.post.count({ where: { clientId: input.clientId, status: "PUBLISHED" } }),
        ctx.db.post.count({ where: { clientId: input.clientId, status: "PENDING_APPROVAL" } }),
        ctx.db.post.count({ where: { clientId: input.clientId, status: "FAILED" } }),
      ]);

      return { scheduled, published, pendingApproval, failed };
    }),
});
