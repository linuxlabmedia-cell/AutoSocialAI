import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { generatePostImage } from "../lib/imageGen";

export const postsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        clientId: z.string().optional(),
        status: z
          .enum([
            "DRAFT", "GENERATING", "VALIDATING", "APPROVED",
            "SCHEDULED", "PUBLISHING", "PUBLISHED", "FAILED",
            "REJECTED", "PENDING_APPROVAL",
          ])
          .optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = {
        organizationId: ctx.organizationId,
        ...(input.clientId && { clientId: input.clientId }),
        ...(input.status && { status: input.status }),
      };

      const [posts, total] = await Promise.all([
        ctx.db.post.findMany({
          where,
          include: {
            client: { select: { businessName: true, logoUrl: true } },
          },
          orderBy: { createdAt: "desc" },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        ctx.db.post.count({ where }),
      ]);

      return { posts, total, page: input.page, totalPages: Math.ceil(total / input.limit) };
    }),

  get: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: { id: input.postId, organizationId: ctx.organizationId },
        include: {
          client: true,
          publishingLogs: { orderBy: { createdAt: "desc" }, take: 20 },
          analytics: { orderBy: { fetchedAt: "desc" }, take: 1 },
        },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      return post;
    }),

  getApprovalQueue: protectedProcedure
    .input(z.object({ clientId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findMany({
        where: {
          organizationId: ctx.organizationId,
          ...(input.clientId && { clientId: input.clientId }),
          status: "PENDING_APPROVAL",
        },
        include: {
          client: { select: { businessName: true, logoUrl: true, brandColors: true } },
        },
        orderBy: { createdAt: "asc" },
      });
    }),

  getDashboardQueue: protectedProcedure.query(async ({ ctx }) => {
    const [scheduled, pendingApproval, failed, recentlyPublished] = await Promise.all([
      ctx.db.post.findMany({
        where: { organizationId: ctx.organizationId, status: "SCHEDULED" },
        include: { client: { select: { businessName: true, logoUrl: true } } },
        orderBy: { scheduledAt: "asc" },
        take: 10,
      }),
      ctx.db.post.findMany({
        where: { organizationId: ctx.organizationId, status: "PENDING_APPROVAL" },
        include: { client: { select: { businessName: true, logoUrl: true } } },
        orderBy: { createdAt: "asc" },
        take: 7,
      }),
      ctx.db.post.findMany({
        where: { organizationId: ctx.organizationId, status: "FAILED" },
        include: { client: { select: { businessName: true, logoUrl: true } } },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      ctx.db.post.findMany({
        where: { organizationId: ctx.organizationId, status: "PUBLISHED" },
        include: { client: { select: { businessName: true, logoUrl: true } } },
        orderBy: { publishedAt: "desc" },
        take: 5,
      }),
    ]);

    return { scheduled, pendingApproval, failed, recentlyPublished };
  }),

  approve: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        scheduledAt: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: { id: input.postId, organizationId: ctx.organizationId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.db.post.update({
        where: { id: input.postId },
        data: {
          status: "SCHEDULED",
          approvedByUserId: ctx.userId,
          approvedAt: new Date(),
          ...(input.scheduledAt && { scheduledAt: new Date(input.scheduledAt) }),
        },
      });
    }),

  reject: protectedProcedure
    .input(z.object({ postId: z.string(), reason: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: { id: input.postId, organizationId: ctx.organizationId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.db.post.update({
        where: { id: input.postId },
        data: {
          status: "REJECTED",
          rejectedByUserId: ctx.userId,
          rejectionReason: input.reason,
        },
      });
    }),

  reschedule: protectedProcedure
    .input(z.object({ postId: z.string(), scheduledAt: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: { id: input.postId, organizationId: ctx.organizationId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      if (!["SCHEDULED", "APPROVED"].includes(post.status)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Post cannot be rescheduled in its current state" });
      }

      return ctx.db.post.update({
        where: { id: input.postId },
        data: { scheduledAt: new Date(input.scheduledAt) },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        caption: z.string().optional(),
        hashtags: z.array(z.string()).optional(),
        scheduledAt: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: { id: input.postId, organizationId: ctx.organizationId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      const { postId, ...data } = input;
      return ctx.db.post.update({
        where: { id: postId },
        data: {
          ...(data.caption && { caption: data.caption }),
          ...(data.hashtags && { hashtags: data.hashtags }),
          ...(data.scheduledAt && { scheduledAt: new Date(data.scheduledAt) }),
        },
      });
    }),

  generateImage: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: { id: input.postId, organizationId: ctx.organizationId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      if (!post.imagePrompt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Post has no image prompt" });
      }

      const imageUrl = await generatePostImage(post.imagePrompt, post.id);
      if (!imageUrl) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Image generation failed — check server logs",
        });
      }

      return ctx.db.post.update({
        where: { id: input.postId },
        data: { imageUrl, imageStatus: "GENERATED" },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: { id: input.postId, organizationId: ctx.organizationId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      if (post.status === "PUBLISHED") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot delete a published post" });
      }
      await ctx.db.post.delete({ where: { id: input.postId } });
    }),

  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [scheduled, publishedThisMonth, pendingApproval, failed, totalClients] =
      await Promise.all([
        ctx.db.post.count({ where: { organizationId: ctx.organizationId, status: "SCHEDULED" } }),
        ctx.db.post.count({
          where: {
            organizationId: ctx.organizationId,
            status: "PUBLISHED",
            publishedAt: { gte: startOfMonth },
          },
        }),
        ctx.db.post.count({ where: { organizationId: ctx.organizationId, status: "PENDING_APPROVAL" } }),
        ctx.db.post.count({ where: { organizationId: ctx.organizationId, status: "FAILED" } }),
        ctx.db.client.count({ where: { organizationId: ctx.organizationId, status: "ACTIVE" } }),
      ]);

    return { scheduled, publishedThisMonth, pendingApproval, failed, totalClients };
  }),
});
