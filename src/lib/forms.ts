// Single place for the form back end (currently Formspree). The contact form and the footer
// newsletter both post here; the migration plan replaces it (CRM lead + anti-spam) in one edit.
export const FORM_ENDPOINT = 'https://formspree.io/f/xeajdqgr';
export const CONTACT_SUBJECT = 'Nouvelle demande de contact - Agitech';
export const NEWSLETTER_SUBJECT = 'Inscription newsletter - Agitech';

// Formspree redirects to `_next` after a successful post and wants an absolute URL. Previews redirect to
// themselves (VERCEL_URL) so testing a form never lands on the live site.
const origin = process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://agitech.io';
export const absoluteUrl = (path: string) => new URL(path, origin).href;
export const THANK_YOU_PATH = { fr: '/merci-formulaire/', en: '/en/thank-you-form/', nl: '/nl/thank-you-form/' } as const;
