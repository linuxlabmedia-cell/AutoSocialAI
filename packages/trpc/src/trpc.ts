import { initTRPC, TRPCError } from "@trpc/server";
import { db } from "@autosocial/db";
import { type User } from "@autosocial/db";
import { serialize, deserialize } from "superjson";
import { ZodError } from "zod";

export type Context = {
  userId: string | null;
  organizationId: string | null;
  user: User | null;
  db: typeof db;
};

export const createTRPCContext = (opts: {
  userId: string | null;
  organizationId: string | null;
  user?: User | null;
}): Context => {
  return {
    userId: opts.userId,
    organizationId: opts.organizationId,
    user: opts.user ?? null,
    db,
  };
};

const t = initTRPC.context<Context>().create({
  transformer: { input: { serialize, deserialize }, output: { serialize, deserialize } },
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.userId || !ctx.organizationId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
      organizationId: ctx.organizationId,
      user: ctx.user!,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceAuth);

const enforceAdmin = enforceAuth.unstable_pipe(({ ctx, next }) => {
  if (ctx.user?.role !== "ADMIN" && ctx.user?.role !== "AGENCY_OWNER") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});

export const adminProcedure = t.procedure.use(enforceAdmin);
