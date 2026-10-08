// Language of the page being rendered, from its URL (FR has no prefix, EN under /en/, NL under /nl/).
// Blocks use it for the few labels WordPress kept in ACF options pages (e.g. "En savoir plus").
import { labels } from './settings';
export type Lang = 'fr' | 'en' | 'nl';

export function langOf(url: URL): Lang {
  const m = url.pathname.match(/^\/(en|nl)(\/|$)/);
  return (m ? m[1] : 'fr') as Lang;
}

export const learnMoreLabel: Record<Lang, string> = { fr: labels.fr.learnMore, en: labels.en.learnMore, nl: labels.nl.learnMore };
