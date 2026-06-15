import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  userId?: string;
  organizationId?: string;
  email?: string;
  fullName?: string | null;
  role?: string;
  isLoggedIn?: boolean;
}

export const SESSION_OPTIONS = {
  password:
    process.env.SESSION_SECRET ?? "autosocial-ai-dev-secret-32-chars!!",
  cookieName: "autosocial_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30,
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(cookies(), SESSION_OPTIONS);
}
