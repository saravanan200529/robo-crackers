import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const isProduction = process.env.NODE_ENV === 'production';
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

// Production safety safeguard: Fail loudly at runtime in production if Redis credentials are missing
if (isProduction && !isBuildTime && (!upstashUrl || !upstashToken)) {
  throw new Error(
    'CRITICAL SECURITY ERROR: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be configured in production to enforce distributed rate-limiting on public endpoints.'
  );
}

// In-memory sliding window fallback for local development only
class DevMemoryRatelimit {
  private windowMs: number;
  private maxRequests: number;
  private hits: Map<string, number[]> = new Map();

  constructor({ maxRequests, windowMs }: { maxRequests: number; windowMs: number }) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async limit(identifier: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    // Fail loudly if ever invoked at runtime in production without Redis credentials
    if (isProduction && (!upstashUrl || !upstashToken)) {
      throw new Error(
        'CRITICAL SECURITY ERROR: Distributed rate limiting requires valid UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in production.'
      );
    }

    const now = Date.now();
    const timestamps = this.hits.get(identifier) || [];
    const validTimestamps = timestamps.filter((t) => now - t < this.windowMs);

    if (validTimestamps.length >= this.maxRequests) {
      const reset = Math.ceil((validTimestamps[0] + this.windowMs - now) / 1000);
      return { success: false, limit: this.maxRequests, remaining: 0, reset };
    }

    validTimestamps.push(now);
    this.hits.set(identifier, validTimestamps);
    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - validTimestamps.length,
      reset: Math.ceil(this.windowMs / 1000),
    };
  }
}

export const redis = upstashUrl && upstashToken ? new Redis({ url: upstashUrl, token: upstashToken }) : null;

// Enquiry rate limiter: 5 submissions per minute per IP
export const enquiryRatelimit =
  redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '60 s'),
        prefix: 'ratelimit:enquiry',
      })
    : new DevMemoryRatelimit({ maxRequests: 5, windowMs: 60 * 1000 });

// Admin login rate limiter: 5 attempts per 15 minutes per IP
export const loginRatelimit =
  redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '900 s'),
        prefix: 'ratelimit:login',
      })
    : new DevMemoryRatelimit({ maxRequests: 5, windowMs: 15 * 60 * 1000 });
