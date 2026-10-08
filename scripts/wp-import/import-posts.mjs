#!/usr/bin/env node
/*
 * Imports the blog posts of the WordPress site (public REST API + article pages) into
 * src/content/blog, in the Keystatic format (front matter + Markdoc body).
 *
 *   node scripts/wp-import/import-posts.mjs                 dry run: lists what would be imported
 *   node scripts/wp-import/import-posts.mjs --apply         writes the new posts and their cover images
 *   node scripts/wp-import/import-posts.mjs --apply --update   also refreshes posts already in the repo
 *   node scripts/wp-import/import-posts.mjs --apply --update --only=slug-a,slug-b   refreshes only these posts
 *
 * Options: --base=https://agitech.io  --langs=fr_be,en  --only=slug,slug  --limit=N  --delay=400 (ms between page fetches)
 * Images of the article body are downloaded to public/wp-content/uploads/ (same path as on WordPress).
 * Read-only on WordPress: only GET requests on public endpoints.
 */
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import { tables } from 'turndown-plugin-gfm';
import YAML from 'yaml';

const ROOT = path.resolve(import.meta.dirname, '../..');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const BASE = (args.base || 'https://agitech.io').replace(/\/$/, '');
const LANGS = (args.langs || 'fr_be,en').split(',');
const DELAY = +(args.delay || 400);
const APPLY = !!args.apply, UPDATE = !!args.update, LIMIT = args.limit ? +args.limit : Infinity;
const ONLY = args.only ? new Set(String(args.only).split(',')) : null;
const UPLOADS = path.join(ROOT, 'public/wp-content/uploads');
const BLOG = path.join(ROOT, 'src/content/blog');
const UA = 'agitech-wp-import (read-only)';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const get = async (url) => { const r = await fetch(url, { headers: { 'User-Agent': UA } }); if (!r.ok) throw new Error(`${r.status} ${url}`); return r; };

// ---- authors: WP display name -> author file slug --------------------------------------------------
const authors = {};
for (const f of fs.readdirSync(path.join(ROOT, 'src/content/authors')).filter(f => f.endsWith('.yaml'))) {
  authors[YAML.parse(fs.readFileSync(path.join(ROOT, 'src/content/authors', f), 'utf8')).name] = f.replace(/\.yaml$/, '');
}

// ---- existing posts (slug -> {lang, publishedAt}) --------------------------------------------------
const frontOf = (src) => YAML.parse(src.match(/^---\n([\s\S]*?)\n---/)[1]);
const existing = {};
for (const f of fs.readdirSync(BLOG).filter(f => f.endsWith('.mdoc'))) {
  const fm = frontOf(fs.readFileSync(path.join(BLOG, f), 'utf8'));
  // Fields the CMS adds (translation link, URL slug, draft, SEO overrides) do not exist in WordPress: an update keeps them.
  const keep = Object.fromEntries(['translationKey', 'urlSlug', 'draft', 'noindex', 'canonicalUrl', 'ogImage'].filter(k => fm[k] !== undefined).map(k => [k, fm[k]]));
  existing[f.replace(/\.mdoc$/, '')] = { lang: fm.lang, publishedAt: fm.publishedAt, keep };
}
const takenMinutes = new Set(Object.values(existing).map(e => `${e.lang}|${e.publishedAt}`));

