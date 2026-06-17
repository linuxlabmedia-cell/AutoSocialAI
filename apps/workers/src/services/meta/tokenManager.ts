import { db } from "@autosocial/db";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const META_GRAPH = "https://graph.facebook.com/v19.0";
const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.ENCRYPTION_KEY ?? "00000000000000000000000000000000", "utf8").subarray(0, 32);

function decryptToken(data: string): string {
  const [ivHex, tagHex, encHex] = data.split(":");
  const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(ivHex!, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex!, "hex"));
  return Buffer.concat([decipher.update(Buffer.from(encHex!, "hex")), decipher.final()]).toString("utf8");
}

function encryptToken(text: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${cipher.getAuthTag().toString("hex")}:${encrypted.toString("hex")}`;
}

export async function getValidToken(socialAccountId: string): Promise<string> {
  const account = await db.clientSocialAccount.findUnique({
    where: { id: socialAccountId },
  });

  if (!account) throw new Error(`Social account ${socialAccountId} not found`);
  if (!account.isConnected) throw new Error(`Social account ${socialAccountId} is not connected`);

  // Check if token expires within 7 days
  const expiresAt = account.accessTokenExpiresAt;
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  if (expiresAt && expiresAt < sevenDaysFromNow) {
    try {
      const newToken = await refreshLongLivedToken(decryptToken(account.accessToken));
      const encryptedNew = encryptToken(newToken.token);

      await db.clientSocialAccount.update({
        where: { id: socialAccountId },
        data: {
          accessToken: encryptedNew,
          accessTokenExpiresAt: new Date(Date.now() + newToken.expiresIn * 1000),
          lastTokenRefresh: new Date(),
        },
      });

      return newToken.token;
    } catch (err) {
      console.error(`Failed to refresh token for account ${socialAccountId}:`, err);
      // Return existing token if refresh fails — it might still work
    }
  }

  return decryptToken(account.accessToken);
}

async function refreshLongLivedToken(currentToken: string): Promise<{ token: string; expiresIn: number }> {
  const res = await fetch(
    `${META_GRAPH}/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${currentToken}`
  );

  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);

  const data = await res.json() as { access_token: string; expires_in: number };
  return { token: data.access_token, expiresIn: data.expires_in };
}

export async function validateToken(token: string): Promise<{ isValid: boolean; scopes: string[] }> {
  const appToken = `${process.env.META_APP_ID}|${process.env.META_APP_SECRET}`;
  const res = await fetch(
    `${META_GRAPH}/debug_token?input_token=${token}&access_token=${appToken}`
  );
  const data = await res.json() as {
    data?: { is_valid: boolean; scopes?: string[]; error?: { message: string } };
  };

  return {
    isValid: data.data?.is_valid ?? false,
    scopes: data.data?.scopes ?? [],
  };
}

// Run daily to proactively refresh tokens expiring in 14 days
export async function refreshExpiringTokens() {
  const fourteenDaysFromNow = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const expiringAccounts = await db.clientSocialAccount.findMany({
    where: {
      isConnected: true,
      accessTokenExpiresAt: { lte: fourteenDaysFromNow },
    },
  });

  console.log(`[TokenManager] Found ${expiringAccounts.length} tokens to refresh`);

  for (const account of expiringAccounts) {
    try {
      await getValidToken(account.id);
      console.log(`[TokenManager] Refreshed token for account ${account.id}`);
    } catch (err) {
      console.error(`[TokenManager] Failed to refresh token for ${account.id}:`, err);
    }
  }
}
