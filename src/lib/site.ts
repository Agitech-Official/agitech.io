// Site-wide constants. Names, social networks and the default share image come from the "Réglages du site"
// settings; the two switches below are build-time environment variables set per Vercel environment (see .env.example):
//  - PUBLIC_INDEXABLE=true  → the site asks to be indexed (robots meta, robots.txt, sitemap). Production only, at go-live.
//  - PUBLIC_GTM_ID=GTM-XXXX → loads Google Tag Manager. Left empty on previews so they never feed the live analytics.
import path from 'node:path';
import sharp from 'sharp';
import { site } from './settings';
export { SITE_URL as SITE } from './routes.mjs';

export const SITE_NAME = site.siteName;
export const INDEXABLE = import.meta.env.PUBLIC_INDEXABLE === 'true';
export const GTM_ID: string = import.meta.env.PUBLIC_GTM_ID || '';

export const SAME_AS = site.socialLinks.filter((l) => l.inStructuredData).map((l) => l.url);
export const SITE_ICON = '/wp-content/uploads/2025/08/Screenshot-2025-08-18-102425.png';
export const HTML_LANG = { fr: 'fr-BE', en: 'en-US', nl: 'nl-BE' } as const;

const MIME: Record<string, string> = { png: 'image/png', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml', avif: 'image/avif' };
let defaultImage: Promise<{ path: string; width?: number; height?: number; type?: string }> | undefined;

/** Shared preview image (Open Graph, structured-data logo) when a page has none of its own, with its real size. */
export function defaultOgImage() {
  defaultImage ??= (async () => {
    const imagePath = site.defaultImage;
    try {
      const m = await sharp(path.join(process.cwd(), 'public', imagePath)).metadata();
      return { path: imagePath, width: m.width, height: m.height, type: m.format ? MIME[m.format] : undefined };
    } catch {
      return { path: imagePath };
    }
  })();
  return defaultImage;
}
