import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const ASSET_TYPES = [
  "LOGO",
  "SECONDARY_LOGO",
  "BRAND_PHOTO",
  "TEAM_PHOTO",
  "PROPERTY_PHOTO",
  "STOCK_PHOTO",
  "EXAMPLE_POST",
  "COMPETITOR_GRAPHIC",
  "BRAND_GUIDELINE",
] as const;

export const assetsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ clientId: z.string(), type: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.db.clientAsset.findMany({
        where: {
          clientId: input.clientId,
          ...(input.type && { type: input.type }),
        },
        orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        type: z.string(),
        name: z.string().min(1),
        url: z.string().min(1),
        mimeType: z.string().optional(),
        fileSize: z.number().optional(),
        isPrimary: z.boolean().default(false),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      // If setting as primary, unset others of same type
      if (input.isPrimary) {
        await ctx.db.clientAsset.updateMany({
          where: { clientId: input.clientId, type: input.type },
          data: { isPrimary: false },
        });
      }

      return ctx.db.clientAsset.create({ data: input });
    }),

  setPrimary: protectedProcedure
    .input(z.object({ assetId: z.string(), clientId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const asset = await ctx.db.clientAsset.findFirst({
        where: { id: input.assetId, clientId: input.clientId },
      });
      if (!asset) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.$transaction([
        ctx.db.clientAsset.updateMany({
          where: { clientId: input.clientId, type: asset.type },
          data: { isPrimary: false },
        }),
        ctx.db.clientAsset.update({
          where: { id: input.assetId },
          data: { isPrimary: true },
        }),
      ]);
    }),

  delete: protectedProcedure
    .input(z.object({ assetId: z.string(), clientId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.clientAsset.deleteMany({
        where: { id: input.assetId, clientId: input.clientId },
      });
    }),
});
