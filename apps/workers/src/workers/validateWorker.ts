import { Worker } from "bullmq";
import { db } from "@autosocial/db";
import { redis, contentQueue, publishQueue } from "../queues";
import { validateContent } from "../services/ai/qualityValidator";

export type ValidateJobData = { postId: string };

const MAX_QA_ATTEMPTS = 3;

export function startValidateWorker() {
  const worker = new Worker<ValidateJobData>(
    "quality-validation",
    async (job) => {
      const { postId } = job.data;

      const post = await db.post.findUnique({
        where: { id: postId },
        include: { client: true },
      });
      if (!post) throw new Error(`Post ${postId} not found`);

      await db.post.update({
        where: { id: postId },
        data: { status: "VALIDATING" },
      });

      job.log("Running QA validation...");
      const qaResult = await validateContent(
        postId,
        post.caption,
        post.imageUrl,
        post.client
      );

      await db.post.update({
        where: { id: postId },
        data: {
          qaScore: qaResult.score,
          qaResults: qaResult.results as any,
          qaPassed: qaResult.passed,
          qaAttempts: { increment: 1 },
        },
      });

      if (qaResult.passed) {
        job.log(`QA passed with score ${(qaResult.score * 100).toFixed(0)}%`);

        if (post.client.autoApprove) {
          // Auto-approve: schedule directly
          await db.post.update({
            where: { id: postId },
            data: { status: "SCHEDULED" },
          });

          // Enqueue publishing at scheduled time
          const delay = post.scheduledAt
            ? Math.max(0, new Date(post.scheduledAt).getTime() - Date.now())
            : 0;

          await publishQueue.add(
            "publish",
            { postId },
            { jobId: `pub-${postId}`, delay }
          );
        } else {
          // Needs manual review
          await db.post.update({
            where: { id: postId },
            data: { status: "PENDING_APPROVAL" },
          });
        }

        // Update workflow run
        if (post.workflowRunId) {
          await db.workflowRun.update({
            where: { id: post.workflowRunId },
            data: { postsValidated: { increment: 1 } },
          });
        }
      } else {
        const currentAttempts = (post.qaAttempts ?? 0) + 1;
        job.log(`QA failed (score: ${(qaResult.score * 100).toFixed(0)}%, attempt ${currentAttempts}/${MAX_QA_ATTEMPTS}). Feedback: ${qaResult.feedback}`);

        if (currentAttempts < MAX_QA_ATTEMPTS) {
          // Regenerate content
          await db.post.update({
            where: { id: postId },
            data: { status: "DRAFT" },
          });

          await contentQueue.add(
            "regenerate",
            { clientId: post.clientId, workflowRunId: post.workflowRunId ?? undefined },
            { delay: 2000 }
          );

          // Delete the failed post to keep things clean
          await db.post.delete({ where: { id: postId } });
        } else {
          // Max attempts reached — mark as failed and notify
          await db.post.update({
            where: { id: postId },
            data: {
              status: "FAILED",
              publishError: `QA failed after ${MAX_QA_ATTEMPTS} attempts. Last score: ${(qaResult.score * 100).toFixed(0)}%`,
            },
          });

          if (post.workflowRunId) {
            await db.workflowRun.update({
              where: { id: post.workflowRunId },
              data: { postsFailed: { increment: 1 } },
            });
          }
        }
      }

      return { passed: qaResult.passed, score: qaResult.score };
    },
    { connection: redis, concurrency: 5 }
  );

  worker.on("failed", (job, err) => {
    console.error(`[ValidateWorker] Job ${job?.id} failed:`, err.message);
  });

  return worker;
}
