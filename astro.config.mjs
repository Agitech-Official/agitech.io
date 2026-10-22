import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';

// Astro 5: 'static' is what 'hybrid' used to mean — prerendered by default, with an
// adapter present so individual routes (Keystatic's /keystatic admin UI) can still opt
// into SSR via their own prerender=false. Same pattern as agifid.
// i18n: fr = default locale, no prefix (matches current WP/Polylang URLs); en under /en/.
export default defineConfig({
  site: 'https://agitech.io',
  output: 'static',
  adapter: vercel(),
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'nl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Old WordPress URLs that no longer have an equivalent page (found by diffing the
  // old sitemap against this build).
  redirects: {
    '/en/home-page/': '/en/',
    '/newsletter-fr/': '/',
    '/en/newsletter/': '/en/',
    '/en/industries-international-associations/': '/en/industries-construction-batiment/',
    '/fr_be/home-page/': '/',
    '/fr_be/[...slug]': '/[...slug]',
    '/case-study/': '/business-cases/',
    '/en/case-study/': '/en/business-cases/',
  },
  integrations: [
    react(),
    keystatic(),
    sitemap({
      lastmod: new Date(),
      // hreflang x-default points to the French (default) version of each page.
      serialize(item) {
        const fr = item.links?.find((l) => l.lang === 'fr-BE');
        if (fr && !item.links.some((l) => l.lang === 'x-default')) item.links.push({ url: fr.url, lang: 'x-default' });
        return item;
      },
      // Thank-you pages, admin and the static estimator app stay out of the sitemap.
      filter: (page) => !/\/(keystatic|api|simulateur|merci-|thank-you-|erp-sea|landing-page-sea-pb)/.test(page),
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-BE', en: 'en', nl: 'nl-BE' },
      },
    }),
  ],
});
