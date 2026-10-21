import type { APIRoute } from 'astro';

// Go-live switch: set PUBLIC_INDEXABLE=true in the Vercel project (same variable Layout.astro
// reads to drop the noindex meta). Until then the whole site is closed to crawlers.
export const GET: APIRoute = () => {
  const open = import.meta.env.PUBLIC_INDEXABLE === 'true';
  const body = open
    ? 'User-agent: *\nAllow: /\nDisallow: /keystatic\nDisallow: /api/\nDisallow: /simulateur/\n\nSitemap: https://agitech.io/sitemap-index.xml\n'
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
