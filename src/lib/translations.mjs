// Content index: every public URL of the CMS content and which URLs are the same content in another language.
// Source of truth = frontmatter: `lang`, `urlSlug`, `translationKey` (same value on the FR / EN / NL versions),
// `draft`, `noindex`, `canonicalUrl`. Plain .mjs reading the content folders directly so pages, endpoints
// (sitemap, feed) and the language switcher share it without re-parsing every entry through Keystatic.
import fs from 'node:fs';
import path from 'node:path';
import { entryPath, STATIC_GROUPS } from './routes.mjs';
import { wallClock } from './dates.mjs';

const FOLDERS = [['pages', 'src/content/pages'], ['blog', 'src/content/blog'], ['cases', 'src/content/business-cases']];
const LANGS = ['fr', 'en', 'nl'];

/** Drafts are built in development and when PUBLIC_SHOW_DRAFTS=true (Vercel previews); never in production. */
export const showDrafts = () => process.env.NODE_ENV !== 'production' || process.env.PUBLIC_SHOW_DRAFTS === 'true';

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const fm = m ? m[1] : '';
  const get = (key) => {
    const r = fm.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
    return r ? r[1].trim().replace(/^(["'])(.*)\1$/, '$2') : undefined;
  };
  return {
    lang: get('lang'), translationKey: get('translationKey') || undefined, urlSlug: get('urlSlug') || undefined,
    publishedAt: get('publishedAt'), draft: get('draft') === 'true', noindex: get('noindex') === 'true',
    canonicalUrl: get('canonicalUrl') || undefined,
  };
}

let cached;

/**
 * @returns {{
 *   entries: {kind:string, file:string, lang:string, key?:string, path:string, publishedAt?:string, noindex:boolean, canonicalUrl?:string}[],
 *   byPath: Map<string, any>,
 *   groups: Map<string, {lang:string, path:string}[]>,
 *   problems: {level:'error'|'warning', message:string}[],
 * }}
 */
export function contentIndex(root = process.cwd()) {
  if (cached && process.env.NODE_ENV === 'production') return cached;
  const all = [];
  for (const [kind, dir] of FOLDERS) {
    for (const f of fs.readdirSync(path.join(root, dir))) {
      if (!f.endsWith('.mdoc')) continue;
      const file = f.slice(0, -'.mdoc'.length);
      const fm = frontmatter(fs.readFileSync(path.join(root, dir, f), 'utf8'));
      all.push({ kind, file, lang: fm.lang, key: fm.translationKey, urlSlug: fm.urlSlug, path: LANGS.includes(fm.lang) ? entryPath(kind, fm.lang, file, fm.urlSlug) : '', publishedAt: wallClock(fm.publishedAt), draft: fm.draft, noindex: fm.noindex, canonicalUrl: fm.canonicalUrl });
    }
  }

  const problems = [];
  const seen = new Map();
  for (const e of all) {
    const where = `${e.kind}/${e.file}.mdoc`;
    if (!LANGS.includes(e.lang)) { problems.push({ level: 'error', message: `${where}: "lang" must be fr, en or nl` }); continue; }
    if (e.urlSlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(e.urlSlug)) problems.push({ level: 'error', message: `${where}: urlSlug "${e.urlSlug}" must be lowercase letters, digits and dashes` });
    const other = seen.get(e.path);
    if (other) problems.push({ level: 'error', message: `${where} and ${other} are both served at ${e.path} (give one of them a different "Slug de l'URL")` });
    else seen.set(e.path, where);
  }

  const entries = all.filter((e) => LANGS.includes(e.lang) && (showDrafts() || !e.draft))
    .map(({ draft, urlSlug, ...e }) => e);
  const byPath = new Map(entries.map((e) => [e.path, e]));
  const groups = new Map();
  const add = (id, member) => { const g = groups.get(id) ?? groups.set(id, []).get(id); g.push(member); };
  for (const e of entries) if (e.key) add(`${e.kind}:${e.key}`, { lang: e.lang, path: e.path });
  STATIC_GROUPS.forEach((g, i) => { for (const l of LANGS) if (g[l]) add(`static:${i}`, { lang: l, path: g[l] }); });

  for (const [id, g] of groups) {
    if (id.startsWith('static:')) continue;
    const langs = g.map((m) => m.lang);
    const dup = langs.find((l, i) => langs.indexOf(l) !== i);
    if (dup) problems.push({ level: 'error', message: `translationKey "${id.split(':')[1]}" is used by two ${dup.toUpperCase()} entries: ${g.filter((m) => m.lang === dup).map((m) => m.path).join(', ')}` });
    else if (g.length === 1) problems.push({ level: 'warning', message: `translationKey "${id.split(':')[1]}" is used by a single entry (${g[0].path}): no translation linked` });
  }

  cached = { entries, byPath, groups, problems };
  return cached;
}

const groupOf = (idx, pathname) => {
  const e = idx.byPath.get(pathname);
  if (e?.key) return idx.groups.get(`${e.kind}:${e.key}`);
  return [...idx.groups].find(([id, g]) => id.startsWith('static:') && g.some((m) => m.path === pathname))?.[1];
};

/** Every language version of `pathname`, itself included, in fr / en / nl order. Empty when it has no translation. */
export function alternatesFor(pathname) {
  const g = groupOf(contentIndex(), pathname);
  if (!g || g.length < 2) return [];
  return LANGS.map((l) => g.find((m) => m.lang === l)).filter(Boolean);
}

const homeOf = { fr: '/', en: '/en/', nl: '/nl/' };

/** Target of each language flag: the translated page, or that language's home page when there is none (as WordPress/Polylang did). */
export function switcherLinks(pathname) {
  const alts = alternatesFor(pathname);
  return Object.fromEntries(LANGS.map((l) => [l, alts.find((a) => a.lang === l)?.path ?? homeOf[l]]));
}
