import type { APIRoute } from 'astro';
import { INDEXABLE, SITE } from '../lib/site';

// Closed to crawlers until PUBLIC_INDEXABLE=true (production, at go-live).
// WordPress's "Disallow" lines were absolute URLs (ignored by crawlers) on pages that were indexed anyway: not carried over.
export const GET: APIRoute = () => {
  const body = INDEXABLE
    ? `User-agent: *\nDisallow: /keystatic/\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
