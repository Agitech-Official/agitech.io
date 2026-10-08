// Best-effort abuse guard for the public estimator endpoint. The counters live in the memory of one serverless
// instance, so this only slows down a single noisy client; the Vercel Firewall rate-limit rule described in
// docs/phase5-notes.md is the real protection.
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) { hits.set(key, recent); return true; }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v[v.length - 1] > windowMs) hits.delete(k);
  return false;
}

export const clientIp = (request: Request) =>
  request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

/** Browsers always send Origin on a cross-site POST: refuse one that is not this site. A missing Origin is let through. */
export function isForeignOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try { return new URL(origin).host !== new URL(request.url).host; } catch { return true; }
}
