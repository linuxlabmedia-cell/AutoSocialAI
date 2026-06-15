import { Worker } from "bullmq";
import { db } from "@autosocial/db";
import { redis, validateQueue } from "../queues";
import { generateImage, generateImageFallback } from "../services/ai/imageGenerator";

export type ImageJobData = { postId: string };

export function startImageWorker() {
  const worker = new Worker<ImageJobData>(
    "image-generation",
    async (job) => {
      const { postId } = job.data;

      const post = await db.post.findUnique({
        where: { id: postId },
        include: { client: true },
      });
      if (!post) throw new Error(`Post ${postId} not found`);

      await db.post.update({
        where: { id: postId },
        data: { imageStatus: "GENERATING" },
      });

      await db.usageRecord.upsert({
        where: {
          organizationId_periodStart: {
            organizationId: post.client.organizationId,
            periodStart: new Date(new Date().setDate(1)),
          },
        },
        update: { imagesGenerated: { increment: 1 } },
        create: {
          organizationId: post.client.organizationId,
          periodStart: new Date(new Date().setDate(1)),
          periodEnd: new Date(new Date(new Date().setDate(1)).setMonth(new Date().getMonth() + 1)),
          imagesGenerated: 1,
        },
      });

      job.log("Calling Replicate SDXL API...");

      let imageUrl: string;
      try {
        imageUrl = await generateImage(post.imagePrompt ?? post.caption, postId);
        await db.post.update({
          where: { id: postId },
          data: {
            imageUrl,
            imageStatus: "GENERATED",
            imageGenerationModel: "sdxl",
          },
        });
      } catch (err) {
        job.log(`Replicate failed: ${err}. Trying DALL-E 3 fallback...`);
        imageUrl = await generateImageFallback(post.imagePrompt ?? post.caption, postId);
        await db.post.update({
          where: { id: postId },
          data: {
            imageUrl,
            imageStatus: "GENERATED",
            imageGenerationModel: "dall-e-3",
          },
        });
      }

      // Enqueue QA validation
      await validateQueue.add("validate", { postId }, { jobId: `qa-${postId}` });
      job.log(`Image generated at ${imageUrl}, enqueued QA validation`);

      return { imageUrl };
    },
    { connection: redis, concurrency: 3 }
  );

  worker.on("failed", async (job, err) => {
    console.error(`[ImageWorker] Job ${job?.id} failed:`, err.message);
    if (job?.data.postId) {
      await db.post.update({
        where: { id: job.data.postId },
        data: { imageStatus: "FAILED", status: "FAILED", publishError: err.message },
      });
    }
  });

  return worker;
}
