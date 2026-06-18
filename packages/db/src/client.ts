import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function makeClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

// Invalidate the cached client if it was created before Industry/ServiceCategory were added
const cached = globalForPrisma.prisma;
const isStale = cached && !(cached as any).industry;
if (isStale) globalForPrisma.prisma = undefined;

export const db = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
