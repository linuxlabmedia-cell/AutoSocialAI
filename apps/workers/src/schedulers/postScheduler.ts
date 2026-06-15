import cron from "node-cron";
import { db } from "@autosocial/db";
import { publishQueue, contentQueue, analyticsQueue } from "../queues";
import { refreshExpiringTokens } from "../services/meta/tokenManager";

// Every minute: find posts that are due to publish
export function startPostScheduler() {
  cron.schedule("* * * * *", async () => {
    try {
      const duePosts = await db.post.findMany({
        where: {
          status: "SCHEDULED",
          scheduledAt: { lte: new Date() },
        },
        take: 50,
      });

      for (const post of duePosts) {
        const jobId = `pub-${post.id}`;
        const existingJob = await publishQueue.getJob(jobId);

        if (!existingJob) {
          await publishQueue.add("publish", { postId: post.id }, { jobId });
          console.log(`[Scheduler] Enqueued publish for post ${post.id}`);
        }
      }
    } catch (err) {
      console.error("[PostScheduler] Error:", err);
    }
  });

  console.log("[PostScheduler] Started — checking every minute for due posts");
}

// Every day at 11 PM: generate content for clients that need it
export function startContentScheduler() {
  cron.schedule("0 23 * * *", async () => {
    console.log("[ContentScheduler] Running daily content generation check...");

    try {
      const clients = await db.client.findMany({
        where: { status: "ACTIVE" },
        include: { socialAccounts: { where: { isConnected: true } } },
      });

      for (const client of clients) {
        if (client.socialAccounts.length === 0) continue;

        // Check how many posts are scheduled for next 7 days
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        const upcomingCount = await db.post.count({
          where: {
            clientId: client.id,
            status: { in: ["SCHEDULED", "PENDING_APPROVAL", "APPROVED"] },
            scheduledAt: { gte: new Date(), lte: nextWeek },
          },
        });

        const targetPosts = client.postingFrequency === "DAILY" ? 7
          : client.postingFrequency === "THREE_PER_WEEK" ? 3
          : 1;

        const needed = Math.max(0, targetPosts - upcomingCount);

        if (needed > 0) {
          console.log(`[ContentScheduler] Generating ${needed} posts for ${client.businessName}`);

          for (let i = 0; i < needed; i++) {
            await contentQueue.add(
              "generate",
              { clientId: client.id },
              { delay: i * 5000 } // stagger by 5 seconds
            );
          }
        }
      }
    } catch (err) {
      console.error("[ContentScheduler] Error:", err);
    }
  });

  console.log("[ContentScheduler] Started — runs daily at 11 PM");
}

// Every day at 2 AM: sync analytics
export function startAnalyticsScheduler() {
  cron.schedule("0 2 * * *", async () => {
    console.log("[AnalyticsScheduler] Running daily analytics sync...");

    const clients = await db.client.findMany({
      where: { status: "ACTIVE" },
      include: { socialAccounts: { where: { isConnected: true } } },
    });

    for (const client of clients) {
      for (const account of client.socialAccounts) {
        await analyticsQueue.add(
          "sync",
          { clientId: client.id, platform: account.platform },
          { delay: Math.random() * 30000 } // Random delay to spread load
        );
      }
    }
  });

  console.log("[AnalyticsScheduler] Started — runs daily at 2 AM");
}

// Every day at 3 AM: refresh expiring Meta tokens
export function startTokenRefreshScheduler() {
  cron.schedule("0 3 * * *", async () => {
    console.log("[TokenRefresh] Checking for expiring tokens...");
    await refreshExpiringTokens();
  });
}
