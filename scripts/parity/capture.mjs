// Captures full-page screenshots and page metrics of WordPress and of the new site, so they can be compared.
//   node scripts/parity/capture.mjs [--site wp|astro|both] [--viewports d,m] [--only id,id] [--concurrency 4]
// Output: parity-data/<site>/<viewport>/<id>.png and .json. WORDPRESS IS CAPTURED ONCE: re-run with --site astro
// after each change, and keep parity-data/wp as the frozen reference (it stays usable after the DNS switch).
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import { chromium } from 'playwright-core';
import { OUT, BASES, VIEWPORTS, BLOCKED, MASK_CSS, NO_ANIMATION, loadPairs, deviations, WP_DEFECTS_CSS } from './config.mjs';

const arg = (name, dflt) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : dflt; };
const sites = arg('site', 'both') === 'both' ? ['wp', 'astro'] : [arg('site')];
const vps = arg('viewports', 'd,m').split(',');
const only = arg('only') ? arg('only').split(',') : null;
const concurrency = +arg('concurrency', 4);
const SEGMENT = 7000; // Chromium cannot screenshot a full page taller than ~16k px in one go

function browserPath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const dflt = chromium.executablePath();
  if (fs.existsSync(dflt)) return dflt;
  const cache = path.join(os.homedir(), '.cache/ms-playwright');
  const found = fs.existsSync(cache) ? fs.readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse() : [];
  for (const d of found) { const p = path.join(cache, d, 'chrome-linux64/chrome'); if (fs.existsSync(p)) return p; }
  throw new Error('No Chromium found. Run `npx playwright-core install chromium` or set CHROME_PATH.');
}

async function metrics(page) {
  return page.evaluate(() => {
    const visible = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.display !== 'none'; };
    const text = (e) => (e.innerText || '').replace(/\s+/g, ' ').trim();
    const meta = (sel, attr = 'content') => document.querySelector(sel)?.getAttribute(attr) ?? '';
    const imgs = [...document.images].filter(visible);
    return {
      title: document.title, description: meta('meta[name="description"]'), canonical: meta('link[rel="canonical"]', 'href'),
      robots: meta('meta[name="robots"]'), h1: [...document.querySelectorAll('h1')].filter(visible).map(text),
      scrollHeight: document.documentElement.scrollHeight, overflowX: document.documentElement.scrollWidth > innerWidth + 1,
      images: imgs.length, brokenImages: imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== 'lazy').length,
      bodyText: text(document.body).slice(0, 60000),
    };
  });
}

async function shoot(browser, site, id, url, vp, extraCss = '') {
  const dir = path.join(OUT, site, vp);
  fs.mkdirSync(dir, { recursive: true });
  const v = VIEWPORTS[vp];
  const ctx = await browser.newContext({ viewport: { width: v.width, height: v.height }, locale: 'fr-BE', deviceScaleFactor: 1, isMobile: v.mobile, hasTouch: v.mobile });
  await ctx.route('**/*', (r) => (BLOCKED.test(r.request().url()) ? r.abort() : r.continue()));
  const page = await ctx.newPage();
  try {
    const resp = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {});
    await page.addStyleTag({ content: `${NO_ANIMATION}${MASK_CSS}${extraCss}` });
    const total = await page.evaluate(() => document.documentElement.scrollHeight); // scroll through the page: lazy images, reveal effects
    for (let y = 0; y < total + 800; y += 450) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(110); }
    await page.waitForLoadState('networkidle', { timeout: 4000 }).catch(() => {});
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(700);
    const m = { status: resp?.status() ?? 0, ...(await metrics(page)) };
    const h = Math.min(m.scrollHeight, 40000);
    const parts = [];
    for (let y = 0; y < h; y += SEGMENT) {
      parts.push({ input: await page.screenshot({ fullPage: true, clip: { x: 0, y, width: v.width, height: Math.min(SEGMENT, h - y) }, animations: 'disabled' }), top: y, left: 0 });
    }
    await sharp({ create: { width: v.width, height: h, channels: 3, background: '#fff' } }).composite(parts).png({ compressionLevel: 6 }).toFile(path.join(dir, `${id}.png`));
    fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(m));
    return { ok: true, h, status: m.status };
  } catch (e) {
    return { ok: false, err: e.message.slice(0, 160) };
  } finally {
    await ctx.close();
  }
}

const jobs = [];
for (const p of loadPairs()) {
  if (only && !only.includes(p.id)) continue;
  // WP_DEFECTS (empty blocks) are hidden in both captures: the same empty markup can exist on both sites. deviations.json "wpCss" only applies to WordPress.
  for (const vp of vps) for (const site of sites) jobs.push({ site, id: p.id, url: BASES[site] + p[site], vp, css: WP_DEFECTS_CSS + (site === 'wp' ? deviations[p.wp]?.wpCss ?? '' : '') });
}
console.log(`${jobs.length} captures (${sites.join('+')}, viewports ${vps.join(',')})`);
const browser = await chromium.launch({ executablePath: browserPath(), headless: true, args: ['--no-sandbox', '--font-render-hinting=none'] });
let next = 0, done = 0, failed = 0;
await Promise.all(Array.from({ length: concurrency }, async () => {
  while (next < jobs.length) {
    const j = jobs[next++]; const t0 = Date.now();
    const r = await shoot(browser, j.site, j.id, j.url, j.vp, j.css);
    done++; if (!r.ok) failed++;
    console.log(`[${done}/${jobs.length}] ${j.site} ${j.vp} ${j.id}`, r.ok ? `h=${r.h} status=${r.status}` : `FAILED ${r.err}`, `${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
}));
await browser.close();
console.log(failed ? `${failed} capture(s) failed: re-run with --only to retry them.` : 'All captures done.');
process.exit(failed ? 1 : 0);
