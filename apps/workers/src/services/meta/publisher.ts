import { db } from "@autosocial/db";
import { getValidToken } from "./tokenManager";

const META_GRAPH = "https://graph.facebook.com/v19.0";

type PublishResult = {
  platform: "FACEBOOK" | "INSTAGRAM";
  platformPostId: string;
  success: boolean;
  error?: string;
  durationMs: number;
};

export async function publishPost(postId: string): Promise<PublishResult[]> {
  const post = await db.post.findUnique({
    where: { id: postId },
    include: {
      client: {
        include: { socialAccounts: { where: { isConnected: true } } },
      },
    },
  });

  if (!post) throw new Error(`Post ${postId} not found`);
  if (!post.imageUrl) throw new Error("Post has no image — cannot publish");

  const results: PublishResult[] = [];

  await db.post.update({ where: { id: postId }, data: { status: "PUBLISHING" } });

  const fullCaption = `${post.caption}\n\n${post.hashtags.map((h) => `#${h}`).join(" ")}`;

  for (const account of post.client.socialAccounts) {
    const startTime = Date.now();

    try {
      const token = await getValidToken(account.id);
      let platformPostId: string;

      if (account.platform === "FACEBOOK") {
        platformPostId = await publishToFacebook(account.platformAccountId, token, fullCaption, post.imageUrl!, post.scheduledAt);
      } else {
        platformPostId = await publishToInstagram(account.platformAccountId, token, fullCaption, post.imageUrl!);
      }

      const durationMs = Date.now() - startTime;

      await db.publishingLog.create({
        data: {
          postId,
          clientId: post.clientId,
          platform: account.platform,
          action: "publish_post",
          status: "success",
          durationMs,
        },
      });

      results.push({ platform: account.platform, platformPostId, success: true, durationMs });
    } catch (err) {
      const error = err instanceof Error ? err.message : "Unknown error";
      const durationMs = Date.now() - startTime;

      await db.publishingLog.create({
        data: {
          postId,
          clientId: post.clientId,
          platform: account.platform,
          action: "publish_post",
          status: "failed",
          errorMessage: error,
          durationMs,
        },
      });

      results.push({ platform: account.platform, platformPostId: "", success: false, error, durationMs });
    }
  }

  const allSucceeded = results.every((r) => r.success);
  const anySucceeded = results.some((r) => r.success);

  const fbResult = results.find((r) => r.platform === "FACEBOOK");
  const igResult = results.find((r) => r.platform === "INSTAGRAM");

  await db.post.update({
    where: { id: postId },
    data: {
      status: allSucceeded ? "PUBLISHED" : anySucceeded ? "PUBLISHED" : "FAILED",
      publishedAt: anySucceeded ? new Date() : undefined,
      facebookPostId: fbResult?.platformPostId || undefined,
      instagramMediaId: igResult?.platformPostId || undefined,
      publishError: allSucceeded ? null : results.filter((r) => !r.success).map((r) => r.error).join("; "),
    },
  });

  return results;
}

async function publishToFacebook(
  pageId: string,
  pageToken: string,
  caption: string,
  imageUrl: string,
  scheduledAt?: Date | null
): Promise<string> {
  // Step 1: Upload photo (unpublished)
  const photoRes = await fetch(`${META_GRAPH}/${pageId}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: imageUrl,
      published: false,
      temporary: true,
      access_token: pageToken,
    }),
  });

  const photoData = await photoRes.json() as { id?: string; error?: { message: string } };
  if (!photoData.id) throw new Error(`Facebook photo upload failed: ${photoData.error?.message}`);

  // Step 2: Create post (scheduled or immediate)
  const postBody: Record<string, unknown> = {
    message: caption,
    attached_media: [{ media_fbid: photoData.id }],
    access_token: pageToken,
  };

  if (scheduledAt && scheduledAt > new Date()) {
    postBody.scheduled_publish_time = Math.floor(scheduledAt.getTime() / 1000);
    postBody.published = false;
  } else {
    postBody.published = true;
  }

  const postRes = await fetch(`${META_GRAPH}/${pageId}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postBody),
  });

  const postData = await postRes.json() as { id?: string; error?: { message: string; code?: number } };
  if (!postData.id) {
    const errMsg = postData.error?.message ?? "Unknown Facebook error";
    const errCode = postData.error?.code;
    throw new Error(`Facebook post creation failed (${errCode}): ${errMsg}`);
  }

  return postData.id;
}

async function publishToInstagram(
  igUserId: string,
  pageToken: string,
  caption: string,
  imageUrl: string
): Promise<string> {
  // Step 1: Create media container
  const containerRes = await fetch(`${META_GRAPH}/${igUserId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: imageUrl,
      caption,
      media_type: "IMAGE",
      access_token: pageToken,
    }),
  });

  const containerData = await containerRes.json() as { id?: string; error?: { message: string } };
  if (!containerData.id) throw new Error(`Instagram container creation failed: ${containerData.error?.message}`);

  // Step 2: Poll for FINISHED status
  let statusCode = "";
  let attempts = 0;
  const maxAttempts = 30;

  while (statusCode !== "FINISHED" && attempts < maxAttempts) {
    await new Promise((r) => setTimeout(r, 2000));

    const statusRes = await fetch(
      `${META_GRAPH}/${containerData.id}?fields=status_code&access_token=${pageToken}`
    );
    const statusData = await statusRes.json() as { status_code?: string };
    statusCode = statusData.status_code ?? "";
    attempts++;

    if (statusCode === "ERROR" || statusCode === "EXPIRED") {
      throw new Error(`Instagram media container status: ${statusCode}`);
    }
  }

  if (statusCode !== "FINISHED") throw new Error("Instagram media container timed out");

  // Step 3: Publish the container
  const publishRes = await fetch(`${META_GRAPH}/${igUserId}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      creation_id: containerData.id,
      access_token: pageToken,
    }),
  });

  const publishData = await publishRes.json() as { id?: string; error?: { message: string } };
  if (!publishData.id) throw new Error(`Instagram publish failed: ${publishData.error?.message}`);

  return publishData.id;
}
