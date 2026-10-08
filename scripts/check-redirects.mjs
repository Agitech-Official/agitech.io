// Replays vercel.json through Vercel's own routing compiler (@vercel/routing-utils) and checks, on the built site:
//  1. every URL the WordPress site had (scripts/wp-urls.txt) ends on a real page, in at most 2 hops, without loops;
//  2. no page of the new site is redirected away from itself.
// Run after `npm run build`:  npm run check:redirects
import fs from 'node:fs';
import path from 'node:path';
import { STATIC_ROOT as ROOT, redirects, served, step, follow } from './lib/redirects.mjs';

const problems = [];
// Dropped on purpose (decision 8: the KML map file is not carried over); they simply 404.
const DROPPED = new Set(['/locations.kml']);
const urls = fs.readFileSync('scripts/wp-urls.txt', 'utf8').split('\n').filter((u) => u && !DROPPED.has(u));
for (const u of urls) {
  const chain = follow(u);
  const last = chain.at(-1);
  if (chain.length > 5) problems.push(`${u}  loops: ${chain.join(' > ')}`);
  else if (!served(last)) problems.push(`${u}  ends on ${last}, which does not exist`);
  else if (chain.length > 3) problems.push(`${u}  takes ${chain.length - 1} hops: ${chain.join(' > ')}`);
}
// the new site's own pages must never be redirected
let own = 0;
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name === 'index.html') {
      const url = '/' + path.relative(ROOT, d) + '/';
      const u = url === '//' || url === '/./' ? '/' : url;
      own++;
      const to = step(u);
      if (to) problems.push(`${u}  (a page of the new site) is redirected to ${to}`);
    }
  }
})(ROOT);

const moved = urls.filter((u) => follow(u).length > 1).length;
console.log(`${urls.length} WordPress URLs (${moved} redirected, ${urls.length - moved} served as is), ${own} pages of the new site, ${redirects.length} compiled redirect routes.`);
console.log(`${problems.length} problem(s)`);
problems.forEach((m) => console.log('  ' + m));
process.exit(problems.length ? 1 : 0);
