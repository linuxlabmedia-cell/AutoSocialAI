import { Queue } from "bullmq";
import IORedis from "ioredis";

let _redis: IORedis | null = null;
let _contentQueue: Queue | null = null;

function getRedis() {
  if (!_redis) {
    _redis = new IORedis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
      connectTimeout: 10000,
    });
  }
  return _redis;
}

export function getContentQueue() {
  if (!_contentQueue) {
    _contentQueue = new Queue("content-generation", {
      connection: getRedis(),
      defaultJobOptions: {
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
      },
    });
  }
  return _contentQueue;
}
