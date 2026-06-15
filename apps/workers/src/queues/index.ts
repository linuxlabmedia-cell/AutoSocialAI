import { Queue } from "bullmq";
import IORedis from "ioredis";

export const redis = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const defaultJobOptions = {
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 50 },
  attempts: 3,
  backoff: { type: "exponential" as const, delay: 5000 },
};

export const contentQueue = new Queue("content-generation", {
  connection: redis,
  defaultJobOptions,
});

export const imageQueue = new Queue("image-generation", {
  connection: redis,
  defaultJobOptions: { ...defaultJobOptions, attempts: 2 },
});

export const validateQueue = new Queue("quality-validation", {
  connection: redis,
  defaultJobOptions,
});

export const publishQueue = new Queue("publishing", {
  connection: redis,
  defaultJobOptions: { ...defaultJobOptions, attempts: 3, backoff: { type: "exponential", delay: 60000 } },
});

export const analyticsQueue = new Queue("analytics-sync", {
  connection: redis,
  defaultJobOptions: { ...defaultJobOptions, attempts: 2 },
});
