import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const isImage = file.type.startsWith("image/");

  if (isImage) {
    // Upload images to freeimage.host CDN
    try {
      const form = new FormData();
      form.append("source", new Blob([buffer], { type: file.type }), file.name);
      form.append("type", "file");

      const uploadRes = await fetch(
        "https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5",
        { method: "POST", body: form }
      );

      if (uploadRes.ok) {
        const data = (await uploadRes.json()) as {
          image?: { url?: { full?: string }; display_url?: string };
        };
        const url = data?.image?.url?.full ?? data?.image?.display_url;
        if (url) {
          return NextResponse.json({ url, mimeType: file.type, fileSize: file.size });
        }
      }
    } catch {
      // fall through to base64
    }
  }

  // Fallback: return base64 data URL (works for all file types)
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;
  return NextResponse.json({ url: dataUrl, mimeType: file.type, fileSize: file.size });
}
