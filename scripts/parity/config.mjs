// Settings of the WordPress ↔ Astro parity tool: pages compared, viewports, thresholds, zones masked.
import fs from 'node:fs';
import path from 'node:path';
import { follow, served } from '../lib/redirects.mjs';

export const OUT = path.resolve(process.env.PARITY_DIR || 'parity-data');

/** Acceptance criterion (plan, phase 7): per page and per viewport. */
export const THRESHOLDS = { heightPct: 1, pixelPct: 2, pixelmatch: 0.1 };

export const VIEWPORTS = {
  d: { name: 'desktop 1440', width: 1440, height: 900, mobile: false },
  m: { name: 'mobile 390', width: 390, height: 844, mobile: true },
};

export const BASES = {
  wp: process.env.WP_BASE || 'https://agitech.io',
  astro: process.env.ASTRO_BASE || 'http://127.0.0.1:4400',
};

// Requests that never matter for layout and only add noise (analytics, tag manager, booking widget, captcha).
export const BLOCKED = /googletagmanager|google-analytics|analytics\.google|googleadservices|doubleclick|facebook\.net|clarity\.ms|hotjar|bat\.bing|calendly\.com|google\.com\/recaptcha|gstatic\.com\/recaptcha/;

// Dynamic zones, hidden (not removed: the page keeps its height) in BOTH captures before the screenshot.
export const MASKS = [
  '.calendly-inline-widget', 'iframe',                 // Calendly widgets, any embed
  '.grecaptcha-badge', '.recaptcha-v2', '[class*="recaptcha"]', // reCAPTCHA
  '.name-date p:last-child',                           // publication dates in lists and articles
  '.experts-slider',                                   // team carousel: auto-scrolls, its position depends on the moment of the capture
];

export const NO_ANIMATION = '*,*::before,*::after{animation-duration:.001s!important;animation-delay:0s!important;transition-duration:.001s!important;transition-delay:0s!important;scroll-behavior:auto!important}';
export const MASK_CSS = `${MASKS.join(',')}{visibility:hidden!important}`;

/**
 * Empty blocks and stray spacing hidden in BOTH captures, so the rest of the page is still compared (the same empty
 * markup can exist on both sites). Each one is listed in the report. They are WordPress content defects (decision 1).
 */
export const WP_DEFECTS = [
  { css: '.feedback-section:not(:has(.feedback-content)){display:none!important}', reason: 'Bloc « témoignage » vide : WordPress laisse 299 px de blanc (réalisations Lastlink et Cro\'vettes).' },
  { css: '.companies-logos:not(:has(img)){display:none!important}.companies-logos .item:not(:has(img)){display:none!important}', reason: 'Emplacements de logos vides dans la grille « ils nous font confiance » des pages secteurs (huit sur les pages EN, trois sur la page ONG FR) : jusqu\'à 180 px de blanc.' },
  { css: '.primary-btn:not(:has(*)){display:none!important}', reason: 'Bloc bouton vide (`primary-btn`) ajouté par WordPress avant le vrai bouton, sections « Parlez de votre projet avec Sam » : 22 px de blanc en mobile.' },
  { css: 'body > p:empty{display:none!important}', reason: 'Paragraphe vide de 16 px ajouté par WordPress (wpautop) avant le pied de page.' },
];
export const WP_DEFECTS_CSS = WP_DEFECTS.map((d) => d.css).join('');

/** Pages that exist on WordPress under another URL than on the new site. */
const EXTRA_PAIRS = [{ id: 'home-en', wp: '/en/home-page/', astro: '/en/' }];

const idOf = (p) => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '__'));

/** Every WordPress URL (scripts/wp-urls.txt) that the new site serves as is, plus the explicit extras. */
export function loadPairs() {
  const urls = fs.readFileSync('scripts/wp-urls.txt', 'utf8').split('\n').filter(Boolean);
  const pairs = urls
    .filter((u) => !/\.[a-z]+$/.test(u) && follow(u).length === 1 && served(u))
    .map((u) => ({ id: idOf(u), wp: u, astro: u }));
  return [...pairs, ...EXTRA_PAIRS.filter((e) => !pairs.some((p) => p.id === e.id))];
}

/** Known, accepted differences: page path (WordPress side) → reason. */
export const deviations = JSON.parse(fs.readFileSync(new URL('./deviations.json', import.meta.url), 'utf8'));
