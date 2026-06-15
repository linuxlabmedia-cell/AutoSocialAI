"use server";

import { db } from "@autosocial/db";
import { getSession } from "@/lib/session";

function makeSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 44);
  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function createWorkspace(
  name: string
): Promise<{ orgId: string }> {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId) {
    throw new Error("Not authenticated");
  }

  const slug = makeSlug(name);

  const org = await db.organization.create({
    data: { name, slug },
  });

  await db.user.update({
    where: { id: session.userId },
    data: { organizationId: org.id },
  });

  session.organizationId = org.id;
  await session.save();

  return { orgId: org.id };
}
