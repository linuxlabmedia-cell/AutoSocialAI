import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const industrySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().min(1),
  keywords: z.array(z.string()).default([]),
  tone: z.string().min(1),
  visualStyle: z.string().min(1),
  suggestedCtaTypes: z.array(z.string()).default([]),
  compatibleCategories: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export const industriesRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ activeOnly: z.boolean().default(false) }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.industry.findMany({
        where: input?.activeOnly ? { isActive: true } : undefined,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      });
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const industry = await ctx.db.industry.findUnique({ where: { id: input.id } });
      if (!industry) throw new TRPCError({ code: "NOT_FOUND" });
      return industry;
    }),

  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const industry = await ctx.db.industry.findUnique({ where: { slug: input.slug } });
      if (!industry) throw new TRPCError({ code: "NOT_FOUND" });
      return industry;
    }),

  create: protectedProcedure
    .input(industrySchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.industry.findUnique({ where: { slug: input.slug } });
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "An industry with this slug already exists" });
      return ctx.db.industry.create({ data: input });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: industrySchema.partial() }))
    .mutation(async ({ ctx, input }) => {
      const industry = await ctx.db.industry.findUnique({ where: { id: input.id } });
      if (!industry) throw new TRPCError({ code: "NOT_FOUND" });
      return ctx.db.industry.update({ where: { id: input.id }, data: input.data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const industry = await ctx.db.industry.findUnique({ where: { id: input.id } });
      if (!industry) throw new TRPCError({ code: "NOT_FOUND" });
      await ctx.db.industry.delete({ where: { id: input.id } });
    }),

  duplicate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const industry = await ctx.db.industry.findUnique({ where: { id: input.id } });
      if (!industry) throw new TRPCError({ code: "NOT_FOUND" });
      const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = industry;
      const newSlug = `${rest.slug}-copy-${Date.now()}`;
      return ctx.db.industry.create({ data: { ...rest, name: `${rest.name} (Copy)`, slug: newSlug } });
    }),
});
