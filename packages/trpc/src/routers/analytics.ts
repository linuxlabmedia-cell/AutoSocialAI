import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const analyticsRouter = createTRPCRouter({
  getClientOverview: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        platform: z.enum(["FACEBOOK", "INSTAGRAM"]).optional(),
        days: z.number().default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      const since = new Date();
      since.setDate(since.getDate() - input.days);

      const analytics = await ctx.db.postAnalytics.findMany({
        where: {
          clientId: input.clientId,
          fetchedAt: { gte: since },
          ...(input.platform && { platform: input.platform }),
        },
        include: {
          post: { select: { caption: true, postType: true, imageUrl: true, publishedAt: true } },
        },
        orderBy: { fetchedAt: "desc" },
      });

      const totalReach = analytics.reduce((s, a) => s + a.reach, 0);
      const totalImpressions = analytics.reduce((s, a) => s + a.impressions, 0);
      const totalEngagement = analytics.reduce(
        (s, a) => s + a.likes + a.comments + a.shares,
        0
      );
      const avgEngagementRate =
        analytics.length > 0
          ? analytics.reduce((s, a) => s + Number(a.engagementRate ?? 0), 0) / analytics.length
          : 0;

      const topPosts = [...analytics]
        .sort((a, b) => b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares))
        .slice(0, 5);

      const worstPosts = [...analytics]
        .sort((a, b) => a.likes + a.comments + a.shares - (b.likes + b.comments + b.shares))
        .slice(0, 5);

      return {
        totalReach,
        totalImpressions,
        totalEngagement,
        avgEngagementRate,
        totalPosts: analytics.length,
        topPosts,
        worstPosts,
      };
    }),

  getEngagementTrend: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        days: z.number().default(30),
        platform: z.enum(["FACEBOOK", "INSTAGRAM"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      const since = new Date();
      since.setDate(since.getDate() - input.days);

      const analytics = await ctx.db.postAnalytics.findMany({
        where: {
          clientId: input.clientId,
          fetchedAt: { gte: since },
          ...(input.platform && { platform: input.platform }),
        },
        orderBy: { postDate: "asc" },
        select: {
          postDate: true,
          reach: true,
          impressions: true,
          likes: true,
          comments: true,
          shares: true,
          engagementRate: true,
        },
      });

      // Group by day
      const byDay = analytics.reduce(
        (acc, a) => {
          const day = a.postDate?.toISOString().split("T")[0] ?? "unknown";
          if (!acc[day]) acc[day] = { date: day, reach: 0, impressions: 0, engagement: 0 };
          acc[day].reach += a.reach;
          acc[day].impressions += a.impressions;
          acc[day].engagement += a.likes + a.comments + a.shares;
          return acc;
        },
        {} as Record<string, { date: string; reach: number; impressions: number; engagement: number }>
      );

      return Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date));
    }),

  getPostTypePerformance: protectedProcedure
    .input(z.object({ clientId: z.string(), days: z.number().default(90) }))
    .query(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      const since = new Date();
      since.setDate(since.getDate() - input.days);

      const analytics = await ctx.db.postAnalytics.findMany({
        where: { clientId: input.clientId, fetchedAt: { gte: since } },
        include: { post: { select: { postType: true } } },
      });

      const byType = analytics.reduce(
        (acc, a) => {
          const type = a.post.postType;
          if (!acc[type]) acc[type] = { type, totalEngagement: 0, count: 0, avgEngagement: 0 };
          acc[type].totalEngagement += a.likes + a.comments + a.shares;
          acc[type].count++;
          return acc;
        },
        {} as Record<string, { type: string; totalEngagement: number; count: number; avgEngagement: number }>
      );

      return Object.values(byType)
        .map((t) => ({ ...t, avgEngagement: t.count > 0 ? t.totalEngagement / t.count : 0 }))
        .sort((a, b) => b.avgEngagement - a.avgEngagement);
    }),
});
