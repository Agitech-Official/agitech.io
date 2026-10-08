// Vercel's redirect engine replayed locally: vercel.json is compiled with @vercel/routing-utils (the compiler Vercel
// itself uses), then a path is run through the resulting routes like a request would be. Shared by check-redirects
// and the parity tool.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const { getTransformedRoutes } = createRequire(import.meta.url)('@vercel/routing-utils');

export const STATIC_ROOT = path.resolve('.vercel/output/static');

const cfg = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const { routes, error } = getTransformedRoutes({ trailingSlash: cfg.trailingSlash, redirects: cfg.redirects, headers: cfg.headers });
if (error) throw new Error(`vercel.json does not compile: ${JSON.stringify(error)}`);

export const redirects = routes.filter((r) => r.headers?.Location && r.status).map((r) => ({ re: new RegExp(r.src), to: r.headers.Location, status: r.status, has: r.has }));
/** Header rules of vercel.json (security headers, cache, X-Robots-Tag): they apply on top of whatever serves the request. */
export const headerRoutes = routes.filter((r) => r.headers && !r.headers.Location && r.continue).map((r) => ({ re: new RegExp(r.src), headers: r.headers }));
const passthrough = routes.filter((r) => !r.headers && !r.handle).map((r) => new RegExp(r.src));

/** Is `p` a file or a directory with an index.html in the build output? */
export const served = (p) => {
  const f = path.join(STATIC_ROOT, decodeURIComponent(p));
  return fs.existsSync(f) && (fs.statSync(f).isFile() || fs.existsSync(path.join(f, 'index.html')));
};

/** One request on agitech.io: the first matching redirect wins, like Vercel. Returns the Location, or null. */
export const step = (p) => {
  if (passthrough.some((re) => re.test(p))) return null;
  for (const r of redirects) {
    if (r.has?.some((h) => h.type === 'host')) continue; // the www rule only applies on the www host
    const m = r.re.exec(p);
    if (m) return r.to.replace(/\$(\d)/g, (_, i) => m[i] ?? '');
  }
  return null;
};

/** The chain of paths a request goes through, first element = the requested path. */
export const follow = (p) => {
  const chain = [p];
  for (let i = 0; i < 5; i++) { const n = step(chain.at(-1).split('?')[0]); if (!n) break; chain.push(n); }
  return chain;
};
