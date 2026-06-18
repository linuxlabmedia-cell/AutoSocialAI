import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const templateSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  serviceCategory: z.string().optional(),
  industries: z.array(z.string()).default([]),
  layoutType: z.string().optional(),
  description: z.string().optional(),
  exampleImageUrl: z.string().optional(),
  promptInstructions: z.string().optional(),
  designRules: z.string().optional(),
  textPlacementRules: z.string().optional(),
  brandPlacementRules: z.string().optional(),
  ctaPlacementRules: z.string().optional(),
  promptFramework: z.string().optional(),
  contentStrategy: z.string().optional(),
  marketingObjective: z.string().optional(),
  emotionalObjective: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export const templatesRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({
      category: z.string().optional(),
      serviceCategory: z.string().optional(),
      industrySlug: z.string().optional(),
      activeOnly: z.boolean().default(true),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.creativeTemplate.findMany({
        where: {
          organizationId: ctx.organizationId,
          ...(input.activeOnly && { isActive: true }),
          ...(input.category && { category: input.category }),
          ...(input.serviceCategory && { serviceCategory: input.serviceCategory }),
          ...(input.industrySlug && { industries: { has: input.industrySlug } }),
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      });
    }),

  get: protectedProcedure
    .input(z.object({ templateId: z.string() }))
    .query(async ({ ctx, input }) => {
      const template = await ctx.db.creativeTemplate.findFirst({
        where: { id: input.templateId, organizationId: ctx.organizationId },
      });
      if (!template) throw new TRPCError({ code: "NOT_FOUND" });
      return template;
    }),

  create: protectedProcedure
    .input(templateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.creativeTemplate.create({
        data: { ...input, organizationId: ctx.organizationId! },
      });
    }),

  update: protectedProcedure
    .input(z.object({ templateId: z.string(), data: templateSchema.partial() }))
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.db.creativeTemplate.findFirst({
        where: { id: input.templateId, organizationId: ctx.organizationId },
      });
      if (!template) throw new TRPCError({ code: "NOT_FOUND" });
      return ctx.db.creativeTemplate.update({
        where: { id: input.templateId },
        data: input.data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ templateId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.db.creativeTemplate.findFirst({
        where: { id: input.templateId, organizationId: ctx.organizationId },
      });
      if (!template) throw new TRPCError({ code: "NOT_FOUND" });
      await ctx.db.creativeTemplate.delete({ where: { id: input.templateId } });
    }),

  // Get templates approved for a specific client
  getApprovedForClient: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const approvals = await ctx.db.clientApprovedTemplate.findMany({
        where: { clientId: input.clientId },
        include: { template: true },
      });
      return approvals.map((a) => a.template);
    }),

  // Replace all approved templates for a client
  setApprovedForClient: protectedProcedure
    .input(z.object({ clientId: z.string(), templateIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      // Verify client belongs to org
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.$transaction([
        ctx.db.clientApprovedTemplate.deleteMany({ where: { clientId: input.clientId } }),
        ctx.db.clientApprovedTemplate.createMany({
          data: input.templateIds.map((templateId) => ({
            clientId: input.clientId,
            templateId,
          })),
        }),
      ]);
    }),

  categories: protectedProcedure.query(async ({ ctx }) => {
    const templates = await ctx.db.creativeTemplate.findMany({
      where: { organizationId: ctx.organizationId, isActive: true },
      select: { category: true },
      distinct: ["category"],
    });
    return templates.map((t) => t.category).sort();
  }),

  serviceCategoriesUsed: protectedProcedure.query(async ({ ctx }) => {
    const templates = await ctx.db.creativeTemplate.findMany({
      where: { organizationId: ctx.organizationId, isActive: true, serviceCategory: { not: null } },
      select: { serviceCategory: true },
      distinct: ["serviceCategory"],
    });
    return templates.map((t) => t.serviceCategory).filter(Boolean).sort();
  }),

  duplicate: protectedProcedure
    .input(z.object({ templateId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.db.creativeTemplate.findFirst({
        where: { id: input.templateId, organizationId: ctx.organizationId },
      });
      if (!template) throw new TRPCError({ code: "NOT_FOUND" });
      const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = template;
      return ctx.db.creativeTemplate.create({
        data: { ...rest, name: `${rest.name} (Copy)`, isActive: false },
      });
    }),
});
