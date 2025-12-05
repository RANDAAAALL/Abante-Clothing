import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit"; 

// redis instance
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// it allows 5 requests per 30 seconds only
export const AuthRateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "30 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});



