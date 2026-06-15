export async function generatePostImage(
  imagePrompt: string,
  postId: string
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

    const buffer = Buffer.from(b64, "base64");
    console.log("[Image] Generated", buffer.length, "bytes");

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
    return `data:image/png;base64,${b64}`;
  } catch (err: any) {
    console.error("[Image] Error:", err?.message ?? err);
    return null;
  }
}
