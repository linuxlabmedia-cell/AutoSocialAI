async function fetchImageBuffer(url: string): Promise<Buffer> {
  if (url.startsWith("data:")) {
    const base64 = url.split(",")[1] ?? "";
    return Buffer.from(base64, "base64");
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// Composites the client's real logo onto the bottom-right of the generated
// image. AI image models cannot reliably reproduce an exact logo from a text
// description, so instead the model is instructed to leave clean negative
// space in that corner, and we paste the actual logo pixels on top here.
async function compositeLogo(baseImage: Buffer, logoUrl: string): Promise<Buffer> {
  const { default: sharp } = await import("sharp");
  const base = sharp(baseImage);
  const { width = 1024, height = 1024 } = await base.metadata();

  const badgeSize = Math.round(width * 0.16);
  const margin = Math.round(width * 0.035);

  const logoBuffer = await fetchImageBuffer(logoUrl);
  const resizedLogo = await sharp(logoBuffer)
    .resize(badgeSize - 16, badgeSize - 16, { fit: "inside", withoutEnlargement: true })
    .toBuffer();
  const logoMeta = await sharp(resizedLogo).metadata();
  const logoW = logoMeta.width ?? badgeSize - 16;
  const logoH = logoMeta.height ?? badgeSize - 16;

  // Rounded white badge behind the logo so it stays legible on any background
  const badgeSvg = `<svg width="${badgeSize}" height="${badgeSize}">
    <rect width="${badgeSize}" height="${badgeSize}" rx="${Math.round(badgeSize * 0.18)}" fill="white" fill-opacity="0.95"/>
  </svg>`;
  const badge = await sharp(Buffer.from(badgeSvg)).png().toBuffer();

  const composedBadge = await sharp(badge)
    .composite([
      {
        input: resizedLogo,
        top: Math.round((badgeSize - logoH) / 2),
        left: Math.round((badgeSize - logoW) / 2),
      },
    ])
    .toBuffer();

  return base
    .composite([
      {
        input: composedBadge,
        top: height - badgeSize - margin,
        left: width - badgeSize - margin,
      },
    ])
    .png()
    .toBuffer();
}

export async function generatePostImage(
  imagePrompt: string,
  postId: string,
  logoUrl?: string | null
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === "add_later") {
    console.log("[Image] OpenAI API key not configured");
    return null;
  }

  try {
    console.log("[Image] Generating with OpenAI gpt-image-1 for post:", postId);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90_000);

    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024",
        output_format: "png",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      console.error("[Image] OpenAI error:", res.status, errText);
      return null;
    }

    const data = (await res.json()) as {
      data?: Array<{ b64_json?: string; url?: string }>;
    };

    const b64 = data.data?.[0]?.b64_json;
    if (!b64) {
      console.error("[Image] OpenAI returned no image data");
      return null;
    }

    let buffer = Buffer.from(b64, "base64");
    console.log("[Image] Generated", buffer.length, "bytes");

    if (logoUrl) {
      try {
        buffer = Buffer.from(await compositeLogo(buffer, logoUrl));
        console.log("[Image] Logo composited onto generated image");
      } catch (logoErr) {
        console.warn("[Image] Logo compositing failed, using image without logo:", logoErr);
      }
    }

    // Upload to freeimage.host CDN for a permanent URL
    try {
      const form = new FormData();
      form.append("source", new Blob([buffer], { type: "image/png" }), `${postId}.png`);
      form.append("type", "file");

      const uploadController = new AbortController();
      const tid = setTimeout(() => uploadController.abort(), 20_000);
      const uploadRes = await fetch(
        "https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5",
        { method: "POST", body: form, signal: uploadController.signal }
      );
      clearTimeout(tid);

      if (uploadRes.ok) {
        const uploadData = (await uploadRes.json()) as {
          image?: { url?: { full?: string }; display_url?: string };
        };
        const url = uploadData?.image?.url?.full ?? uploadData?.image?.display_url;
        if (url) {
          console.log("[Image] Uploaded to CDN:", url);
          return url;
        }
      }
      console.warn("[Image] CDN upload failed, using base64 fallback");
    } catch (uploadErr) {
      console.warn("[Image] CDN upload error:", uploadErr);
    }

    // Fallback: base64 data URL stored in DB
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch (err: any) {
    console.error("[Image] Error:", err?.message ?? err);
    return null;
  }
}
