import { createTRPCRouter } from "./trpc";
import { clientsRouter } from "./routers/clients";
import { postsRouter } from "./routers/posts";
import { workflowsRouter } from "./routers/workflows";
import { analyticsRouter } from "./routers/analytics";
import { billingRouter } from "./routers/billing";
import { metaRouter } from "./routers/meta";
import { templatesRouter } from "./routers/templates";
import { assetsRouter } from "./routers/assets";

export const appRouter = createTRPCRouter({
  clients: clientsRouter,
  posts: postsRouter,
  workflows: workflowsRouter,
  analytics: analyticsRouter,
  billing: billingRouter,
  meta: metaRouter,
  templates: templatesRouter,
  assets: assetsRouter,
});

export type AppRouter = typeof appRouter;
