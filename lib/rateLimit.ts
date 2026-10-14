// Limits failed admin logins per IP so the password can't be guessed by
// trying thousands of times. Uses the same Upstash Redis as the site data in
// production (shared across all Vercel instances); falls back to memory locally.

const MAX_FAILURES = 5;
const WINDOW_SECONDS = 15 * 60;

const hasKv = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);
const memory = new Map<string, { count: number; resetAt: number }>();

async function redis() {
  const { Redis } = await import("@upstash/redis");
  return Redis.fromEnv();
}

const keyFor = (ip: string) => `login-fail:${ip}`;

/** Seconds until this IP may try again, or 0 if it isn't blocked. */
export async function loginBlockedFor(ip: string): Promise<number> {
  if (hasKv) {
    const r = await redis();
    const count = (await r.get<number>(keyFor(ip))) ?? 0;
    if (count < MAX_FAILURES) return 0;
    const ttl = await r.ttl(keyFor(ip));
    return ttl > 0 ? ttl : WINDOW_SECONDS;
  }
  const entry = memory.get(ip);
  if (!entry || Date.now() > entry.resetAt) return 0;
  return entry.count >= MAX_FAILURES ? Math.ceil((entry.resetAt - Date.now()) / 1000) : 0;
}

export async function recordLoginFailure(ip: string): Promise<void> {
  if (hasKv) {
    const r = await redis();
    const count = await r.incr(keyFor(ip));
    if (count === 1) await r.expire(keyFor(ip), WINDOW_SECONDS);
    return;
  }
  const entry = memory.get(ip);
  if (!entry || Date.now() > entry.resetAt) {
    memory.set(ip, { count: 1, resetAt: Date.now() + WINDOW_SECONDS * 1000 });
  } else {
    entry.count += 1;
  }
}

export async function clearLoginFailures(ip: string): Promise<void> {
  if (hasKv) {
    const r = await redis();
    await r.del(keyFor(ip));
    return;
  }
  memory.delete(ip);
}
