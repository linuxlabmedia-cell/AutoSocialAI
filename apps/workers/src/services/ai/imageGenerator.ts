import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function generateImage(imagePrompt: string, postId: string): Promise<string> {
  // Call Replicate SDXL API
  const response = await fetch("https://api.replicate.com/v1/models/stability-ai/sdxl/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        prompt: imagePrompt,
        negative_prompt: "text, watermark, logo, blurry, low quality, pixelated, distorted, cartoon, amateur",
        width: 1080,
        height: 1080,
        num_outputs: 1,
        num_inference_steps: 30,
        guidance_scale: 7.5,
        scheduler: "K_EULER",
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Replicate API error: ${response.status}`);
  }

  const prediction = await response.json() as { id: string; status: string };

  // Poll for completion
  let imageUrl: string | null = null;
  let attempts = 0;
  const maxAttempts = 60;

  while (!imageUrl && attempts < maxAttempts) {
    await new Promise((r) => setTimeout(r, 2000));

    const statusRes = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` },
    });
    const status = await statusRes.json() as { status: string; output?: string[]; error?: string };

    if (status.status === "succeeded" && status.output?.[0]) {
      imageUrl = status.output[0];
    } else if (status.status === "failed") {
      throw new Error(`Image generation failed: ${status.error ?? "unknown"}`);
    }

    attempts++;
  }

  if (!imageUrl) throw new Error("Image generation timed out");

  // Download the image
  const imgResponse = await fetch(imageUrl);
  if (!imgResponse.ok) throw new Error("Failed to download generated image");
  const imageBuffer = Buffer.from(await imgResponse.arrayBuffer());

  // Upload to Cloudflare R2
  const key = `posts/${postId}/image.jpg`;
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: imageBuffer,
      ContentType: "image/jpeg",
      CacheControl: "public, max-age=31536000",
    })
  );

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

// Fallback: DALL-E 3 if Replicate fails
export async function generateImageFallback(imagePrompt: string, postId: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural",
    }),
  });

  const data = await response.json() as { data?: Array<{ url: string }> };
  if (!data.data?.[0]?.url) throw new Error("DALL-E 3 generation failed");

  const imgRes = await fetch(data.data[0].url);
  const imageBuffer = Buffer.from(await imgRes.arrayBuffer());

  const key = `posts/${postId}/image.jpg`;
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: imageBuffer,
      ContentType: "image/jpeg",
    })
  );

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
