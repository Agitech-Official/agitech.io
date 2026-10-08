// Checks a deployed copy of the site (a Vercel preview before the switch, production after it):
// redirects, trailing slash, 404, robots / sitemap, noindex, headers, the two functions, feeds, GTM.
//   node scripts/check-deploy.mjs <base-url> [--indexable] [--gtm GTM-XXXX] [--skip-functions]
//   npm run check:deploy -- https://agitech-xxxx.vercel.app
// --indexable        the site is meant to be indexed (production after go-live); without it, everything must be noindex
// --gtm GTM-XXXX     the container that must be loaded; without it, no Tag Manager must be loaded (previews)
// --skip-functions   do not test /api/send-estimate and /keystatic (not emulated by scripts/serve-build.mjs)
// Nothing is sent to WordPress, Formspree or the estimator: the API is only called with a foreign Origin, which it refuses.
import fs from 'node:fs';
import { follow as expectedChain } from './lib/redirects.mjs';

const args = process.argv.slice(2);
const base = args.find((a) => /^https?:\/\//.test(a))?.replace(/\/$/, '');
if (!base) { console.error('Usage: node scripts/check-deploy.mjs <base-url> [--indexable] [--gtm GTM-XXXX] [--skip-functions]'); process.exit(2); }
const indexable = args.includes('--indexable');
const gtm = args.includes('--gtm') ? args[args.indexOf('--gtm') + 1] : '';
const skipFunctions = args.includes('--skip-functions');
const host = new URL(base).host;

const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok, detail });
const get = (p, init = {}) => fetch(base + p, { redirect: 'manual', ...init });

/** Follows redirects by hand: the list of {path, status} a browser would go through. */
async function chain(p, init = {}) {
  const hops = [];
  let cur = p, res;
  for (let i = 0; i < 6; i++) {
    res = await get(cur, init);
    hops.push({ path: cur, status: res.status });
    const loc = res.headers.get('location');
    if (![301, 302, 307, 308].includes(res.status) || !loc) break;
    const u = new URL(loc, base);
    cur = u.host === host || /agitech\.io$/.test(u.host) ? u.pathname + u.search : loc;
  }
  return { hops, res };
}

async function pool(items, size, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: size }, async () => { while (i < items.length) { const it = items[i++]; await fn(it); } }));
}

// 1. every URL of the old WordPress site ends where vercel.json says, in few hops, on a 200
const DROPPED = new Set(['/locations.kml']);
const urls = fs.readFileSync('scripts/wp-urls.txt', 'utf8').split('\n').filter((u) => u && !DROPPED.has(u));
const bad = [];
await pool(urls, 8, async (u) => {
  const want = expectedChain(u);
  const { hops } = await chain(u);
  const last = hops.at(-1);
  const wantPath = want.at(-1);
  if (last.status !== 200) bad.push(`${u} -> ${last.path} answers ${last.status}`);
  else if (last.path.split('?')[0] !== wantPath) bad.push(`${u} ends on ${last.path}, expected ${wantPath}`);
  else if (hops.length > 3) bad.push(`${u} takes ${hops.length - 1} hops`);
  else if (hops.slice(0, -1).some((h) => ![301, 308].includes(h.status))) bad.push(`${u} uses a non-permanent redirect`);
});
check(`${urls.length} old WordPress URLs end on the right page`, bad.length === 0, bad.slice(0, 6).join('\n    '));

// 2. trailing slash and 404
const slash = await chain('/blog');
check('/blog redirects to /blog/ (permanent)', slash.hops.length === 2 && [301, 308].includes(slash.hops[0].status) && slash.hops[1].path === '/blog/' && slash.hops[1].status === 200, JSON.stringify(slash.hops));
const nf = await get('/page-qui-nexiste-pas-xyz/');
const nfBody = await nf.text();
check('unknown URL answers 404 with a noindex page', nf.status === 404 && /noindex/.test(nfBody), `status ${nf.status}`);

