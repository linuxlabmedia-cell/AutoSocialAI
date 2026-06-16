import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const META_GRAPH_URL = "https://graph.facebook.com/v19.0";

export const metaRouter = createTRPCRouter({
  getAuthUrl: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .query(({ input }) => {
      const params = new URLSearchParams({
        client_id: process.env.META_APP_ID!,
        redirect_uri: `${process.env.META_REDIRECT_BASE ?? process.env.NEXT_PUBLIC_APP_URL}/api/meta/callback`,
        scope: [
          "email",
          "public_profile",
          "pages_show_list",
          "pages_read_engagement",
          "pages_manage_posts",
          "instagram_content_publish",
        ].join(","),
        state: Buffer.from(JSON.stringify({ clientId: input.clientId })).toString("base64"),
        response_type: "code",
      });

      return { url: `https://www.facebook.com/v19.0/dialog/oauth?${params}` };
    }),

  disconnectAccount: protectedProcedure
    .input(z.object({ socialAccountId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.db.clientSocialAccount.findFirst({
        where: { id: input.socialAccountId, client: { organizationId: ctx.organizationId } },
      });
      if (!account) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.clientSocialAccount.update({
        where: { id: input.socialAccountId },
        data: { isConnected: false },
      });
    }),

  getConnectedAccounts: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.db.clientSocialAccount.findMany({
        where: { clientId: input.clientId },
        select: {
          id: true,
          platform: true,
          accountName: true,
          accountType: true,
          isConnected: true,
          accessTokenExpiresAt: true,
          lastTokenRefresh: true,
          platformAccountId: true,
        },
        orderBy: { createdAt: "asc" },
      });
    }),

  testConnection: protectedProcedure
    .input(z.object({ socialAccountId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.db.clientSocialAccount.findFirst({
        where: { id: input.socialAccountId, client: { organizationId: ctx.organizationId } },
      });
      if (!account) throw new TRPCError({ code: "NOT_FOUND" });

      try {
        // Decrypt token in production - here using plain for structure
        const token = account.accessToken;
        const res = await fetch(
          `${META_GRAPH_URL}/debug_token?input_token=${token}&access_token=${process.env.META_APP_ID}|${process.env.META_APP_SECRET}`
        );
        const data = await res.json() as { data?: { is_valid?: boolean; error?: { message: string } } };

        if (!data.data?.is_valid) {
          await ctx.db.clientSocialAccount.update({
            where: { id: input.socialAccountId },
            data: { isConnected: false },
          });
          return { success: false, error: data.data?.error?.message ?? "Token invalid" };
        }

        return { success: true };
      } catch {
        return { success: false, error: "Connection test failed" };
      }
    }),

  getPublishingLogs: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: { id: input.postId, organizationId: ctx.organizationId },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.db.publishingLog.findMany({
        where: { postId: input.postId },
        orderBy: { createdAt: "desc" },
      });
    }),
});
