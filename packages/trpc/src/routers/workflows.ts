import { z } from "zod";
import { TRPCError } from "@trpc/server";
import Anthropic from "@anthropic-ai/sdk";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { Client, CreativeTemplate } from "@autosocial/db";
import { generatePostImage } from "../lib/imageGen";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─────────────────────────────────────────────────────────────
// CREATIVE DIRECTOR AGENT
// ─────────────────────────────────────────────────────────────

interface CreativeDirectorOutput {
  selectedTemplateId: string | null;
  selectedTemplateName: string;
  contentGoal: string;
  marketingObjective: string;
  emotionalObjective: string;
  headline: string;
  supportingText: string;
  ctaText: string;
  caption: string;
  hashtags: string[];
  topic: string;
  altText: string;
  imagePrompt: string;
  postType: string;
}

function buildCreativeDirectorPrompt(
  client: Client,
  templates: CreativeTemplate[],
  recentTopics: string[],
  recentTemplates: string[]
): string {
  const location = client.location ?? "Texas";
  const businessDesc = (client as any).businessDescription
    ? `\nBusiness Description: ${(client as any).businessDescription}`
    : "";
  const subIndustry = (client as any).subIndustry ? ` (${(client as any).subIndustry})` : "";
  const serviceAreas =
    (client as any).serviceAreas?.length > 0
      ? `\nService Areas: ${(client as any).serviceAreas.join(", ")}`
      : "";
  const preferredStyles =
    (client as any).preferredDesignStyles?.length > 0
      ? `\nPreferred Design Styles: ${(client as any).preferredDesignStyles.join(", ")}`
      : "";
  const preferredImageStyles =
    (client as any).preferredImageStyles?.length > 0
      ? `\nPreferred Image Styles: ${(client as any).preferredImageStyles.join(", ")}`
      : "";
  const excludedStyles =
    (client as any).excludedDesignStyles?.length > 0
      ? `\nExcluded Styles: ${(client as any).excludedDesignStyles.join(", ")}`
      : "";

  const brandColors = (client.brandColors as string[]).join(", ") || "professional brand colors";
  const topicsToAvoid = recentTopics.slice(0, 20).join(", ") || "none";
  const recentTemplateNames = recentTemplates.slice(0, 10).join(", ") || "none";

  const templateList =
    templates.length > 0
      ? templates
          .map((t) => {
            // Rules may come back as string or string[] depending on DB storage
            const validRules = (arr: unknown) => {
              if (!arr) return null;
              if (typeof arr === "string") return arr.trim().length > 3 ? arr : null;
              if (Array.isArray(arr)) return arr.filter((s: string) => String(s).trim().length > 3).join(", ") || null;
              return null;
            };
            const lines = [
              `TEMPLATE: "${t.name}" (ID: "${t.id}")`,
              `  Category: ${t.category} | Layout: ${t.layoutType ?? "Flexible"} | Objective: ${t.marketingObjective ?? "N/A"}`,
              `  Description: ${t.description ?? "N/A"}`,
              t.promptFramework ? `  Prompt Framework:\n${t.promptFramework}` : null,
              t.contentStrategy ? `  Content Strategy: ${t.contentStrategy}` : null,
              validRules(t.designRules) ? `  Design Rules: ${validRules(t.designRules)}` : null,
              validRules(t.textPlacementRules) ? `  Text Placement: ${validRules(t.textPlacementRules)}` : null,
              validRules(t.brandPlacementRules) ? `  Brand Placement: ${validRules(t.brandPlacementRules)}` : null,
              validRules(t.ctaPlacementRules) ? `  CTA Placement: ${validRules(t.ctaPlacementRules)}` : null,
            ].filter(Boolean);
            return lines.join("\n");
          })
          .join("\n\n---\n\n")
      : "No templates assigned — use general best practices";

  return `You are the Creative Director for ${client.businessName}, a professional social media content strategist.

BUSINESS PROFILE:
- Business: ${client.businessName}
- Industry: ${client.industry}${subIndustry}
- Location: ${location}${serviceAreas}
- Target Audience: ${client.targetAudience ?? "Local community and potential clients"}
- Brand Voice: ${client.brandVoice ?? "Professional"} ${client.brandVoiceNotes ? `— ${client.brandVoiceNotes}` : ""}
- Brand Colors: ${brandColors}
- Services: ${[...(client.products ?? []), ...(client.services ?? [])].join(", ") || "Professional services"}
- CTA Preference: ${client.ctaPreferences ?? "Contact us today"}${businessDesc}${preferredStyles}${preferredImageStyles}${excludedStyles}

APPROVED CREATIVE TEMPLATES:
${templateList}

RECENT TOPICS USED (avoid repeating):
${topicsToAvoid}

RECENT TEMPLATES USED (try to vary):
${recentTemplateNames}

YOUR TASK AS CREATIVE DIRECTOR:
1. Select the BEST template from the approved list for today's post (vary from recent ones)
2. Determine the content goal, marketing objective, and emotional objective
3. Generate a compelling headline (max 10 words, punchy and specific)
4. Write supporting text (1-2 short sentences, adds depth to headline)
5. Write a CTA (max 8 words, action-oriented)
6. Write a full social media caption (150-280 chars) with clear message and CTA
7. Generate 8-12 highly relevant hashtags (mix of broad and niche)
8. Write a unique topic descriptor (3-5 words)
9. Generate a detailed, professional image generation prompt

IMAGE PROMPT REQUIREMENTS:
- Produce a 150-200 word prompt describing a COMPLETE, DESIGNED social media graphic (not just a plain photo)
- Start with the selected template's Prompt Framework and replace placeholders as follows:
    [BUSINESS_NAME] → ${client.businessName}
    [HEADLINE] → the exact "headline" value you are generating in this JSON
    [SUPPORTING_TEXT] → the exact "supportingText" value you are generating
    [CTA] → the exact "ctaText" value you are generating
    [LOCATION] → ${location}
    [BRAND_COLORS] → ${brandColors}
- The rendered graphic MUST visually show: the headline as large bold text, the CTA as a styled button or accent, the business name or brand area
- Typography: clean modern sans-serif, bold headline font, high contrast and readable at mobile size
- Brand colors ${brandColors} as the primary palette for backgrounds, text bars, and accents
- Background: photographic or stylized as the template specifies (city skyline, property photo, gradient, etc.)
- Result: a finished, professional social media post that looks ready to publish — like premium Canva creative
- Atmosphere: aspirational, authoritative, on-brand for a San Antonio property management company

IMPORTANT:
- Make every post feel UNIQUE and specific to ${client.businessName} in ${location}
- Never use generic filler content
- The headline should be so good it stops someone scrolling
- If no templates are assigned, choose the most appropriate content type for this business

Respond in this EXACT JSON format (valid JSON only, no trailing commas, no markdown):
{
  "selectedTemplateId": "the template id string or null if no templates",
  "selectedTemplateName": "template name or 'General Post'",
  "contentGoal": "one clear goal for this post",
  "marketingObjective": "e.g. Trust Building / Lead Generation / Education",
  "emotionalObjective": "e.g. Inspire / Reassure / Educate",
  "headline": "Your compelling headline here",
  "supportingText": "1-2 sentence supporting text",
  "ctaText": "Action CTA here",
  "caption": "Full social media caption 150-280 chars",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "topic": "3-5 word topic descriptor",
  "altText": "One sentence image description for accessibility",
  "imagePrompt": "Full 120-180 word image generation prompt here",
  "postType": "EDUCATIONAL|AUTHORITY|ENGAGEMENT|INDUSTRY_NEWS|BEHIND_THE_SCENES|CASE_STUDY|TESTIMONIAL|FAQ|MYTH_BUSTING|PROBLEM_SOLUTION"
}`;
}

