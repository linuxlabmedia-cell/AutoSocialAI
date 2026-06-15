"use server";

import bcrypt from "bcryptjs";
import { db } from "@autosocial/db";
import { getSession } from "./session";
import { redirect } from "next/navigation";

function makeSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 44);
  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function signUpAction(
  formData: FormData
): Promise<{ error?: string }> {
  const email =
    (formData.get("email") as string | null)?.toLowerCase().trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const fullName =
    (formData.get("fullName") as string | null)?.trim() ?? "";
  const workspaceName =
    (formData.get("workspaceName") as string | null)?.trim() ?? "";

  if (!email || !password || !fullName || !workspaceName) {
    return { error: "All fields are required" };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const slug = makeSlug(workspaceName);

  const org = await db.organization.create({
    data: { name: workspaceName, slug },
  });

  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      fullName: fullName || null,
      organizationId: org.id,
      role: "AGENCY_OWNER",
    },
  });

  const session = await getSession();
  session.isLoggedIn = true;
  session.userId = user.id;
  session.organizationId = org.id;
  session.email = user.email;
  session.fullName = user.fullName ?? null;
  session.role = user.role as string;
  await session.save();

  return {};
}

export async function signInAction(
  formData: FormData
): Promise<{ error?: string }> {
  const email =
    (formData.get("email") as string | null)?.toLowerCase().trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await db.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    return { error: "Invalid email or password" };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password" };
  }

  const session = await getSession();
  session.isLoggedIn = true;
  session.userId = user.id;
  session.organizationId = user.organizationId;
  session.email = user.email;
  session.fullName = user.fullName ?? null;
  session.role = user.role as string;
  await session.save();

  return {};
}

export async function signOutAction(): Promise<void> {
  const session = await getSession();
  await session.destroy();
  redirect("/sign-in");
}
