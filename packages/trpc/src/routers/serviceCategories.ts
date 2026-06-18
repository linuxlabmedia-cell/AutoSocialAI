import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const serviceCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().min(1),
  contentStrategy: z.string().min(1),
  designRules: z.string().min(1),
  aiPromptFramework: z.string().min(1),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export const serviceCategoriesRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ activeOnly: z.boolean().default(false) }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.serviceCategory.findMany({
        where: input?.activeOnly ? { isActive: true } : undefined,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      });
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const cat = await ctx.db.serviceCategory.findUnique({ where: { id: input.id } });
      if (!cat) throw new TRPCError({ code: "NOT_FOUND" });
      return cat;
    }),

  getBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const cat = await ctx.db.serviceCategory.findUnique({ where: { slug: input.slug } });
      if (!cat) throw new TRPCError({ code: "NOT_FOUND" });
      return cat;
    }),

  create: protectedProcedure
    .input(serviceCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.serviceCategory.findUnique({ where: { slug: input.slug } });
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "A category with this slug already exists" });
      return ctx.db.serviceCategory.create({ data: input });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: serviceCategorySchema.partial() }))
    .mutation(async ({ ctx, input }) => {
      const cat = await ctx.db.serviceCategory.findUnique({ where: { id: input.id } });
      if (!cat) throw new TRPCError({ code: "NOT_FOUND" });
      return ctx.db.serviceCategory.update({ where: { id: input.id }, data: input.data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const cat = await ctx.db.serviceCategory.findUnique({ where: { id: input.id } });
      if (!cat) throw new TRPCError({ code: "NOT_FOUND" });
      await ctx.db.serviceCategory.delete({ where: { id: input.id } });
    }),

  duplicate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const cat = await ctx.db.serviceCategory.findUnique({ where: { id: input.id } });
      if (!cat) throw new TRPCError({ code: "NOT_FOUND" });
      const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = cat;
      const newSlug = `${rest.slug}-copy-${Date.now()}`;
      return ctx.db.serviceCategory.create({ data: { ...rest, name: `${rest.name} (Copy)`, slug: newSlug } });
    }),
});
