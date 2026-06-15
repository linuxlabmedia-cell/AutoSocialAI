import { Worker } from "bullmq";
import { db } from "@autosocial/db";
import { redis } from "../queues";
import { publishPost } from "../services/meta/publisher";

export type PublishJobData = { postId: string };

const RETRY_DELAYS = [60_000, 5 * 60_000, 30 * 60_000]; // 1m, 5m, 30m

export function startPublishWorker() {
  const worker = new Worker<PublishJobData>(
    "publishing",
    async (job) => {
      const { postId } = job.data;
      const attemptNumber = job.attemptsMade;

      job.log(`Publishing attempt ${attemptNumber + 1} for post ${postId}`);

      const post = await db.post.findUnique({ where: { id: postId } });
      if (!post) throw new Error(`Post ${postId} not found`);

      if (post.status === "PUBLISHED") {
        job.log("Post already published, skipping");
        return { skipped: true };
      }

      if (!["SCHEDULED", "APPROVED"].includes(post.status)) {
        throw new Error(`Post ${postId} is in status ${post.status}, cannot publish`);
      }

      const results = await publishPost(postId);

      const failures = results.filter((r) => !r.success);
      if (failures.length > 0) {
        const errorMsg = failures.map((f) => `${f.platform}: ${f.error}`).join("; ");
        throw new Error(errorMsg);
      }

      // Update retry count tracking
      await db.post.update({
        where: { id: postId },
        data: {
          retryCount: attemptNumber,
          lastRetryAt: attemptNumber > 0 ? new Date() : undefined,
        },
      });

      job.log(`Successfully published post ${postId}`);
      return { success: true, results };
    },
    {
      connection: redis,
      concurrency: 5,
      limiter: { max: 10, duration: 60_000 }, // 10 publishes per minute
    }
  );

  worker.on("failed", async (job, err) => {
    console.error(`[PublishWorker] Job ${job?.id} failed:`, err.message);

    if (job?.data.postId) {
      const post = await db.post.findUnique({ where: { id: job.data.postId } });
      if (post && post.status !== "PUBLISHED") {
        // Only mark as permanently failed if we've exhausted retries
        const isLastAttempt = (job.attemptsMade ?? 0) >= (job.opts.attempts ?? 3) - 1;

        if (isLastAttempt) {
          await db.post.update({
            where: { id: job.data.postId },
            data: {
              status: "FAILED",
              publishError: err.message,
            },
          });
        }
      }
    }
  });

  return worker;
}
