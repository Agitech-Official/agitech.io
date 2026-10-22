// Run after `astro build`. The Vercel adapter writes redirect routes such as ^/case-study$
// that only match WITHOUT a trailing slash, while every old WordPress URL ends with "/".
// - make the trailing slash optional so /case-study/ and /fr_be/jobs/ redirect too;
// - wildcard targets (/$1) get a trailing slash so old links redirect once, not twice.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const file = '.vercel/output/config.json';
if (!existsSync(file)) process.exit(0);

const config = JSON.parse(readFileSync(file, 'utf8'));
const routes = [];
let patched = 0;
for (const route of config.routes ?? []) {
  const isRedirect = route.headers?.Location && [301, 302, 307, 308].includes(route.status);
  if (isRedirect && route.src?.endsWith('$') && !route.src.endsWith('/?$')) {
    route.src = route.src.slice(0, -1) + '/?$';
    patched++;
    if (route.headers.Location === '/$1') {
      // The bare prefix (e.g. /fr_be/) has no $1: send it to the homepage.
      const prefix = route.src.match(/^\^(\/[^(]*)\(\?:/)?.[1];
      if (prefix) routes.push({ src: `^${prefix}/?$`, headers: { Location: '/' }, status: route.status });
      route.headers.Location = '/$1/';
    }
  }
  routes.push(route);
}
config.routes = routes;
writeFileSync(file, JSON.stringify(config));
console.log(`patch-vercel-redirects: ${patched} redirect routes now accept a trailing slash`);
