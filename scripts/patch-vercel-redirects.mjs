// Run after `astro build`. The Vercel adapter writes redirect routes such as ^/case-study$
// that only match WITHOUT a trailing slash, while every old WordPress URL ends with "/".
// - make the trailing slash optional so /case-study/ and /fr_be/jobs/ redirect too;
// - wildcard targets (/$1) get a trailing slash so old links redirect once, not twice.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const file = '.vercel/output/config.json';
if (!existsSync(file)) process.exit(0);

const config = JSON.parse(readFileSync(file, 'utf8'));
// Old WordPress archives (any depth) have no equivalent: send them to the closest listing.
const routes = [
  { src: '^/(?:category|tag|author)(?:/.*)?$', headers: { Location: '/blog/' }, status: 301 },
  { src: '^/business-cases-tags(?:/.*)?$', headers: { Location: '/business-cases/' }, status: 301 },
];
let patched = 0;
for (const route of config.routes ?? []) {
  const isRedirect = route.headers?.Location && [301, 302, 307, 308].includes(route.status);
  if (isRedirect && route.src?.endsWith('$') && !route.src.endsWith('/?$')) {
    route.src = route.src.slice(0, -1) + '/?$';
    patched++;
    if (route.headers.Location.endsWith('$1')) {
      // Wildcard redirect (e.g. /fr_be/*, /en/fr_be/*): the bare prefix has no $1, so it goes to the
      // target's root, and the wildcard target keeps a trailing slash to avoid a second redirect.
      const prefix = route.src.match(/^\^(\/[^(]*)\(\?:/)?.[1];
      const root = route.headers.Location.slice(0, -2) || '/';
      if (prefix) routes.push({ src: `^${prefix}/?$`, headers: { Location: root }, status: route.status });
      route.headers.Location += '/';
    }
  }
  routes.push(route);
}
config.routes = routes;
writeFileSync(file, JSON.stringify(config));
console.log(`patch-vercel-redirects: ${patched} redirect routes now accept a trailing slash`);
