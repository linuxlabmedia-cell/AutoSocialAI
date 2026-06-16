const BASE = "https://app.ayrshare.com/api";

function authHeaders(profileKey?: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.AYRSHARE_API_KEY}`,
    ...(profileKey ? { "Profile-Key": profileKey } : {}),
  };
}

export async function createProfile(title: string): Promise<{ profileKey: string }> {
  const res = await fetch(`${BASE}/profiles/profile`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ title }),
  });
  return res.json() as Promise<{ profileKey: string }>;
}

export async function generateConnectUrl(profileKey: string, domain: string): Promise<{ url: string }> {
  const res = await fetch(`${BASE}/profiles/generateJWT`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ profileKey, domain }),
  });
  return res.json() as Promise<{ url: string }>;
}

export async function getProfileDetails(profileKey: string): Promise<{
  activeSocialAccounts: string[];
  displayNames?: Record<string, string>;
}> {
  const res = await fetch(`${BASE}/profiles`, {
    headers: authHeaders(profileKey),
  });
  return res.json() as Promise<{ activeSocialAccounts: string[]; displayNames?: Record<string, string> }>;
}

export async function publishPost(params: {
  profileKey: string;
  post: string;
  platforms: string[];
  mediaUrls?: string[];
  scheduleDate?: string;
}): Promise<{ status: string; id?: string; errors?: unknown[] }> {
  const res = await fetch(`${BASE}/post`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(params),
  });
  return res.json() as Promise<{ status: string; id?: string; errors?: unknown[] }>;
}

export async function deleteProfile(profileKey: string): Promise<void> {
  await fetch(`${BASE}/profiles/profile`, {
    method: "DELETE",
    headers: authHeaders(),
    body: JSON.stringify({ profileKey }),
  });
}
