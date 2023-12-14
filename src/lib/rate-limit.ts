import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export const ratelimitInstance = new Ratelimit({
  redis: Redis.fromEnv(),
  analytics: true,
  limiter: Ratelimit.slidingWindow(2, "5s"),
});

export const rateLimit = async (identifier: string) => {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  )
    return;

  const limit = await ratelimitInstance.limit(identifier ?? "anonymous");

  if (!limit?.success) {
    return NextResponse.json(limit, { status: 429 });
  }
};
