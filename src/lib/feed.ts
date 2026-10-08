// RSS 2.0 feed of the latest posts of one language (WordPress served /feed/ and /en/feed/).
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import { SITE, SITE_NAME } from './site';
import { localToIso } from './seo';
import { wallClock } from './dates.mjs';
import { entryUrl } from './blog';
import { showDrafts } from './translations.mjs';
import type { Lang } from './lang';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function buildFeed(lang: Lang, selfPath: string) {
  const reader = createReader(process.cwd(), keystaticConfig);
  const slugs = await reader.collections.blog.list();
  const posts = (await Promise.all(slugs.map(async (slug) => ({ slug, entry: await reader.collections.blog.read(slug) }))))
    .filter((p) => p.entry && p.entry.lang === lang && p.entry.publishedAt && (showDrafts() || !p.entry.draft) && !p.entry.noindex)
    .sort((a, b) => wallClock(b.entry!.publishedAt).localeCompare(wallClock(a.entry!.publishedAt)))
    .slice(0, 20);
  const items = posts.map(({ slug, entry }) => {
    const url = SITE + entryUrl('post', entry!.urlSlug || slug, lang);
    const date = new Date(localToIso(entry!.publishedAt)!).toUTCString();
    const cats = entry!.categories.map((c) => `<category>${esc(c)}</category>`).join('');
    return `<item><title>${esc(entry!.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${date}</pubDate>${cats}<description>${esc(entry!.excerpt ?? '')}</description></item>`;
  });
  const home = lang === 'fr' ? '/' : `/${lang}/`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(SITE_NAME)}</title><link>${SITE}${home}</link><atom:link href="${SITE}${selfPath}" rel="self" type="application/rss+xml"/><description>${esc(SITE_NAME)}</description><language>${lang}</language>${items.join('')}</channel></rss>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
