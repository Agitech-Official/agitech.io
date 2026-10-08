// Compares the WordPress and new-site captures and applies the acceptance criterion:
// per page and per viewport, height within ±1 % and fewer than 2 % of pixels different (masked zones excluded).
//   node scripts/parity/compare.mjs [--only id,id]
// Output: parity-data/report/report.md, results.json and diff/<id>-<viewport>.png (WordPress | new site | difference).
// Exit code 1 when a page fails and is not listed in deviations.json.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';
import { OUT, THRESHOLDS, VIEWPORTS, BASES, loadPairs, deviations, WP_DEFECTS } from './config.mjs';

const arg = (name) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : undefined; };
const only = arg('only') ? arg('only').split(',') : null;
const BAND = 100;

const read = (site, vp, id) => { try { return JSON.parse(fs.readFileSync(path.join(OUT, site, vp, `${id}.json`), 'utf8')); } catch { return null; } };
const norm = (s) => (s || '').toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
const pathOf = (u) => { try { return new URL(u).pathname; } catch { return u; } };

async function pixels(id, vp) {
  const a = await sharp(path.join(OUT, 'wp', vp, `${id}.png`)).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const b = await sharp(path.join(OUT, 'astro', vp, `${id}.png`)).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const w = a.info.width, rows = Math.min(a.info.height, b.info.height);
  if (w !== b.info.width) return { error: 'width differs' };
  let mismatch = 0; const bad = [];
  for (let y = 0; y < rows; y += BAND) {
    const n = Math.min(BAND, rows - y), off = y * w * 4;
    const m = pixelmatch(a.data.subarray(off, off + n * w * 4), b.data.subarray(off, off + n * w * 4), null, w, n, { threshold: THRESHOLDS.pixelmatch });
    mismatch += m; if (m / (w * n) > 0.1) bad.push(y);
  }
  return { pct: +(100 * mismatch / (w * rows)).toFixed(2), rows, firstBadY: bad[0] ?? null, badBands: bad.length, a, b };
}

async function diffImage(id, vp, px) {
  const { a, b } = px; const w = a.info.width, rows = Math.min(a.info.height, b.info.height);
  const d = Buffer.alloc(w * rows * 4);
  pixelmatch(a.data.subarray(0, w * rows * 4), b.data.subarray(0, w * rows * 4), d, w, rows, { threshold: THRESHOLDS.pixelmatch });
  const scale = w > 600 ? 480 / w : 1, sw = Math.round(w * scale), sh = Math.round(rows * scale);
  const tile = (buf) => sharp(buf, { raw: { width: w, height: rows, channels: 4 } }).resize(sw, sh).png().toBuffer();
  const [ta, tb, td] = await Promise.all([tile(a.data.subarray(0, w * rows * 4)), tile(b.data.subarray(0, w * rows * 4)), tile(d)]);
  fs.mkdirSync(path.join(OUT, 'report/diff'), { recursive: true });
  await sharp({ create: { width: sw * 3 + 20, height: sh, channels: 3, background: '#777' } })
    .composite([{ input: ta, left: 0, top: 0 }, { input: tb, left: sw + 10, top: 0 }, { input: td, left: 2 * sw + 20, top: 0 }])
    .png({ compressionLevel: 9 }).toFile(path.join(OUT, `report/diff/${id}-${vp}.png`));
}

const results = [];
for (const p of loadPairs()) {
  if (only && !only.includes(p.id)) continue;
  for (const vp of Object.keys(VIEWPORTS)) {
    const wp = read('wp', vp, p.id), as = read('astro', vp, p.id);
    if (!wp || !as) continue;
    const r = { id: p.id, path: p.wp, vp, wpStatus: wp.status, astroStatus: as.status, hWp: wp.scrollHeight, hAstro: as.scrollHeight };
    r.heightPct = +(100 * (as.scrollHeight - wp.scrollHeight) / wp.scrollHeight).toFixed(1);
    const px = await pixels(p.id, vp);
    r.pixelPct = px.pct ?? null; r.firstBadY = px.firstBadY ?? null; r.pixelError = px.error;
    r.checks = {
      title: norm(wp.title) === norm(as.title), description: norm(wp.description) === norm(as.description),
      // WordPress prints an empty <h1></h1>: nothing to match. The new site adds a visually hidden h1 to every page.
      h1: !wp.h1.some(Boolean) || JSON.stringify(wp.h1.map(norm)) === JSON.stringify(as.h1.map(norm)),
      canonical: pathOf(wp.canonical) === pathOf(as.canonical), brokenImages: as.brokenImages,
    };
    const pass = wp.status === 200 && as.status === 200 && Math.abs(r.heightPct) <= THRESHOLDS.heightPct && r.pixelPct !== null && r.pixelPct < THRESHOLDS.pixelPct;
    r.verdict = pass ? 'PASS' : deviations[p.wp] ? 'JUSTIFIÉ' : 'FAIL';
    if (!pass && px.a) await diffImage(p.id, vp, px);
    results.push(r);
  }
}

