import { Worker } from "bullmq";
import { db } from "@autosocial/db";
import { redis, imageQueue } from "../queues";
import { generateContent } from "../services/ai/contentGenerator";

export type ContentJobData = {
  clientId: string;
  workflowRunId?: string;
  requestedPostType?: string;
};

export function startContentWorker() {
  const worker = new Worker<ContentJobData>(
    "content-generation",
    async (job) => {
      const { clientId, workflowRunId } = job.data;

      const client = await db.client.findUnique({ where: { id: clientId } });
      if (!client) throw new Error(`Client ${clientId} not found`);

      // Update organization usage
      await db.usageRecord.upsert({
        where: {
          organizationId_periodStart: {
            organizationId: client.organizationId,
            periodStart: new Date(new Date().setDate(1)),
          },
        },
        update: { postsGenerated: { increment: 1 } },
        create: {
          organizationId: client.organizationId,
          periodStart: new Date(new Date().setDate(1)),
          periodEnd: new Date(new Date(new Date().setDate(1)).setMonth(new Date().getMonth() + 1)),
          postsGenerated: 1,
        },
      });

      // Generate content
      job.log("Generating content with Claude...");
      const content = await generateContent(client);

      // Create post record
      const post = await db.post.create({
        data: {
          clientId,
          organizationId: client.organizationId,
          caption: content.caption,
          hashtags: content.hashtags,
          altText: content.altText,
          topic: content.topic,
          postType: "EDUCATIONAL" as any, // actual type comes from content.topic metadata
          status: "GENERATING",
          imagePrompt: content.imagePrompt,
          workflowRunId,
          generationModel: "claude-sonnet-4-6",
          platformTargets: client.socialAccounts
            ? ["FACEBOOK", "INSTAGRAM"]
            : [],
        },
      });

      // Determine scheduled time
      const scheduledAt = calculateNextSlot(client);
      await db.post.update({
        where: { id: post.id },
        data: { scheduledAt },
      });

      // Update workflow run progress
      if (workflowRunId) {
        await db.workflowRun.update({
          where: { id: workflowRunId },
          data: { postsGenerated: { increment: 1 } },
        });
      }

      // Enqueue image generation
      await imageQueue.add("generate-image", { postId: post.id }, { jobId: `img-${post.id}` });

      job.log(`Content generated for post ${post.id}, enqueued image generation`);
      return { postId: post.id };
    },
    { connection: redis, concurrency: 5 }
  );

  worker.on("failed", (job, err) => {
    console.error(`[ContentWorker] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}

function calculateNextSlot(client: { timezone: string; postingFrequency: string }): Date {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Default: schedule for 9 AM next day
  const optimalHours: Record<string, number[]> = {
    DAILY: [9, 12, 18],
    THREE_PER_WEEK: [9],
    WEEKLY: [9],
    CUSTOM: [9],
  };

  const hours = optimalHours[client.postingFrequency] ?? [9];
  const hour = hours[Math.floor(Math.random() * hours.length)];

  tomorrow.setHours(hour, 0, 0, 0);
  return tomorrow;
}
