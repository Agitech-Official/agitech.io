// Médiathèque: every shared image (icons, logos, photos used in page blocks, case covers, author photos) is an
// entry of the `media` collection (src/content/media/<slug>.yaml: title, image, alt). Blocks store the entry's slug;
// this module turns a slug into the image URL and its alt text, like WordPress did with its media library.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const dir = () => path.join(process.cwd(), 'src/content/media');
let cache;
let loadedAt = 0;

function load() {
  const dev = process.env.NODE_ENV !== 'production';
  if (cache && (!dev || Date.now() - loadedAt < 1500)) return cache;
  const map = new Map();
  for (const f of fs.readdirSync(dir())) {
    if (!f.endsWith('.yaml')) continue;
    const d = YAML.parse(fs.readFileSync(path.join(dir(), f), 'utf8')) ?? {};
    map.set(f.slice(0, -'.yaml'.length), { src: d.image || undefined, alt: String(d.alt ?? '').trim() });
  }
  cache = map;
  loadedAt = Date.now();
  return map;
}

/** URL of a media entry's image. A reference to a missing entry stops the production build instead of shipping a broken image. */
export function mediaSrc(slug) {
  if (!slug) return undefined;
  const m = load().get(slug);
  if (m?.src) return m.src;
  const message = `Médiathèque : l'image "${slug}" est introuvable ou n'a pas de fichier.`;
  if (process.env.NODE_ENV === 'production') throw new Error(message);
  console.warn(message);
  return undefined;
}

/** Alt text of a media entry; the fallback when it has none. Empty = decorative image. */
export const mediaAlt = (slug, fallback = '') => (slug && load().get(slug)?.alt) || fallback;