fs.mkdirSync(path.join(OUT, 'report'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'report/results.json'), JSON.stringify(results, null, 1));
const count = (vp, v) => results.filter((r) => r.vp === vp && r.verdict === v).length;
const lines = [`# Recette de parité WordPress ↔ nouveau site`, '',
  `Critère : hauteur à ±${THRESHOLDS.heightPct} %, moins de ${THRESHOLDS.pixelPct} % de pixels différents (zones dynamiques masquées), par page et par format.`,
  `WordPress : ${BASES.wp} · nouveau site : ${BASES.astro} · ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`, '',
  '| Format | Pages | Conformes | Écarts justifiés | À corriger |', '|---|---|---|---|---|',
  ...Object.keys(VIEWPORTS).map((vp) => `| ${VIEWPORTS[vp].name} | ${results.filter((r) => r.vp === vp).length} | ${count(vp, 'PASS')} | ${count(vp, 'JUSTIFIÉ')} | ${count(vp, 'FAIL')} |`), ''];
const table = (rows) => ['| Page | Format | Hauteur WP → site | Écart | Pixels | 1er écart (y) | Image |', '|---|---|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.path} | ${r.vp} | ${r.hWp} → ${r.hAstro} | ${r.heightPct} % | ${r.pixelPct ?? r.pixelError} % | ${r.firstBadY ?? '-'} | diff/${r.id}-${r.vp}.png |`)];
const fails = results.filter((r) => r.verdict === 'FAIL'), just = results.filter((r) => r.verdict === 'JUSTIFIÉ');
lines.push(`## À corriger (${fails.length})`, '', fails.length ? table(fails).join('\n') : 'Aucun.', '');
lines.push(`## Écarts justifiés (${just.length})`, '', just.length ? [table(just).join('\n'), '', ...[...new Set(just.map((r) => r.path))].map((u) => `- \`${u}\` : ${deviations[u].reason}`)].join('\n') : 'Aucun.', '');
const neutral = [...WP_DEFECTS.map((d) => ['toutes les pages', d.reason]), ...Object.entries(deviations).filter(([, d]) => d.wpCss).map(([u, d]) => [u, d.reason])];
lines.push(`## Défauts de WordPress masqués avant comparaison (${neutral.length})`, '', neutral.map(([u, reason]) => `- ${u.startsWith('/') ? `\`${u}\`` : u} : ${reason}`).join('\n'), '');
const seo = results.filter((r) => r.vp === 'd' && (!r.checks.title || !r.checks.description || !r.checks.h1 || !r.checks.canonical || r.checks.brokenImages));
lines.push(`## Titres, descriptions, h1, canonical, images (${seo.length} page(s) avec une différence)`, '', seo.length ? ['| Page | titre | description | h1 | canonical | images cassées |', '|---|---|---|---|---|---|', ...seo.map((r) => `| ${r.path} | ${r.checks.title ? 'ok' : '**≠**'} | ${r.checks.description ? 'ok' : '**≠**'} | ${r.checks.h1 ? 'ok' : '**≠**'} | ${r.checks.canonical ? 'ok' : '**≠**'} | ${r.checks.brokenImages || 0} |`)].join('\n') : 'Aucune.', '');
fs.writeFileSync(path.join(OUT, 'report/report.md'), lines.join('\n'));
for (const vp of Object.keys(VIEWPORTS)) console.log(`${VIEWPORTS[vp].name}: ${results.filter((r) => r.vp === vp).length} pages — ${count(vp, 'PASS')} conformes, ${count(vp, 'JUSTIFIÉ')} justifiés, ${count(vp, 'FAIL')} à corriger`);
console.log(`Rapport : ${path.relative(process.cwd(), path.join(OUT, 'report/report.md'))}`);
process.exit(fails.length ? 1 : 0);
