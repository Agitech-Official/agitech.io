// Block images are entries of the Médiathèque (see media.mjs): block fields store the entry's slug.
import { mediaSrc, mediaAlt } from './media.mjs';

/** Public URL of the media entry `slug`. */
export const blockImg = (slug?: string | null): string | undefined => mediaSrc(slug);
/** Alt text of the media entry `slug`, else `fallback`. */
export const blockAlt = (slug?: string | null, fallback = ''): string => mediaAlt(slug, fallback);
