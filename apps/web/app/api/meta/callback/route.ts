import { NextRequest, NextResponse } from "next/server";
import { db } from "@autosocial/db";
import { encrypt } from "@/lib/crypto";

const META_GRAPH = "https://graph.facebook.com/v19.0";
const APP_BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const REDIRECT_BASE = process.env.META_REDIRECT_BASE ?? APP_BASE;

function redirectError(clientId: string | null, reason: string) {
  const base = clientId ? `${APP_BASE}/clients/${clientId}/social` : `${APP_BASE}/clients`;
  return NextResponse.redirect(`${base}?meta_error=${encodeURIComponent(reason)}`);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const stateRaw = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDesc = searchParams.get("error_description");

  if (error) {
    console.error("[Meta OAuth] Error from Facebook:", error, errorDesc);
    return redirectError(null, errorDesc ?? error);
  }

  if (!code || !stateRaw) {
    return redirectError(null, "missing_code_or_state");
  }

  let clientId: string;
  try {
    const state = JSON.parse(Buffer.from(stateRaw, "base64").toString("utf8"));
    clientId = state.clientId;
    if (!clientId) throw new Error("No clientId in state");
  } catch {
    return redirectError(null, "invalid_state");
  }

  // Exchange code for short-lived user token
  const callbackUrl = `${REDIRECT_BASE}/api/meta/callback`;
  let shortToken: string;
  try {
    const tokenRes = await fetch(
      `${META_GRAPH}/oauth/access_token?client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&code=${code}&redirect_uri=${encodeURIComponent(callbackUrl)}`
    );
    const tokenData = await tokenRes.json() as { access_token?: string; error?: { message: string } };
    if (!tokenData.access_token) {
      console.error("[Meta OAuth] Token exchange failed:", tokenData.error);
      return redirectError(clientId, tokenData.error?.message ?? "token_exchange_failed");
    }
    shortToken = tokenData.access_token;
  } catch (err) {
    console.error("[Meta OAuth] Token exchange network error:", err);
    return redirectError(clientId, "network_error");
  }

  // Exchange for long-lived token (60 days)
  let longToken = shortToken;
  let expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
  try {
    const llRes = await fetch(
      `${META_GRAPH}/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${shortToken}`
    );
    const llData = await llRes.json() as { access_token?: string; expires_in?: number };
    if (llData.access_token) {
      longToken = llData.access_token;
      if (llData.expires_in) expiresAt = new Date(Date.now() + llData.expires_in * 1000);
    }
  } catch (err) {
    console.warn("[Meta OAuth] Long-lived token exchange failed, using short-lived:", err);
  }

  // Fetch user's Facebook Pages
  let pagesData: Array<{ id: string; name: string; access_token: string; instagram_business_account?: { id: string } }> = [];
  try {
    const pagesRes = await fetch(
      `${META_GRAPH}/me/accounts?access_token=${longToken}&fields=id,name,access_token,instagram_business_account`
    );
    const raw = await pagesRes.json() as { data?: typeof pagesData; error?: { message: string } };
    console.log("[Meta OAuth] /me/accounts raw response:", JSON.stringify(raw));
    if (raw.error) {
      console.error("[Meta OAuth] Pages fetch error:", raw.error);
      return redirectError(clientId, raw.error.message);
    }
    pagesData = raw.data ?? [];
  } catch (err) {
    console.error("[Meta OAuth] Pages network error:", err);
    return redirectError(clientId, "pages_fetch_failed");
  }

  if (pagesData.length === 0) {
    // Fetch identity + granted permissions to surface in the error
    let debugInfo = "";
    try {
      const meRes = await fetch(`${META_GRAPH}/me?access_token=${longToken}&fields=id,name`);
      const me = await meRes.json() as { id?: string; name?: string };
      const permRes = await fetch(`${META_GRAPH}/me/permissions?access_token=${longToken}`);
      const perms = await permRes.json() as { data?: Array<{ permission: string; status: string }> };
      const granted = perms.data?.filter(p => p.status === "granted").map(p => p.permission).join(",") ?? "unknown";
      debugInfo = ` | FB user: ${me.name} (${me.id}) | permissions: ${granted}`;
    } catch { /* ignore */ }
    return redirectError(clientId, `no_pages_found${debugInfo}`);
  }

  // Persist each page and linked Instagram account
  for (const page of pagesData) {
    try {
      const encryptedPageToken = encrypt(page.access_token);

      await db.clientSocialAccount.upsert({
        where: { clientId_platform_platformAccountId: { clientId, platform: "FACEBOOK", platformAccountId: page.id } },
        update: { accountName: page.name, accessToken: encryptedPageToken, accessTokenExpiresAt: expiresAt, isConnected: true, lastTokenRefresh: new Date() },
        create: { clientId, platform: "FACEBOOK", platformAccountId: page.id, accountName: page.name, accountType: "page", accessToken: encryptedPageToken, accessTokenExpiresAt: expiresAt, isConnected: true },
      });

      // Link Instagram Business Account if connected to this page
      if (page.instagram_business_account?.id) {
        const igId = page.instagram_business_account.id;
        try {
          const igRes = await fetch(`${META_GRAPH}/${igId}?fields=name,username&access_token=${page.access_token}`);
          const igData = await igRes.json() as { name?: string; username?: string };
          const encryptedIgToken = encrypt(page.access_token);

          await db.clientSocialAccount.upsert({
            where: { clientId_platform_platformAccountId: { clientId, platform: "INSTAGRAM", platformAccountId: igId } },
            update: { accountName: igData.username ?? igData.name ?? "Instagram", accessToken: encryptedIgToken, accessTokenExpiresAt: expiresAt, isConnected: true, lastTokenRefresh: new Date() },
            create: { clientId, platform: "INSTAGRAM", platformAccountId: igId, accountName: igData.username ?? igData.name ?? "Instagram", accountType: "business", accessToken: encryptedIgToken, accessTokenExpiresAt: expiresAt, isConnected: true },
          });
        } catch (igErr) {
          console.warn("[Meta OAuth] Instagram account fetch failed for page", page.id, igErr);
        }
      }
    } catch (dbErr) {
      console.error("[Meta OAuth] DB error saving page", page.id, dbErr);
    }
  }

  return NextResponse.redirect(`${APP_BASE}/clients/${clientId}/social?meta_connected=true`);
}
