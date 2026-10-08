// Per-template SEO props for Layout: preview image and article metadata taken from the content entry.
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import { blockImg } from './img';
import { wallClock } from './dates.mjs';

/** "2025-05-20T09:58" (Brussels wall clock, as stored by Keystatic) → ISO 8601 with the Brussels offset. */
export function localToIso(value: string | null | undefined): string | undefined {
  const local = wallClock(value);
  if (!local) return undefined;
  const offset = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Brussels', timeZoneName: 'shortOffset' })
    .formatToParts(new Date(`${local}:00Z`)).find(p => p.type === 'timeZoneName')?.value ?? 'GMT+1';
  const hours = Number(offset.replace('GMT', '') || 0);
  return `${local}:00${hours < 0 ? '-' : '+'}${String(Math.abs(hours)).padStart(2, '0')}:00`;
}

interface SeoEntry { title: string; ogImage?: string | null; canonicalUrl?: string | null; noindex?: boolean }
interface PostEntry extends SeoEntry { publishedAt: string | null; author: string | null; categories: readonly string[]; coverImage?: string | null }

// Explicit SEO fields of an entry: canonical override and noindex (Layout falls back to its own defaults when absent).
const overrides = (entry: SeoEntry) => ({
  ...(entry.canonicalUrl ? { canonical: entry.canonicalUrl } : {}),
  ...(entry.noindex ? { robotsNoIndex: true } : {}),
});
const ogOf = (entry: SeoEntry, fallbackUrl?: string) => {
  const url = entry.ogImage || fallbackUrl;
  return url ? { url, alt: entry.title } : undefined;
};

/** Text of the page's (visually hidden) h1: the SEO title without the brand suffix (and without the " - EN" tag WordPress put in English titles), else the title. */
export const headingOf = (entry: { title: string; seoTitle?: string | null }) => (entry.seoTitle || entry.title).replace(/\s+[-–|]\s+Agitech.*$/i, '').replace(/\s+-\s+EN$/, '');

export const pageSeo = (entry: SeoEntry) => ({ ogImage: ogOf(entry), ...overrides(entry) });

export async function postSeo(entry: PostEntry) {
  const reader = createReader(process.cwd(), keystaticConfig);
  const author = entry.author ? await reader.collections.authors.read(entry.author) : null;
  return {
    ogType: 'article' as const,
    ogImage: ogOf(entry, entry.coverImage ?? undefined),
    ...overrides(entry),
    article: { publishedTime: localToIso(entry.publishedAt), section: entry.categories[0], author: author?.name },
  };
}

export function caseSeo(entry: SeoEntry & { coverImage?: string | null }) {
  return { ogType: 'article' as const, ogImage: ogOf(entry, blockImg(entry.coverImage)), ...overrides(entry) };
}
