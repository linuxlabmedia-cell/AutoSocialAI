import { Worker } from "bullmq";
import { db } from "@autosocial/db";
import { redis } from "../queues";
import { getValidToken } from "../services/meta/tokenManager";

export type AnalyticsJobData = { clientId: string; platform: "FACEBOOK" | "INSTAGRAM" };

const META_GRAPH = "https://graph.facebook.com/v19.0";

export function startAnalyticsWorker() {
  const worker = new Worker<AnalyticsJobData>(
    "analytics-sync",
    async (job) => {
      const { clientId, platform } = job.data;

      const socialAccount = await db.clientSocialAccount.findFirst({
        where: { clientId, platform, isConnected: true },
      });
      if (!socialAccount) {
        job.log(`No ${platform} account found for client ${clientId}`);
        return;
      }

      // Get published posts for this client/platform
      const publishedPosts = await db.post.findMany({
        where: {
          clientId,
          status: "PUBLISHED",
          publishedAt: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
          ...(platform === "FACEBOOK" ? { facebookPostId: { not: null } } : { instagramMediaId: { not: null } }),
        },
        take: 25,
      });

      job.log(`Syncing analytics for ${publishedPosts.length} posts`);

      const token = await getValidToken(socialAccount.id);

      for (const post of publishedPosts) {
        try {
          const platformPostId = platform === "FACEBOOK" ? post.facebookPostId : post.instagramMediaId;
          if (!platformPostId) continue;

          const metrics = await fetchPostMetrics(
            platformPostId,
            platform,
            token,
            socialAccount.platformAccountId
          );

          await db.postAnalytics.upsert({
            where: {
              // Use a composite unique key pattern
              id: `${post.id}-${platform}`,
            },
            update: metrics,
            create: {
              id: `${post.id}-${platform}`,
              postId: post.id,
              clientId,
              platform,
              platformPostId,
              ...metrics,
              postDate: post.publishedAt,
              aiScore: post.qaScore,
            },
          });
        } catch (err) {
          job.log(`Failed to sync analytics for post ${post.id}: ${err}`);
        }
      }

      job.log("Analytics sync complete");
    },
    { connection: redis, concurrency: 3 }
  );

  return worker;
}

async function fetchPostMetrics(
  postId: string,
  platform: "FACEBOOK" | "INSTAGRAM",
  token: string,
  accountId: string
) {
  if (platform === "FACEBOOK") {
    const fields = "likes.summary(true),comments.summary(true),shares,reach,impressions";
    const res = await fetch(`${META_GRAPH}/${postId}?fields=${fields}&access_token=${token}`);
    const data = await res.json() as {
      likes?: { summary?: { total_count: number } };
      comments?: { summary?: { total_count: number } };
      shares?: { count: number };
      reach?: number;
      impressions?: number;
    };

    const likes = data.likes?.summary?.total_count ?? 0;
    const comments = data.comments?.summary?.total_count ?? 0;
    const shares = data.shares?.count ?? 0;
    const reach = data.reach ?? 0;
    const impressions = data.impressions ?? 0;
    const engagementRate = reach > 0 ? (likes + comments + shares) / reach : 0;

    return { likes, comments, shares, reach, impressions, engagementRate };
  } else {
    const fields = "like_count,comments_count,reach,impressions,saved,profile_activity";
    const res = await fetch(
      `${META_GRAPH}/${postId}/insights?metric=reach,impressions,saved,profile_activity&access_token=${token}`
    );
    const mediaRes = await fetch(`${META_GRAPH}/${postId}?fields=like_count,comments_count&access_token=${token}`);

    const data = await mediaRes.json() as { like_count?: number; comments_count?: number };
    const insightData = await res.json() as {
      data?: Array<{ name: string; values?: Array<{ value: number }> }>;
    };

    const getMetric = (name: string) =>
      insightData.data?.find((m) => m.name === name)?.values?.[0]?.value ?? 0;

    const likes = data.like_count ?? 0;
    const comments = data.comments_count ?? 0;
    const reach = getMetric("reach");
    const impressions = getMetric("impressions");
    const saves = getMetric("saved");
    const profileVisits = getMetric("profile_activity");
    const engagementRate = reach > 0 ? (likes + comments + saves) / reach : 0;

    return { likes, comments, shares: 0, reach, impressions, saves, profileVisits, engagementRate };
  }
}
