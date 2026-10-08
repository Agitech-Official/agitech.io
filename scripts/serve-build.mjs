// Serves the built site (.vercel/output/static) the way Vercel will: vercel.json redirects and headers applied,
// 404.html with a 404 status. `astro preview` does not work with the Vercel adapter, so this is the local stand-in
// (the /api and /keystatic functions are not emulated).
//   npm run build && npm run serve:build [-- --port 4400]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { STATIC_ROOT, step, headerRoutes } from './lib/redirects.mjs';

const port = +(process.argv.includes('--port') ? process.argv[process.argv.indexOf('--port') + 1] : 4400);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.pdf': 'application/pdf' };

const file = (urlPath) => {
  const f = path.join(STATIC_ROOT, decodeURIComponent(urlPath));
  if (!f.startsWith(STATIC_ROOT)) return null;
  if (fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  const idx = path.join(f, 'index.html');
  return fs.existsSync(idx) ? idx : null;
};

http.createServer((req, res) => {
  const [urlPath, query] = req.url.split('?');
  const headers = {};
  for (const r of headerRoutes) if (r.re.test(urlPath)) Object.assign(headers, r.headers);
  const to = step(urlPath);
  if (to) { res.writeHead(308, { ...headers, Location: query ? `${to}?${query}` : to }); return res.end(); }
  const f = file(urlPath);
  if (!f) { res.writeHead(404, { ...headers, 'Content-Type': TYPES['.html'] }); return res.end(fs.readFileSync(path.join(STATIC_ROOT, '404.html'))); }
  res.writeHead(200, { ...headers, 'Content-Type': TYPES[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(port, '127.0.0.1', () => console.log(`Serving ${path.relative(process.cwd(), STATIC_ROOT)} with vercel.json rules on http://127.0.0.1:${port}`));