// 3. robots.txt, sitemap
const robots = await (await get('/robots.txt')).text();
check(indexable ? 'robots.txt allows crawling and lists the sitemap' : 'robots.txt blocks everything (preview)', indexable ? /Sitemap: https:\/\/agitech\.io\/sitemap\.xml/.test(robots) && !/Disallow: \/\n/.test(robots) : /Disallow: \/\n/.test(robots), robots.split('\n').slice(0, 3).join(' | '));
const sm = await get('/sitemap.xml');
const smXml = await sm.text();
const locs = [...smXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
check('sitemap.xml answers 200 and lists pages', sm.status === 200 && locs.length > 200, `${sm.status}, ${locs.length} URLs`);
const smBad = [];
await pool(locs, 8, async (p) => { const r = await get(p); if (r.status !== 200) smBad.push(`${p} ${r.status}`); });
check('every sitemap URL answers 200', smBad.length === 0, smBad.slice(0, 5).join(', '));

// 4. indexing signals
const home = await (await get('/')).text();
const robotsMeta = home.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? '';
check(indexable ? 'home page is indexable' : 'home page is noindex (preview)', indexable ? /\bindex\b/.test(robotsMeta) && !/noindex/.test(robotsMeta) : /noindex/.test(robotsMeta), robotsMeta);
const ty = [];
for (const p of ['/merci-formulaire/', '/merci-rdv/', '/en/thank-you-form/', '/en/thank-you-meeting/']) { const b = await (await get(p)).text(); if (!/noindex/.test(b.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? '')) ty.push(p); }
check('thank-you pages are noindex', ty.length === 0, ty.join(', '));
check('canonical of the home page is https://agitech.io/', /<link rel="canonical" href="https:\/\/agitech\.io\/">/.test(home));
check(gtm ? `Tag Manager ${gtm} is loaded` : 'no Tag Manager on this deployment', gtm ? home.includes(gtm) : !/googletagmanager/.test(home));

// 5. headers
const h = (await get('/')).headers;
check('security headers on pages', h.get('x-content-type-options') === 'nosniff' && !!h.get('x-frame-options') && !!h.get('referrer-policy'), `nosniff=${h.get('x-content-type-options')} frame=${h.get('x-frame-options')}`);
const font = (await get('/wp-theme/fonts/DMSans-Bold.woff2')).headers.get('cache-control') ?? '';
check('fonts are cached for a year', /max-age=31536000/.test(font) && /immutable/.test(font), font);

// 6. feeds
const feed = await get('/feed.xml');
check('/feed.xml is an RSS feed', feed.status === 200 && /rss|xml/.test(feed.headers.get('content-type') ?? ''), `${feed.status} ${feed.headers.get('content-type')}`);
const oldFeed = await chain('/feed/');
check('/feed/ (WordPress) redirects to /feed.xml', oldFeed.hops.at(-1).path === '/feed.xml' && oldFeed.hops.at(-1).status === 200, JSON.stringify(oldFeed.hops));

// 7. functions (only on a real Vercel deployment)
if (!skipFunctions) {
  const api = await chain('/api/send-estimate', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example' }, body: '{}' });
  check('estimator refuses a foreign Origin (403), through the trailing-slash redirect', api.hops.at(-1).status === 403, JSON.stringify(api.hops));
  const apiH = (await get('/api/send-estimate/', { method: 'POST', headers: { Origin: 'https://evil.example' }, body: '{}' })).headers;
  check('/api answers X-Robots-Tag noindex', /noindex/.test(apiH.get('x-robots-tag') ?? ''));
  const ks = await chain('/keystatic');
  check('/keystatic opens (the editor page)', ks.hops.at(-1).status === 200, JSON.stringify(ks.hops));
}

let failed = 0;
for (const r of results) { if (!r.ok) failed++; console.log(`${r.ok ? '✓' : '✗'} ${r.name}${!r.ok && r.detail ? `\n    ${r.detail}` : ''}`); }
console.log(`\n${results.length - failed}/${results.length} checks passed against ${base}`);
process.exit(failed ? 1 : 0);
