import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.OPENAI_API_KEY;
  if (!key || key === "add_later") {
    return NextResponse.json({ error: "No OpenAI key configured" });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: "a professional photo of a red apple on a white background",
        n: 1,
        size: "1024x1024",
        quality: "standard",
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ success: false, status: res.status, error: errText.slice(0, 500) });
    }

    const data = await res.json() as { data: Array<{ url: string; revised_prompt?: string }> };
    const url = data.data[0]?.url;
    return NextResponse.json({ success: true, hasUrl: !!url, url: url?.slice(0, 80) + "..." });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) });
  }
}