// ─────────────────────────────────────────────────────────────
// POST GENERATION
// ─────────────────────────────────────────────────────────────

async function generateAndSavePost(
  db: any,
  client: Client,
  workflowRunId: string,
  organizationId: string,
  approvedTemplates: CreativeTemplate[]
): Promise<void> {
  const recentUsed = await db.usedTopic.findMany({
    where: { clientId: client.id },
    orderBy: { usedAt: "desc" },
    take: 30,
    select: { topic: true, postType: true },
  });

  // Get recently used template names from posts
  const recentPosts = await db.post.findMany({
    where: { clientId: client.id, creativeCategory: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { creativeCategory: true },
  });

  const recentTopics: string[] = recentUsed.map((u: any) => u.topic);
  const recentTemplates: string[] = recentPosts
    .map((p: any) => p.creativeCategory)
    .filter(Boolean);

  const prompt = buildCreativeDirectorPrompt(client, approvedTemplates, recentTopics, recentTemplates);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const textContent = response.content[0];
  if (textContent.type !== "text") throw new Error("Unexpected response from Claude");

  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Could not parse JSON from Claude response");

  const parsed = JSON.parse(jsonMatch[0]) as CreativeDirectorOutput;

  // Generate image using the final image prompt
  const imageUrl = await generatePostImage(parsed.imagePrompt, workflowRunId);

  await db.usedTopic.create({
    data: {
      clientId: client.id,
      topic: parsed.topic,
      postType: (parsed.postType as any) ?? "EDUCATIONAL",
    },
  });

  await db.post.create({
    data: {
      clientId: client.id,
      organizationId,
      workflowRunId,
      templateId: parsed.selectedTemplateId ?? undefined,
      creativeCategory: parsed.selectedTemplateName,
      contentGoal: parsed.contentGoal,
      marketingObjective: parsed.marketingObjective,
      headline: parsed.headline,
      supportingText: parsed.supportingText,
      ctaText: parsed.ctaText,
      caption: parsed.caption,
      hashtags: parsed.hashtags,
      altText: parsed.altText,
      imagePrompt: parsed.imagePrompt,
      imageUrl: imageUrl ?? undefined,
      imageStatus: imageUrl ? "GENERATED" : "PENDING",
      topic: parsed.topic,
      postType: (parsed.postType as any) ?? "EDUCATIONAL",
      status: "PENDING_APPROVAL",
    },
  });

  await db.workflowRun.update({
    where: { id: workflowRunId },
    data: { postsGenerated: { increment: 1 } },
  });
}

// ─────────────────────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────────────────────

export const workflowsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ clientId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.workflowRun.findMany({
        where: {
          client: { organizationId: ctx.organizationId },
          ...(input.clientId && { clientId: input.clientId }),
        },
        include: {
          client: { select: { businessName: true, logoUrl: true } },
        },
        orderBy: { startedAt: "desc" },
        take: 50,
      });
    }),

  get: protectedProcedure
    .input(z.object({ workflowId: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflow = await ctx.db.workflow.findFirst({
        where: { id: input.workflowId, organizationId: ctx.organizationId },
        include: {
          client: true,
          runs: { orderBy: { startedAt: "desc" }, take: 10 },
        },
      });
      if (!workflow) throw new TRPCError({ code: "NOT_FOUND" });
      return workflow;
    }),

  create: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        name: z.string(),
        type: z.enum(["SINGLE", "BATCH_30", "BATCH_WEEKLY", "RECURRING"]),
        config: z.record(z.any()).default({}),
        cronSchedule: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });
      return ctx.db.workflow.create({
        data: { ...input, organizationId: ctx.organizationId! },
      });
    }),

  trigger: protectedProcedure
    .input(
      z.object({
        workflowId: z.string().optional(),
        clientId: z.string(),
        type: z.enum(["SINGLE", "BATCH_30", "BATCH_WEEKLY"]),
        config: z.record(z.any()).default({}),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.db.client.findFirst({
        where: { id: input.clientId, organizationId: ctx.organizationId },
      });
      if (!client) throw new TRPCError({ code: "NOT_FOUND" });

      // Load approved templates for this client
      const approvedTemplateRecords = await ctx.db.clientApprovedTemplate.findMany({
        where: { clientId: input.clientId },
        include: { template: true },
      });
      const approvedTemplates: CreativeTemplate[] = approvedTemplateRecords.map(
        (r: any) => r.template
      );

      const run = await ctx.db.workflowRun.create({
        data: {
          workflowId: input.workflowId,
          clientId: input.clientId,
          status: "RUNNING",
          metadata: { type: input.type, config: input.config },
        },
      });

      const count = input.type === "SINGLE" ? 1 : input.type === "BATCH_WEEKLY" ? 7 : 30;
      const orgId = ctx.organizationId!;

      if (input.type === "SINGLE") {
        try {
          await generateAndSavePost(ctx.db, client, run.id, orgId, approvedTemplates);
          await ctx.db.workflowRun.update({
            where: { id: run.id },
            data: { status: "COMPLETED", completedAt: new Date() },
          });
        } catch (err: any) {
          await ctx.db.workflowRun.update({
            where: { id: run.id },
            data: {
              status: "FAILED",
              completedAt: new Date(),
              errorLog: { push: err?.message ?? "Content generation failed" },
            },
          });
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: err?.message ?? "Content generation failed",
          });
        }
      } else {
        void (async () => {
          const errors: string[] = [];
          for (let i = 0; i < count; i++) {
            try {
              await generateAndSavePost(ctx.db, client, run.id, orgId, approvedTemplates);
            } catch (err: any) {
              errors.push(err?.message ?? "unknown error");
            }
            if (i < count - 1) await new Promise((r) => setTimeout(r, 800));
          }
          await ctx.db.workflowRun.update({
            where: { id: run.id },
            data: {
              status: errors.length === count ? "FAILED" : "COMPLETED",
              completedAt: new Date(),
              errorLog: errors,
            },
          });
        })();
      }

      return run;
    }),

  getRun: protectedProcedure
    .input(z.object({ runId: z.string() }))
    .query(async ({ ctx, input }) => {
      const run = await ctx.db.workflowRun.findFirst({
        where: { id: input.runId, client: { organizationId: ctx.organizationId } },
        include: {
          client: { select: { businessName: true } },
          posts: {
            select: {
              id: true,
              status: true,
              postType: true,
              topic: true,
              imageUrl: true,
              creativeCategory: true,
              headline: true,
            },
            orderBy: { createdAt: "asc" },
          },
        },
      });
      if (!run) throw new TRPCError({ code: "NOT_FOUND" });
      return run;
    }),

  pause: protectedProcedure
    .input(z.object({ workflowId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await ctx.db.workflow.findFirst({
        where: { id: input.workflowId, organizationId: ctx.organizationId },
      });
      if (!workflow) throw new TRPCError({ code: "NOT_FOUND" });
      return ctx.db.workflow.update({ where: { id: input.workflowId }, data: { isActive: false } });
    }),

  resume: protectedProcedure
    .input(z.object({ workflowId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await ctx.db.workflow.findFirst({
        where: { id: input.workflowId, organizationId: ctx.organizationId },
      });
      if (!workflow) throw new TRPCError({ code: "NOT_FOUND" });
      return ctx.db.workflow.update({ where: { id: input.workflowId }, data: { isActive: true } });
    }),
});
