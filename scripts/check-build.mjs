// Checks the built site (.vercel/output/static) the way a crawler would: canonical, hreflang reciprocity,
// sitemap coverage, structured data, preview tags and internal links. Run after `npm run build`:
//   npm run check:build
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = path.resolve('.vercel/output/static');
const SITE = 'https://agitech.io';
const problems = [];
const warn = (page, msg) => problems.push(`${page}  ${msg}`);

const htmlFiles = [];
(function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else if (p.endsWith('.html')) htmlFiles.push(p); } })(ROOT);
const pagePath = (f) => '/' + path.relative(ROOT, f).replace(/index\.html$/, '');
const exists = (u) => {
  u = decodeURIComponent(u.split('#')[0].split('?')[0]);
  if (!u || u === '/') return true;
  const p = path.join(ROOT, u);
  return fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, 'index.html'))) || fs.existsSync(`${p}.html`);
};

const pages = new Map(); // path -> { $, noindex, alts }
for (const f of htmlFiles) {
  const p = pagePath(f);
  if (p === '/404.html' || p.startsWith('/simulateur')) continue;
  const $ = cheerio.load(fs.readFileSync(f, 'utf8'));
  const robots = $('meta[name="robots"]').attr('content') || '';
  const alts = Object.fromEntries($('link[rel="alternate"][hreflang]').toArray().map((e) => [$(e).attr('hreflang'), $(e).attr('href')]));
  pages.set(p, { $, noindex: /noindex/.test(robots), robots, alts });
}

// 1-2-3. canonical, hreflang, preview tags, structured data
for (const [p, { $, noindex, alts }] of pages) {
  const canonical = $('link[rel="canonical"]').attr('href');
  // A page whose "URL canonique" field points elsewhere is deliberate: noted, and left out of the sitemap and of the checks below.
  if (!canonical) warn(p, 'no canonical');
  else if (canonical !== `${SITE}${p}`) warn(p, `canonical points to ${canonical} (info)`);
  if (!$('title').text().trim()) warn(p, 'empty <title>');
  if (!$('meta[name="description"]').attr('content')) warn(p, 'empty meta description (info)');
  for (const prop of ['og:title', 'og:url', 'og:image', 'og:type']) if (!$(`meta[property="${prop}"]`).attr('content')) warn(p, `missing ${prop}`);
  const og = $('meta[property="og:image"]').attr('content') || '';
  if (og.startsWith(SITE) && !exists(og.slice(SITE.length))) warn(p, `og:image not found: ${og}`);
  const langs = Object.keys(alts).filter((l) => l !== 'x-default');
  if (langs.length) {
    const self = langs.find((l) => alts[l] === `${SITE}${p}`);
    if (!self) warn(p, 'hreflang set does not include the page itself');
    if (!alts['x-default']) warn(p, 'hreflang without x-default');
    for (const l of langs) {
      const target = alts[l].replace(SITE, '');
      const t = pages.get(target);
      if (!t) { warn(p, `hreflang ${l} -> ${target} does not exist`); continue; }
      if (JSON.stringify(t.alts) !== JSON.stringify(alts)) warn(p, `hreflang ${l} -> ${target} lists a different set (not reciprocal)`);
      if (t.noindex !== noindex) warn(p, `hreflang ${l} -> ${target} has a different robots state (info)`);
    }
  }
  for (const s of $('script[type="application/ld+json"]').map((_, e) => $(e).text()).get()) {
    try {
      const g = JSON.parse(s)['@graph'] ?? [];
      const page = g.find((n) => n['@type'] === 'WebPage');
      if (page && page.url !== canonical) warn(p, `JSON-LD WebPage url is ${page.url}`);
      for (const n of g) if (n['@type'] === 'BlogPosting' && !n.author) warn(p, 'BlogPosting without author (info)');
    } catch { warn(p, 'JSON-LD does not parse'); }
  }
}

// thank-you pages must stay out of the index even once the site is indexable
for (const p of ['/merci-formulaire/', '/merci-rdv/', '/en/thank-you-form/', '/en/thank-you-meeting/', '/nl/thank-you-form/', '/nl/thank-you-meeting/']) {
  if (!pages.get(p)?.noindex) warn(p, 'thank-you page is not noindex');
}
if (!/noindex/.test(cheerio.load(fs.readFileSync(path.join(ROOT, '404.html'), 'utf8'))('meta[name="robots"]').attr('content') || '')) warn('/404.html', 'not noindex');

// 4. sitemap
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ''));
for (const l of locs) {
  const pg = pages.get(l);
  if (!pg) { warn('sitemap', `${l} is not a built page`); continue; }
  if (pg.noindex && !/Disallow: \/\n/.test(fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8'))) warn('sitemap', `${l} is noindex but listed`);
}
const listed = new Set(locs);
for (const [p, { noindex, $ }] of pages) if (!listed.has(p) && !noindex && $('link[rel="canonical"]').attr('href') === `${SITE}${p}`) warn('sitemap', `${p} is not listed`);
if (new Set(locs).size !== locs.length) warn('sitemap', 'duplicate <loc>');

// 5. internal links and assets
let refs = 0; const broken = new Map();
for (const [p, { $ }] of pages) {
  $('a[href],img[src],source[src],link[href],script[src]').each((_, e) => {
    for (const attr of ['href', 'src']) {
      const v = $(e).attr(attr);
      if (!v || !v.startsWith('/') || v.startsWith('//')) continue;
      refs++;
      if (!exists(v)) (broken.get(v.split('#')[0]) ?? broken.set(v.split('#')[0], new Set()).get(v.split('#')[0])).add(p);
    }
  });
}
for (const [u, from] of broken) warn([...from][0], `broken internal link ${u} (+${from.size - 1} more pages)`);

const errors = problems.filter((m) => !/\(info\)/.test(m));
console.log(`${pages.size} pages, ${locs.length} sitemap URLs, ${refs} internal references.`);
console.log(`${errors.length} problem(s), ${problems.length - errors.length} info.`);
for (const m of problems.slice(0, 60)) console.log('  ' + m);
process.exit(errors.length ? 1 : 0);
