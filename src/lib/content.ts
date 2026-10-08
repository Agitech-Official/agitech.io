// Static paths of the language catch-all routes and of the business-case routes, from the Keystatic content.
// The URL slug is the entry's `urlSlug` field, or its file name when empty; drafts are left out of production builds.
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import { showDrafts } from './translations.mjs';
import type { Lang } from './lang';

const HOME_ENTRY: Record<Lang, string> = { fr: 'accueil', en: 'accueil-en', nl: 'accueil-nl' };
const visible = (entry: { lang: string; draft?: boolean } | null, lang: Lang) =>
  !!entry && entry.lang === lang && (showDrafts() || !entry.draft);

/** Pages (page-builder blocks) and blog posts of one language, served from the same catch-all route. The home page has its own index.astro. */
export async function pageAndPostPaths(lang: Lang) {
  const reader = createReader(process.cwd(), keystaticConfig);
  const pages = await Promise.all((await reader.collections.pages.list())
    .filter((file) => file !== HOME_ENTRY[lang])
    .map(async (file) => ({ file, entry: await reader.collections.pages.read(file) })));
  const posts = await Promise.all((await reader.collections.blog.list())
    .map(async (file) => ({ file, entry: await reader.collections.blog.read(file) })));
  return [
    ...pages.filter(({ entry }) => visible(entry, lang)).map(({ file, entry }) => ({ params: { slug: entry!.urlSlug || file }, props: { kind: 'page' as const, entry: entry! } })),
    ...posts.filter(({ entry }) => visible(entry, lang)).map(({ file, entry }) => ({ params: { slug: entry!.urlSlug || file }, props: { kind: 'blog' as const, entry: entry! } })),
  ];
}

/** Business cases of one language, served under /business-cases/. */
export async function casePaths(lang: Lang) {
  const reader = createReader(process.cwd(), keystaticConfig);
  const cases = await Promise.all((await reader.collections.businessCases.list())
    .map(async (file) => ({ file, entry: await reader.collections.businessCases.read(file) })));
  return cases.filter(({ entry }) => visible(entry, lang)).map(({ file, entry }) => ({ params: { slug: entry!.urlSlug || file }, props: { entry: entry! } }));
}