// ---- HTML -> Markdown ------------------------------------------------------------------------------------
const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', emDelimiter: '*', strongDelimiter: '**', codeBlockStyle: 'fenced' });
// Old URLs that WP answers with a 301 (Polylang slug changes): link straight to the page they end on.
const LEGACY = {
  '/home-page/': '/',
  '/odoo-version-edition-and-hosting-which-one-should-i-choose-3/': '/en/odoo-version-edition-and-hosting-which-one-should-i-choose/',
  '/the-truth-about-odoo-price-and-erp-budgeting-for-eu-based-companies/': '/en/the-truth-about-odoo-price-and-erp-budgeting-for-eu-based-companies/',
};
const relUrl = (u) => {
  const r = u
    .replace(/^https?:\/\/(www\.)?agitech\.io/, '')
    .replace(/^\/fr_be\//, '/')
    .replace(/^\/(fr_be\/)?(category|tag)\/[^?#]*/, '/blog/')
    .replace(/^$/, '/');
  return LEGACY[r] ?? r;
};
td.use(tables);
td.addRule('internalLinks', {
  filter: (node) => node.nodeName === 'A' && node.getAttribute('href'),
  replacement: (content, node) => `[${content}](${relUrl(node.getAttribute('href'))}${node.getAttribute('title') ? ` "${node.getAttribute('title')}"` : ''})`,
});
const bodyImages = new Set();
td.addRule('uploadImages', {
  filter: 'img',
  replacement: (content, node) => {
    const src = relUrl(node.getAttribute('src') || '');
    if (src.startsWith('/wp-content/uploads/')) bodyImages.add(src);
    const alt = (node.getAttribute('alt') || '').replace(/[\[\]]/g, '');
    return src ? `![${alt}](${src})` : '';
  },
});
const toMarkdown = (html) => td.turndown(html.replace(/ /g, ' ')).replace(/\n{3,}/g, '\n\n').trim() + '\n';

// Posts built with WordPress blocks (columns, tables, font sizes, spacers...) or with hand-placed <br> line breaks lose
// their layout when converted to Markdown: they are stored as raw HTML in `contentHtml` instead (rendered as is).
const needsHtml = (html) => /class="[^"]*\b(wp-block|has-)[^"]*"|style="/.test(html);
const cleanHtml = (html) => {
  // WordPress prints the raw post content in the article page (no the_content filters): that markup, not the REST
  // "rendered" one (wpautop, block rendering), is what visitors see. Drop what plugins add around images.
  const $ = cheerio.load(html, null, false);
  $('picture').each((_, el) => { $(el).replaceWith($(el).find('img').first()); });
  $('source').remove();
  $('img').each((_, el) => {
    for (const a of ['decoding', 'fetchpriority', 'loading', 'data-lazy-src', 'data-lazy-srcset', 'data-lazy-sizes', 'data-lazy-loaded']) $(el).removeAttr(a);
  });
  return $.html()
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/https?:\/\/(www\.)?agitech\.io\/(fr_be\/)?(category|tag)\/[^"'\s<]*/g, '/blog/')
    .replace(/https?:\/\/(www\.)?agitech\.io\/fr_be\//g, '/')
    .replace(/https?:\/\/(www\.)?agitech\.io(?=\/)/g, '')
    .replace(/href="([^"]+)"/g, (m, u) => (LEGACY[u] ? `href="${LEGACY[u]}"` : m))
    .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
};
const uploadsIn = (html) => [...new Set([...html.matchAll(/\/wp-content\/uploads\/[^\s"',)<>]+/g)].map(m => m[0]))];

const text = (html) => cheerio.load(`<div>${html}</div>`)('div').text().replace(/\s+/g, ' ').trim();
const iso = (d) => d.toISOString().slice(0, 16);
function freeMinute(lang, local) {
  const t = new Date(local + 'Z');
  while (takenMinutes.has(`${lang}|${iso(t)}`)) t.setUTCMinutes(t.getUTCMinutes() - 1);
  takenMinutes.add(`${lang}|${iso(t)}`);
  return iso(t);
}

// ---- 1. list the WP posts ------------------------------------------------------------------------------------
const posts = [];
for (const lang of LANGS) {
  for (let page = 1; ; page++) {
    const r = await get(`${BASE}/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed=1&lang=${lang}`).catch(() => null);
    if (!r) break;
    const batch = await r.json();
    posts.push(...batch.map(p => ({ ...p, _lang: lang === 'en' ? 'en' : 'fr' })));
    if (page >= +r.headers.get('x-wp-totalpages')) break;
  }
}
posts.sort((a, b) => b.date.localeCompare(a.date));
const todo = posts.filter(p => (ONLY ? ONLY.has(p.slug) : (UPDATE || !existing[p.slug]))).slice(0, LIMIT);
console.log(`WP posts: ${posts.length} | in repo: ${Object.keys(existing).length} | to ${UPDATE ? 'import/update' : 'import'}: ${todo.length}${APPLY ? '' : '  (dry run, add --apply)'}`);

// ---- 2. import ----------------------------------------------------------------------------------------------------
let written = 0;
for (const p of todo) {
  const e = p._embedded || {};
  const authorName = e.author?.[0]?.name;
  const author = authors[authorName];
  if (!author) { console.log(`  ! ${p.slug}: unknown author "${authorName}" (add src/content/authors/<slug>.yaml)`); continue; }
  const title = text(p.title.rendered);
  const cover = e['wp:featuredmedia']?.[0]?.source_url;

  // article page: <title>, meta description and the category order WP prints
  let seoTitle, seoDescription, pageBody = '', categories = (e['wp:term']?.[0] || []).map(t => t.name);
  await sleep(DELAY);
  try {
    const $ = cheerio.load(await (await get(p.link)).text());
    seoTitle = $('head title').first().text().replace(/\s+/g, ' ').trim();
    seoDescription = ($('meta[name="description"]').attr('content') || '').replace(/\s+/g, ' ').trim();
    const printed = $('.blog-details-section .categories-btn .purple-text').toArray().map(el => $(el).text().trim());
    if (printed.length) categories = printed;
    pageBody = $('.blog-details-section .content-area > .col-12').first().html() || '';
  } catch (err) { console.log(`  ! ${p.slug}: page not readable (${err.message}), using REST data only`); }

  // Rank Math's meta description is the curated summary; WP's own excerpt is auto-generated for older posts.
  const excerpt = seoDescription || text(p.excerpt.rendered);
  const front = {
    title, lang: p._lang,
    ...(existing[p.slug]?.keep ?? {}),
    publishedAt: existing[p.slug]?.publishedAt ?? freeMinute(p._lang, p.date.slice(0, 16)),
    excerpt, author, categories,
    // Keystatic's image field keeps a post's cover in a folder named after the post and stores its full public path.
    ...(cover ? { coverImage: `/assets/img/blog/${p.slug}/${path.basename(decodeURIComponent(cover.split('?')[0]))}` } : {}),
    ...(seoTitle ? { seoTitle } : {}),
    ...(seoDescription && seoDescription !== excerpt ? { seoDescription } : {}),
  };
  console.log(`  ${existing[p.slug] ? '~' : '+'} ${p._lang} ${front.publishedAt} ${p.slug}${(needsHtml(p.content.rendered)) ? '  [HTML]' : ''}`);
  if (!APPLY) continue;
  if (cover) {
    const dest = path.join(ROOT, 'public', front.coverImage);
    if (!fs.existsSync(dest)) { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, Buffer.from(await (await get(cover)).arrayBuffer())); await sleep(DELAY); }
  }
  const rawHtml = needsHtml(p.content.rendered) || /<br\b/.test(pageBody);
  const htmlBody = rawHtml ? cleanHtml(pageBody || p.content.rendered) : '';
  // The WP article template prints the stored content without wptexturize: use it (not the REST
  // rendering) so straight quotes / dashes stay as WP shows them and line wraps match.
  const body = rawHtml ? '' : toMarkdown(/<p[\s>]/.test(pageBody) ? pageBody : p.content.rendered);
  if (rawHtml) uploadsIn(htmlBody).forEach(u => bodyImages.add(u));
  for (const img of bodyImages) {
    const dest = path.join(ROOT, 'public', img);
    if (fs.existsSync(dest)) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    try { fs.writeFileSync(dest, Buffer.from(await (await get(BASE + img)).arrayBuffer())); console.log(`    + image ${img}`); await sleep(DELAY); } catch (err) { console.log(`    ! image ${img}: ${err.message}`); }
  }
  bodyImages.clear();
  if (rawHtml) { const sc = new YAML.Scalar(htmlBody); sc.type = 'BLOCK_LITERAL'; front.contentHtml = sc; }
  fs.writeFileSync(path.join(BLOG, `${p.slug}.mdoc`), `---\n${YAML.stringify(front, { lineWidth: 0, indentSeq: false, defaultStringType: 'QUOTE_DOUBLE', defaultKeyType: 'PLAIN' }).trimEnd()}\n---\n${body}`);
  written++;
}
console.log(APPLY ? `${written} post(s) written.` : 'Nothing written.');
