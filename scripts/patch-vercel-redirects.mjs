// Run after `astro build` (see package.json). Post-processes .vercel/output/config.json:
// 1. the adapter writes redirect routes like ^/case-study$ that only match WITHOUT a trailing slash,
//    while every old WordPress URL ends with "/": make the slash optional;
// 2. wildcard targets (/$1) keep a trailing slash so old links redirect once, not twice;
// 3. add redirects for URLs Search Console reports as 404 (old WordPress archives, language
//    variants that were never translated, malformed e-mail links, hacked-site spam).
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const file = '.vercel/output/config.json';
if (!existsSync(file)) process.exit(0);
const config = JSON.parse(readFileSync(file, 'utf8'));

// --- pages that really exist, by language -------------------------------------------------
const staticDir = '.vercel/output/static';
const pages = new Set(); // '/en/foo/'
(function walk(dir, rel) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, `${rel}${name}/`);
    else if (name === 'index.html' && rel !== '/') pages.add(rel);
  }
})(staticDir, '/');
const split = (p) => (/^\/(en|nl)\//.test(p) ? [p.split('/')[1], p.replace(/^\/(en|nl)/, '')] : ['fr', p]);
const bySlug = new Map(); // '/foo/' -> { fr: '/foo/', en: '/en/foo/' }
for (const p of pages) {
  const [lang, slug] = split(p);
  // the three home pages are separate pages, never variants of each other (/ must stay the French home)
  if (slug === '/') continue;
  if (/^\/(merci-|thank-you-|keystatic|api|simulateur|404|assets|_astro|wp-content)/.test(slug)) continue;
  bySlug.set(slug, { ...(bySlug.get(slug) ?? {}), [lang]: p });
}
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const variantRedirects = [];
for (const [slug, found] of bySlug) {
  const target = found.fr ?? found.en ?? found.nl;
  // old WordPress duplicate slugs (my-article-2 ... my-article-9) -> the article itself,
  // unless a real page happens to use that slug
  const base = slug.replace(/\/$/, '');
  if (![2, 3, 4, 5, 6, 7, 8, 9].some((n) => bySlug.has(`${base}-${n}/`))) {
    variantRedirects.push({ src: `^(?:/(?:en|nl))?${escape(base)}-[2-9]/?$`, headers: { Location: target }, status: 301 });
  }
  for (const lang of ['fr', 'en', 'nl']) {
    if (found[lang]) continue;
    const from = lang === 'fr' ? slug : `/${lang}${slug}`;
    variantRedirects.push({ src: `^${escape(from.replace(/\/$/, ''))}/?$`, headers: { Location: target }, status: 301 });
  }
}

// --- hand-written rules ---------------------------------------------------------------------
const rules = [
  // spam pages from the old hacked WordPress and tracking IDs mistaken for URLs: gone for good
  { src: '^/.*(?:kazino|1xbet|casino|pinco).*$', status: 410 },
  { src: '^/(?:LQJhCMGcj9AZEPngp8go|MLDdCP-FnbwZEPngp8go|Y22HCI_ynLwZEPngp8go|locations\\.kml)/?$', status: 410 },
  // WordPress RSS feeds (/feed/, /some-article/feed/, /author/x/feed/): the new site has none
  { src: '^/(?:.*/)?(?:feed|comments/feed)/?$', status: 410 },
  { src: '^/(?:fr_be/)?newsletter/?$', headers: { Location: '/' }, status: 301 },
  // malformed e-mail links of the old blog posts: /some-article/sam@agitech.io -> /some-article/
  { src: '^/(.+?)/[^/@]+@agitech\\.io/?$', headers: { Location: '/$1/' }, status: 301 },
  // old WordPress archives (any language, with or without the /fr_be prefix)
  { src: '^/(en|nl)/(?:fr_be/)?(?:category|tag|author)(?:/.*)?$', headers: { Location: '/$1/blog/' }, status: 301 },
  { src: '^/(?:fr_be/)?(?:category|tag|author)(?:/.*)?$', headers: { Location: '/blog/' }, status: 301 },
  { src: '^/(?:(?:en|nl)/)?(?:fr_be/)?business-cases-tags(?:/.*)?$', headers: { Location: '/business-cases/' }, status: 301 },
  { src: '^/(en|nl)/(?:fr_be/)?case-study(?:/.*)?$', headers: { Location: '/$1/business-cases/' }, status: 301 },
  { src: '^/(en|nl)/(?:fr_be/)?home-page/?$', headers: { Location: '/$1/' }, status: 301 },
  { src: '^/(?:fr_be/)?home-page/?$', headers: { Location: '/' }, status: 301 },
  // legacy Odoo-website URLs of www.agitech.io
  { src: '^/appointment(?:/.*)?$', headers: { Location: '/contact-us/' }, status: 301 },
  { src: '^/(?:nl_BE|fr_BE|en_US|fr_FR)/jobs(?:/.*)?$', headers: { Location: '/jobs/' }, status: 301 },
  { src: '^/web/image/.*$', headers: { Location: '/assets/img/agitech-logo-dark.svg' }, status: 301 },
  // old WordPress article that was not migrated: closest topic
  { src: '^/odoo-standard-versus-developpement-specifique/?$', headers: { Location: '/development/' }, status: 301 },
  // old WordPress duplicate slug (-3 suffix) of an article that exists in English
  { src: '^/odoo-version-edition-and-hosting-which-one-should-i-choose-3/?$', headers: { Location: '/en/odoo-version-edition-and-hosting-which-one-should-i-choose/' }, status: 301 },
  // the old EN "construction" page was published under this slug
  { src: '^/industries-international-associations/?$', headers: { Location: '/en/industries-construction-batiment/' }, status: 301 },
];

// --- adapter routes: optional trailing slash + wildcard targets -----------------------------
let patched = 0;
const adapter = [];
for (const route of config.routes ?? []) {
  const isRedirect = route.headers?.Location && [301, 302, 307, 308].includes(route.status);
  if (isRedirect && route.src?.endsWith('$') && !route.src.endsWith('/?$')) {
    route.src = route.src.slice(0, -1) + '/?$';
    patched++;
    if (route.headers.Location.endsWith('$1')) {
      // Wildcard redirect (e.g. /fr_be/*, /en/fr_be/*): the bare prefix has no $1, so it goes to the
      // target's root, and the wildcard target keeps a trailing slash to avoid a second redirect.
      const prefix = route.src.match(/^\^(\/[^(]*)\(\?:/)?.[1];
      const root = route.headers.Location.slice(0, -2) || '/';
      if (prefix) adapter.push({ src: `^${prefix}/?$`, headers: { Location: root }, status: route.status });
      route.headers.Location += '/';
    }
  }
  adapter.push(route);
}

// Our rules first, then the adapter's, then language variants; everything before the filesystem handler.
const firstHandle = adapter.findIndex((r) => r.handle);
const head = firstHandle === -1 ? adapter : adapter.slice(0, firstHandle);
const tail = firstHandle === -1 ? [] : adapter.slice(firstHandle);
config.routes = [...rules, ...head, ...variantRedirects, ...tail];
writeFileSync(file, JSON.stringify(config));
console.log(`patch-vercel-redirects: ${patched} adapter redirects fixed, ${rules.length} rules, ${variantRedirects.length} language-variant redirects`);
