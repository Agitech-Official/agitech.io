// Keystatic image fields store just the filename relative to their `directory`.
// All block images share one directory (public/assets/img/blocks) — this resolves
// a stored filename to the public URL the components render.
export function blockImg(filename?: string | null): string | undefined {
  return filename ? `/assets/img/blocks/${filename}` : undefined;
}

// Alt text derived from an image filename ("Image-logo-proactivedrive.png" -> "Proactivedrive"),
// for logos and badges that have no editable caption.
export function altFromFile(filename?: string | null): string {
  if (!filename) return '';
  const base = filename.replace(/\.[a-z0-9]+$/i, '').replace(/^image[-_ ]?logo[-_ ]?/i, '').replace(/[-_]+/g, ' ').trim();
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : '';
}
