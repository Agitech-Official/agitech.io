// Shared helpers for the blog and business-case listings and for the article template.
import type { Lang } from './lang';
import { labels } from './settings';
import { wallClock } from './dates.mjs';

export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const MONTHS: Record<Lang, string[]> = {
  fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  nl: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
};

// WP prints dates with get_the_date('F j, Y') in the site language: "octobre 7, 2026" / "August 11, 2026".
export function formatPostDate(iso: string | null | undefined, lang: Lang): string {
  const m = wallClock(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return '';
  return `${MONTHS[lang][+m[2] - 1]} ${+m[3]}, ${m[1]}`;
}

// Interface labels, blog category tabs and business-case type tabs live in the "Libellés" settings (src/content/settings/labels.json).
const LANGS: Lang[] = ['fr', 'en', 'nl'];
const perLang = <T>(pick: (l: typeof labels.fr) => T) => Object.fromEntries(LANGS.map((l) => [l, pick(labels[l])])) as Record<Lang, T>;

// Tabs of the blog listing: the categories WordPress listed for the language (the CMS list is empty for NL: the listing
// then shows the categories actually used).
export const BLOG_TABS: Partial<Record<Lang, { slug: string; name: string }[]>> = Object.fromEntries(
  LANGS.filter((l) => labels[l].blogCategories.length).map((l) => [l, labels[l].blogCategories.map((name) => ({ slug: slugify(name), name }))]),
);

// Type tabs of the business-case listing (taxonomy business_cases_type).
export const CASE_TABS = perLang((l) => l.caseTypes);

export const LISTING_LABELS = perLang((l) => l.listing);
export const ARTICLE_LABELS = perLang((l) => l.article);

// Public URL of an entry of the blog / businessCases collections, from its URL slug (`urlSlug` field, else file name).
export function entryUrl(kind: 'post' | 'case', slug: string, lang: Lang): string {
  const base = lang === 'fr' ? '' : `/${lang}`;
  return kind === 'case' ? `${base}/business-cases/${slug}/` : `${base}/${slug}/`;
}
export const blogIndexUrl = (lang: Lang) => (lang === 'fr' ? '/blog/' : `/${lang}/blog/`);

export const nl2br = (s: string) => s.replace(/\n/g, '<br />\n');
