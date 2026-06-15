import Anthropic from "@anthropic-ai/sdk";
import { db } from "@autosocial/db";
import type { Client } from "@autosocial/db";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type QAResult = {
  score: number; // 0-1
  passed: boolean;
  results: {
    grammar: number;
    brandCompliance: number;
    captionQuality: number;
    imageRelevance: number;
    duplicateCheck: number;
    platformCompliance: number;
    engagementPrediction: number;
    spamCheck: number;
  };
  feedback: string;
};

const QA_PASS_THRESHOLD = 0.72;

export async function validateContent(
  postId: string,
  caption: string,
  imageUrl: string | null,
  client: Client
): Promise<QAResult> {
  // Check for duplicate captions in the last 90 days
  const recentPosts = await db.post.findMany({
    where: {
      clientId: client.id,
      createdAt: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      id: { not: postId },
    },
    select: { caption: true },
    take: 50,
  });

  const recentCaptions = recentPosts.map((p) => p.caption.slice(0, 50)).join("\n");

  const prompt = `You are a strict social media content quality control AI. Evaluate the following post for quality and brand compliance.

CLIENT PROFILE:
- Business: ${client.businessName}
- Industry: ${client.industry}
- Brand Voice: ${client.brandVoice ?? "Professional"}
- Target Audience: ${client.targetAudience ?? "General"}
- Brand Guidelines: ${client.brandGuidelines ?? "Standard professional guidelines"}

POST TO EVALUATE:
Caption: "${caption}"
${imageUrl ? `Image URL: ${imageUrl}` : "Image: Not yet generated"}

RECENT CAPTIONS (check for similarity/duplication):
${recentCaptions || "None yet"}

Evaluate on these 8 dimensions (score 0.0 to 1.0 each):

1. grammar — Grammar and spelling correctness
2. brandCompliance — How well it matches the brand voice and guidelines
3. captionQuality — Hook strength, readability, flow, appropriate length
4. imageRelevance — How well the image matches the caption topic (0.85 if no image yet)
5. duplicateCheck — Uniqueness vs recent posts (1.0 = completely unique, 0.0 = near-duplicate)
6. platformCompliance — Compliance with Facebook/Instagram content policies
7. engagementPrediction — Predicted engagement based on hook, CTA, and content quality
8. spamCheck — Absence of spam signals (excessive hashtags, clickbait, etc.)

Respond ONLY in this JSON format:
{
  "results": {
    "grammar": 0.95,
    "brandCompliance": 0.88,
    "captionQuality": 0.82,
    "imageRelevance": 0.85,
    "duplicateCheck": 1.0,
    "platformCompliance": 0.95,
    "engagementPrediction": 0.78,
    "spamCheck": 0.92
  },
  "feedback": "Brief improvement suggestion if score < 0.75"
}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const textContent = response.content[0];
  if (textContent.type !== "text") throw new Error("Unexpected QA response type");

  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Could not parse QA JSON response");

  const parsed = JSON.parse(jsonMatch[0]) as { results: QAResult["results"]; feedback: string };
  const scores = Object.values(parsed.results);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  return {
    score: avgScore,
    passed: avgScore >= QA_PASS_THRESHOLD,
    results: parsed.results,
    feedback: parsed.feedback,
  };
}
