import { Ratelimit } from "@upstash/ratelimit" // for deno: see above
import { Redis } from "@upstash/redis" // see below for cloudflare and fastly adapters

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  // Rate limit to 10 requests per 10 seconds
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "skateshop/ratelimit",
})
