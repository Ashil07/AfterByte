/**
 * Best-effort, in-memory sliding-window limiter. It only protects a single
 * server instance (on serverless hosts each instance has its own memory), which
 * is enough to stop casual abuse of a contact form. Swap for a shared store if
 * the site ever needs stronger guarantees.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60_000, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5_000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return true;
}

export function resetRateLimit() {
  hits.clear();
}
