import "dotenv/config";
import { createServer } from "http";
import { startContentWorker } from "./workers/contentWorker";
import { startImageWorker } from "./workers/imageWorker";
import { startValidateWorker } from "./workers/validateWorker";
import { startPublishWorker } from "./workers/publishWorker";
import { startAnalyticsWorker } from "./workers/analyticsWorker";
import {
  startPostScheduler,
  startContentScheduler,
  startAnalyticsScheduler,
  startTokenRefreshScheduler,
} from "./schedulers/postScheduler";

console.log("🚀 AutoSocial AI Workers starting...");

// Railway requires an HTTP healthcheck response — this process has no web
// server otherwise, so expose a trivial one just to satisfy the platform.
const PORT = process.env.PORT ?? 3001;
createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("ok");
}).listen(PORT, () => {
  console.log(`[Healthcheck] Listening on port ${PORT}`);
});

// Start all workers
const workers = [
  startContentWorker(),
  startImageWorker(),
  startValidateWorker(),
  startPublishWorker(),
  startAnalyticsWorker(),
];

// Start schedulers
startPostScheduler();
startContentScheduler();
startAnalyticsScheduler();
startTokenRefreshScheduler();

console.log("✅ All workers and schedulers running");
console.log("   Workers: content, image, validate, publish, analytics");
console.log("   Schedulers: post-publisher (1min), content-gen (11pm), analytics-sync (2am), token-refresh (3am)");

// Graceful shutdown
async function shutdown(signal: string) {
  console.log(`\n[Shutdown] Received ${signal}, shutting down gracefully...`);

  await Promise.all(workers.map((w) => w.close()));
  console.log("[Shutdown] All workers stopped. Bye!");
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Keep alive
process.on("uncaughtException", (err) => {
  console.error("[UncaughtException]", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("[UnhandledRejection]", reason);
});
