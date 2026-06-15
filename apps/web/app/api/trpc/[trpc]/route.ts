import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { appRouter, createTRPCContext } from "@autosocial/trpc";
import { db } from "@autosocial/db";
import { getSession } from "@/lib/session";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      const session = await getSession();

      if (!session.isLoggedIn || !session.userId) {
        return createTRPCContext({ userId: null, organizationId: null });
      }

      const user = await db.user.findUnique({ where: { id: session.userId } });

      return createTRPCContext({
        userId: session.userId,
        organizationId: session.organizationId ?? null,
        user: user ?? null,
      });
    },
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(`tRPC error on ${path ?? "<no-path>"}:`, error);
          }
        : undefined,
  });

export { handler as GET, handler as POST };
