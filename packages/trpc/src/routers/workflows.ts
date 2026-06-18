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

interface IndustryContext {
  name: string;
  tone: string;
  visualStyle: string;
  keywords: string[];
  suggestedCtaTypes: string[];
}

interface ServiceCategoryContext {
  name: string;
  contentStrategy: string;
  designRules: string;
  aiPromptFramework: string;
}

function buildCreativeDirectorPrompt(
  client: Client,
  templates: CreativeTemplate[],
  recentTopics: string[],
  recentTemplates: string[],
  industryCtx?: IndustryContext | null,
  serviceCategoryCtx?: ServiceCategoryContext | null
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

  // Industries where photorealistic images outperform graphic design
  const photoFriendly = ["real estate", "restaurant", "food", "hospitality", "travel", "fashion", "retail", "fitness", "beauty", "health"];
  const industryLower = (client.industry ?? "").toLowerCase();
  const isPhotoFriendly = photoFriendly.some((k) => industryLower.includes(k));

  const industrySection = industryCtx
    ? `
INDUSTRY PROFILE:
- Industry Tone: ${industryCtx.tone}
- Visual Style: ${industryCtx.visualStyle}
- Industry Keywords: ${industryCtx.keywords.join(", ")}
- Recommended CTAs: ${industryCtx.suggestedCtaTypes.join(", ")}`
    : "";

  const serviceCategorySection = serviceCategoryCtx
    ? `
ACTIVE SERVICE CATEGORY: ${serviceCategoryCtx.name}
- Content Strategy: ${serviceCategoryCtx.contentStrategy}
- Design Rules: ${serviceCategoryCtx.designRules}
- Visual Prompt Framework: ${serviceCategoryCtx.aiPromptFramework}`
    : "";

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
- CTA Preference: ${client.ctaPreferences ?? "Contact us today"}${businessDesc}${preferredStyles}${preferredImageStyles}${excludedStyles}${industrySection}${serviceCategorySection}

APPROVED CREATIVE TEMPLATES:
${templateList}

RECENT TOPICS USED (avoid repeating):
${topicsToAvoid}

RECENT TEMPLATES USED (try to vary):
${recentTemplateNames}

YOUR TASK AS CREATIVE DIRECTOR:
1. Select the BEST template from the approved list for today's post (vary from recent ones)
2. Determine the content goal, marketing objective, and emotional objective
3. Generate a compelling headline (max 8 words, punchy and specific — this will appear as large text on the graphic)
4. Write supporting text (1 short sentence max — this appears as smaller subtext on the graphic)
5. Write a CTA (max 5 words, action-oriented — this appears on a button on the graphic)
6. Write a full social media caption (150-280 chars) with clear message and CTA
7. Generate 8-12 highly relevant hashtags (mix of broad and niche)
8. Write a unique topic descriptor (3-5 words)
9. Write a VISUAL CONCEPT for the image (see requirements below)

IMAGE PROMPT (imagePrompt field) REQUIREMENTS:
The imagePrompt will be sent directly to an AI image generator. Follow these rules EXACTLY:

CLIENT BRAND STYLE — must be reflected in your prompt:
- BUSINESS: ${client.businessName}
- BRAND COLORS: ${brandColors} — use these as the dominant palette. Primary color for backgrounds or key areas, accent color for borders/icons/highlights, ensure all text is legible against the background.
- INDUSTRY: ${client.industry ?? "Professional Services"} — the visual style should feel native to this industry${isPhotoFriendly ? `\n- PHOTO-FRIENDLY INDUSTRY: You MAY include high-quality photorealistic imagery (property exteriors, interiors, people, spaces) since this industry benefits from real-world visuals. Brand the image with color overlays, text frames, or overlay elements in the client's colors.` : "\n- DESIGN-FIRST INDUSTRY: Create a premium graphic design — bold, clean, high-contrast. NOT a photograph. NOT a generic stock image. Think polished agency work."}
- LAYOUT: Start from the selected template's "Prompt Framework" if it has one.

TEXT ON THE GRAPHIC — critical rules to prevent AI errors:
- Show AT MOST 2-3 text elements on the graphic. Keep them SHORT.
- Headline text: render the first 3-4 words of the headline in large bold letters
- Stat or data: if the template is a report/results template, show ONE bold number (e.g. "+156%" or "$2.4M") in large text
- Business name: show only "${client.businessName}" as a small watermark or logo text at the bottom — do NOT render a full sentence
- Do NOT attempt to render the full caption, CTA sentence, or supporting text as on-screen text — AI image models misspell these
- Do NOT add decorative text banners with long sentences

VISUAL CONCEPT: Describe the specific visual elements, layout zones, and graphic motifs for this post based on the selected template type and this client's industry. Be specific and evocative — what does the viewer SEE?

Respond in this EXACT JSON format (valid JSON only, no trailing commas, no markdown):
{
  "selectedTemplateId": "the template id string or null if no templates",
  "selectedTemplateName": "template name or 'General Post'",
  "contentGoal": "one clear goal for this post",
  "marketingObjective": "e.g. Trust Building / Lead Generation / Education",
  "emotionalObjective": "e.g. Inspire / Reassure / Educate",
  "headline": "Your compelling headline here",
  "supportingText": "1 sentence supporting text",
  "ctaText": "Action CTA",
  "caption": "Full social media caption 150-280 chars",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "topic": "3-5 word topic descriptor",
  "altText": "One sentence image description for accessibility",
  "imagePrompt": "Visual concept for the graphic following all brand rules above",
  "postType": "EDUCATIONAL|AUTHORITY|ENGAGEMENT|INDUSTRY_NEWS|BEHIND_THE_SCENES|CASE_STUDY|TESTIMONIAL|FAQ|MYTH_BUSTING|PROBLEM_SOLUTION"
}`;
}

// ─────────────────────────────────────────────────────────────
// IMAGE PROMPT WRAPPER
// Enforces the client's actual brand palette and prevents AI
// text-rendering errors regardless of what Claude wrote.
// ─────────────────────────────────────────────────────────────

function wrapImagePrompt(
  concept: string,
  parsed: CreativeDirectorOutput,
  client: Client
): string {
  const colors = (client.brandColors as string[] | null) ?? [];
  const primaryColor = colors[0] ?? "#1a1a2e";
  const accentColor = colors[1] ?? colors[0] ?? "#e94560";
  const textColor = colors[2] ?? "#ffffff";

  const shortHeadline = parsed.headline.trim().split(/\s+/).slice(0, 4).join(" ");
  const businessName = client.businessName;

  // Industries where photos/renders are appropriate
  const photoFriendly = ["real estate", "restaurant", "food", "hospitality", "travel", "fashion", "retail", "fitness", "beauty", "health"];
  const industryLower = (client.industry ?? "").toLowerCase();
  const isPhotoFriendly = photoFriendly.some((k) => industryLower.includes(k));

  const designStyleRule = isPhotoFriendly
    ? `DESIGN STYLE: High-quality, aspirational image. Photorealistic or photographic imagery is encouraged for this industry. Apply brand colors as overlays, text frames, or accent elements — not as the entire background. The image should feel premium and professional.`
    : `DESIGN STYLE: Premium graphic design. Bold, clean, high-contrast. Agency-quality. NOT a generic photograph. NOT a stock image. Think polished dark-themed marketing visuals.`;

  return `Create a PREMIUM SOCIAL MEDIA GRAPHIC for ${businessName}. Follow every rule below.

MANDATORY BRAND COLORS — use these and only these:
• Primary (background or dominant): ${primaryColor}
• Accent (borders, icons, highlights): ${accentColor}
• Text: ${textColor}
Do not introduce colors outside this palette.

${designStyleRule}

${
  client.logoUrl
    ? `LOGO RESERVED SPACE — CRITICAL: A real logo image will be pasted onto the bottom-right corner of this graphic after generation. Leave that corner (roughly the bottom-right 16% x 16% area) visually clean and uncluttered — no text, no busy graphics, no important content there. A subtle dark or neutral area works best so the logo stays legible. Do NOT draw your own logo or business name there — it will be covered.`
    : `BRAND WATERMARK: Small "${businessName}" text at the bottom of the image in a clean, legible style.`
}

TEXT RENDERING RULES (critical — AI image models misspell long text):
• Only render SHORT text: headline fragment "${shortHeadline}" in large bold letters
• If the concept includes a stat or number, show it large (e.g. "+156%" or "$2.4M")
• Do NOT render full sentences, captions, or CTAs — they will be misspelled
• Maximum 6 words of visible text on the entire graphic

VISUAL CONCEPT:
${concept}

Format: 1:1 square social media post`;
}

// ─────────────────────────────────────────────────────────────
// POST GENERATION
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// SCHEDULING
// Spreads a batch of posts across future dates/times so a client
// can hit "Generate 30 Days" and have the whole month already
// scheduled, instead of needing to pick a time for every post.
// ─────────────────────────────────────────────────────────────

export function calculateScheduleSlots(client: Client, count: number): Date[] {
  const custom = (client.customSchedule as { times?: string[]; daysOfWeek?: number[] } | null) ?? null;
  const times = custom?.times?.length ? custom.times : ["09:00"];
  const daysOfWeek = custom?.daysOfWeek?.length
    ? custom.daysOfWeek
    : client.postingFrequency === "THREE_PER_WEEK"
    ? [1, 3, 5] // Mon, Wed, Fri
    : client.postingFrequency === "WEEKLY"
    ? [1] // Monday
    : [0, 1, 2, 3, 4, 5, 6]; // DAILY / CUSTOM default: every day

  const slots: Date[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 1); // start tomorrow
  cursor.setHours(0, 0, 0, 0);

  let safety = 0;
  while (slots.length < count && safety < count * 7 + 90) {
    safety++;
    if (daysOfWeek.includes(cursor.getDay())) {
      for (const t of times) {
        if (slots.length >= count) break;
        const [h, m] = t.split(":").map((n) => parseInt(n, 10));
        const slot = new Date(cursor);
        slot.setHours(Number.isFinite(h) ? h : 9, Number.isFinite(m) ? m : 0, 0, 0);
        slots.push(slot);
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return slots;
}

export async function generateAndSavePost(
  db: any,
  client: Client,
  workflowRunId: string,
  organizationId: string,
  approvedTemplates: CreativeTemplate[],
  scheduledAt?: Date
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

  // Load industry and service category context for richer prompts
  // Guard with optional chaining — db.industry may be absent on a stale cached PrismaClient
  const industrySlug = client.industry?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const industryCtx = (industrySlug && db.industry)
    ? await db.industry.findUnique({ where: { slug: industrySlug } }).catch(() => null)
    : null;

  // Determine the most relevant service category from approved templates
  const serviceCategorySlugs = approvedTemplates
    .map((t: any) => t.serviceCategory)
    .filter(Boolean);
  const dominantCategory = serviceCategorySlugs.length > 0
    ? serviceCategorySlugs.sort((a: string, b: string) =>
        serviceCategorySlugs.filter((v: string) => v === a).length -
        serviceCategorySlugs.filter((v: string) => v === b).length
      ).pop()
    : null;
  const serviceCategoryCtx = (dominantCategory && db.serviceCategory)
    ? await db.serviceCategory.findUnique({ where: { slug: dominantCategory } }).catch(() => null)
    : null;

  const prompt = buildCreativeDirectorPrompt(
    client,
    approvedTemplates,
    recentTopics,
    recentTemplates,
    industryCtx,
    serviceCategoryCtx
  );

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

  // Build the final image prompt: wrap Claude's visual concept with client-specific brand rules
  const finalImagePrompt = wrapImagePrompt(parsed.imagePrompt, parsed, client);
  const imageUrl = await generatePostImage(finalImagePrompt, workflowRunId, client.logoUrl);

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
      imagePrompt: finalImagePrompt,
      imageUrl: imageUrl ?? undefined,
      imageStatus: imageUrl ? "GENERATED" : "PENDING",
      topic: parsed.topic,
      postType: (parsed.postType as any) ?? "EDUCATIONAL",
      status: client.autoApprove ? "SCHEDULED" : "PENDING_APPROVAL",
      scheduledAt: scheduledAt ?? undefined,
      approvedAt: client.autoApprove ? new Date() : undefined,
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
      const scheduleSlots = calculateScheduleSlots(client, count);

      if (input.type === "SINGLE") {
        try {
          await generateAndSavePost(ctx.db, client, run.id, orgId, approvedTemplates, scheduleSlots[0]);
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
              await generateAndSavePost(ctx.db, client, run.id, orgId, approvedTemplates, scheduleSlots[i]);
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
