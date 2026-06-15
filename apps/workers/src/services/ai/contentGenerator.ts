import Anthropic from "@anthropic-ai/sdk";
import { db } from "@autosocial/db";
import { selectWeightedPostType } from "@autosocial/shared";
import { buildContentPrompt } from "./promptBuilder";
import type { Client } from "@autosocial/db";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type GeneratedContent = {
  caption: string;
  hashtags: string[];
  topic: string;
  altText: string;
  imagePrompt: string;
};

export async function generateContent(client: Client): Promise<GeneratedContent> {
  // Load recent topics to avoid duplicates
  const recentUsed = await db.usedTopic.findMany({
    where: { clientId: client.id },
    orderBy: { usedAt: "desc" },
    take: 30,
    select: { topic: true, postType: true },
  });

  const recentTopics = recentUsed.map((u) => u.topic);
  const recentPostTypes = recentUsed.map((u) => u.postType);

  // Weighted random post type selection (avoids repeats)
  const postType = selectWeightedPostType(recentPostTypes as any[]);

  const prompt = buildContentPrompt({ client, postType, recentTopics, recentPostTypes });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const textContent = response.content[0];
  if (textContent.type !== "text") throw new Error("Unexpected response type from Claude");

  // Extract JSON from the response (handle markdown code blocks)
  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Could not parse JSON from Claude response");

  const parsed = JSON.parse(jsonMatch[0]) as GeneratedContent;

  // Track used topic
  await db.usedTopic.create({
    data: {
      clientId: client.id,
      topic: parsed.topic,
      postType: postType as any,
    },
  });

  return { ...parsed };
}

export async function generateBatchContent(
  client: Client,
  count: number,
  onProgress?: (generated: number) => void
): Promise<GeneratedContent[]> {
  const results: GeneratedContent[] = [];

  // Process in parallel batches of 5 to respect rate limits
  const batchSize = 5;
  for (let i = 0; i < count; i += batchSize) {
    const batchCount = Math.min(batchSize, count - i);
    const batch = await Promise.allSettled(
      Array.from({ length: batchCount }, () => generateContent(client))
    );

    for (const result of batch) {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        console.error("Content generation failed in batch:", result.reason);
      }
    }

    onProgress?.(results.length);

    // Rate limit pause between batches
    if (i + batchSize < count) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  return results;
}
