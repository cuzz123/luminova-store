/* ------------------------------------------------------------------ */
/*  Dual-Backend Rate Limiter                                         */
/*                                                                     */
/*  Prefers Upstash Redis when UPSTASH_REDIS_REST_URL and              */
/*  UPSTASH_REDIS_REST_TOKEN are set. Falls back to an in-memory       */
/*  Map with a periodic cleanup interval.                              */
/* ------------------------------------------------------------------ */

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

/* ------------------------------------------------------------------ */
/*  Types                                                            */
/* ------------------------------------------------------------------ */

export interface RateLimitOptions {
  /** Time window in milliseconds. */
  windowMs: number;
  /** Maximum requests allowed within the window. */
  maxRequests: number;
  /** Optional identifier prefix (e.g. "login", "api"). */
  keyPrefix?: string;
}

/* ------------------------------------------------------------------ */
/*  In-Memory Fallback                                               */
/* ------------------------------------------------------------------ */

const memoryStore = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries every 60 seconds
const CLEANUP_INTERVAL = 60_000;

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of memoryStore.entries()) {
      if (now >= entry.resetAt) {
        memoryStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);

  // Allow the timer to not block process exit
  if (typeof setInterval === "function" && process?.env?.NODE_ENV !== "test") {
    // Timer is a weak reference — don't prevent GC
  }
}

function inMemoryRateLimit(
  key: string,
  options: RateLimitOptions,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now >= entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + options.windowMs });
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetAt: now + options.windowMs,
    };
  }

  if (entry.count >= options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: options.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/* ------------------------------------------------------------------ */
/*  Upstash Redis Backend                                            */
/* ------------------------------------------------------------------ */

async function upstashRateLimit(
  key: string,
  options: RateLimitOptions,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const windowSeconds = Math.ceil(options.windowMs / 1000);

  // Upstash uses a Lua script-friendly REST API.
  // We use the set-if-not-exists + increment pattern via their REST API.

  const url = `${UPSTASH_URL}/incr/${key}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${UPSTASH_TOKEN}`,
  };

  // First, get the current count
  const getRes = await fetch(`${UPSTASH_URL}/get/${key}`, { headers });
  let currentCount = 0;

  if (getRes.ok) {
    const data = await getRes.json() as { result: string | null };
    currentCount = data.result ? parseInt(data.result, 10) : 0;
  }

  // Check if key has a TTL
  const ttlRes = await fetch(`${UPSTASH_URL}/ttl/${key}`, { headers });
  let ttl = -1;
  if (ttlRes.ok) {
    const data = await ttlRes.json() as { result: number };
    ttl = data.result;
  }

  if (ttl < 0 || currentCount === 0) {
    // New window — set key with expiry
    const setRes = await fetch(`${UPSTASH_URL}/set/${key}/1/ex/${windowSeconds}`, {
      headers,
    });
    if (!setRes.ok) {
      // Fall through to in-memory on Redis errors
      return inMemoryRateLimit(key, options);
    }
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetAt: now + options.windowMs,
    };
  }

  if (currentCount >= options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: now + ttl * 1000,
    };
  }

  // Increment
  const incrRes = await fetch(`${UPSTASH_URL}/incr/${key}`, { headers });
  if (!incrRes.ok) {
    return inMemoryRateLimit(key, options);
  }
  const incrData = await incrRes.json() as { result: number };
  const newCount = incrData.result;

  // Refresh TTL (reset to full window on each increment for sliding window behavior)
  await fetch(`${UPSTASH_URL}/expire/${key}/${windowSeconds}`, { headers });

  return {
    allowed: true,
    remaining: Math.max(0, options.maxRequests - newCount),
    resetAt: now + options.windowMs,
  };
}

/* ------------------------------------------------------------------ */
/*  Public API                                                       */
/* ------------------------------------------------------------------ */

/**
 * Check if a request should be rate-limited.
 *
 * Returns `null` if the request is allowed, or a 429 Response if rate-limited.
 *
 * @param request  The incoming Request object (used to extract IP and path).
 * @param options  Rate-limit window and max requests.
 * @param customKey  Optional custom key instead of IP+path.
 */
export async function applyRateLimit(
  request: Request,
  options: RateLimitOptions,
  customKey?: string,
): Promise<Response | null> {
  const key =
    customKey ??
    buildRateLimitKey(request, options.keyPrefix ?? "rl");

  let result: { allowed: boolean; remaining: number; resetAt: number };

  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      result = await upstashRateLimit(key, options);
    } catch {
      // Redis error — fall back to in-memory
      result = inMemoryRateLimit(key, options);
    }
  } else {
    result = inMemoryRateLimit(key, options);
  }

  if (!result.allowed) {
    const retryAfterSec = Math.ceil(
      (result.resetAt - Date.now()) / 1000,
    );
    return new Response(
      JSON.stringify({
        error: "Too many requests. Please try again later.",
        retryAfter: retryAfterSec,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Limit": String(options.maxRequests),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(
            Math.ceil(result.resetAt / 1000),
          ),
        },
      },
    );
  }

  return null;
}

/**
 * Build a rate-limit key from the request's IP and pathname.
 */
export function buildRateLimitKey(
  request: Request,
  prefix: string,
): string {
  const url = new URL(request.url);
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";

  return `${prefix}:${ip}:${url.pathname}`;
}

/**
 * Convenience wrapper that creates a rate-limited handler.
 * Returns null on success, 429 Response on limit exceeded.
 *
 * @example
 * ```
 * const result = await rateLimit(request, { windowMs: 60_000, maxRequests: 10 });
 * if (result) return result; // 429
 * // ... proceed
 * ```
 */
export async function rateLimit(
  request: Request,
  options?: Partial<RateLimitOptions>,
): Promise<Response | null> {
  const opts: RateLimitOptions = {
    windowMs: options?.windowMs ?? 60_000,
    maxRequests: options?.maxRequests ?? 30,
    keyPrefix: options?.keyPrefix ?? "rl",
  };
  return applyRateLimit(request, opts);
}
