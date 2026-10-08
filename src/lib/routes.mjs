// URL rules shared by the route files (src/pages/**) and the translation index (translations.mjs).
// A content file is served at /<lang prefix>/<urlSlug or file name>/ ; business cases live under /business-cases/.
// The flat content folders need unique file names, so the EN / NL version of a page whose URL is the same as the
// French one is stored as "<name>-en" and carries `urlSlug: <name>` (Keystatic field "Slug de l'URL").
export const SITE_URL = 'https://agitech.io';

const prefix = { fr: '', en: '/en', nl: '/nl' };

/** Public path (leading and trailing slash) of a content entry. kind: 'pages' | 'blog' | 'cases'. */
export function entryPath(kind, lang, file, urlSlug) {
  if (kind === 'pages' && /^accueil(-en|-nl)?$/.test(file)) return `${prefix[lang]}/`;
  const slug = urlSlug || file;
  return kind === 'cases' ? `${prefix[lang]}/business-cases/${slug}/` : `${prefix[lang]}/${slug}/`;
}

/** Hand-written pages (not in the CMS) that exist in every language. */
export const STATIC_GROUPS = [
  { fr: '/merci-formulaire/', en: '/en/thank-you-form/', nl: '/nl/thank-you-form/' },
  { fr: '/merci-rdv/', en: '/en/thank-you-meeting/', nl: '/nl/thank-you-meeting/' },
];

/** Static pages that must never be indexed nor listed in the sitemap. */
export const NOINDEX_PATHS = new Set(STATIC_GROUPS.flatMap(g => Object.values(g)));
