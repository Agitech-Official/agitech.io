import type { APIRoute } from 'astro';
import { contentIndex, alternatesFor } from '../lib/translations.mjs';
import { SITE } from '../lib/site';

// One sitemap for the whole site, with hreflang alternates built from translationKey.
// Thank-you pages are not in the content index, so they are never listed.
export const GET: APIRoute = () => {
  const { entries } = contentIndex();
  const listed = entries.filter((e) => !e.noindex && (!e.canonicalUrl || e.canonicalUrl === `${SITE}${e.path}`));
  const urls = listed.sort((a, b) => a.path.localeCompare(b.path)).map((e) => {
    const alts = alternatesFor(e.path);
    const fr = alts.find((a) => a.lang === 'fr') ?? alts[0];
    const links = alts.length
      ? alts.map((a) => `<xhtml:link rel="alternate" hreflang="${a.lang}" href="${SITE}${a.path}"/>`).join('') + `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${fr.path}"/>`
      : '';
    const lastmod = e.publishedAt ? `<lastmod>${e.publishedAt.slice(0, 10)}</lastmod>` : '';
    return `<url><loc>${SITE}${e.path}</loc>${lastmod}${links}</url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
