// FAQ answers are plain text with optional [label](url) links.
export const faqPlain = (s = '') => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
