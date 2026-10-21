// Builds the set of real URLs per language so the language switcher can link to the
// *same page* in another language when it exists, instead of always dumping the visitor
// on that language's homepage. Mirrors the slug rules of the three [...slug].astro routes:
// non-FR files carry a "-en"/"-nl" suffix that is stripped from the URL.
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

export type Lang = 'fr' | 'en' | 'nl';
const LANGS: Lang[] = ['fr', 'en', 'nl'];
const prefix = (l: Lang) => (l === 'fr' ? '' : `/${l}`);
const strip = (slug: string) => slug.replace(/-(en|nl)$/, '');

type Index = Record<Lang, { pages: Set<string>; posts: Set<string> }>;
let cache: Promise<Index> | undefined;

async function build(): Promise<Index> {
  const reader = createReader(process.cwd(), keystaticConfig);
  const idx: Index = {
    fr: { pages: new Set(['/']), posts: new Set() },
    en: { pages: new Set(['/']), posts: new Set() },
    nl: { pages: new Set(['/']), posts: new Set() },
  };
  for (const slug of await reader.collections.pages.list()) {
    const e = await reader.collections.pages.read(slug);
    if (!e || !LANGS.includes(e.lang as Lang)) continue;
    const l = e.lang as Lang;
    if (/^accueil(-en|-nl)?$/.test(slug)) continue;
    idx[l].pages.add(`/${strip(slug)}/`);
  }
  for (const slug of await reader.collections.blog.list()) {
    const e = await reader.collections.blog.read(slug);
    if (!e || !LANGS.includes(e.lang as Lang)) continue;
    const l = e.lang as Lang;
    const url = `/${l === 'nl' ? strip(slug) : slug}/`;
    idx[l].pages.add(url);
    idx[l].posts.add(url);
  }
  for (const slug of await reader.collections.businessCases.list()) {
    const e = await reader.collections.businessCases.read(slug);
    if (!e || !LANGS.includes(e.lang as Lang)) continue;
    idx[e.lang as Lang].pages.add(`/business-cases/${strip(slug)}/`);
  }
  for (const l of LANGS) {
    for (const p of ['/blog/', '/business-cases/', '/case-study/', '/thank-you-form/', '/thank-you-meeting/']) idx[l].pages.add(p);
  }
  idx.fr.pages.add('/merci-formulaire/');
  idx.fr.pages.add('/merci-rdv/');
  return idx;
}

/** URL of the current page in each language: the real translation if it exists, else a sensible fallback. */
export async function switcherUrls(pathname: string): Promise<Record<Lang, string>> {
  cache ??= build();
  const idx = await cache;
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const cur = (LANGS.find((l) => l !== 'fr' && (path === `/${l}/` || path.startsWith(`/${l}/`))) ?? 'fr') as Lang;
  const bare = cur === 'fr' ? path : path.slice(cur.length + 1) || '/';
  const wasPost = idx[cur].posts.has(bare);
  // Thank-you pages are named differently in FR than in EN/NL.
  const thanks: Record<string, [string, string]> = { '/merci-formulaire/': ['/thank-you-form/', 'form'], '/merci-rdv/': ['/thank-you-meeting/', 'meeting'] };
  const thankKey = bare in thanks ? thanks[bare][0] : Object.values(thanks).find(([en]) => en === bare)?.[0];
  const frThank = Object.entries(thanks).find(([, [en]]) => en === thankKey)?.[0];
  const out = {} as Record<Lang, string>;
  for (const l of LANGS) {
    if (l === cur) { out[l] = path; continue; }
    const target = thankKey && frThank
      ? (l === 'fr' ? frThank : thankKey)
      : idx[l].pages.has(bare)
        ? bare
        : wasPost ? '/blog/' : '/';
    out[l] = `${prefix(l)}${target}`.replace(/^$/, '/');
  }
  return out;
}
