// Lints the CMS content before a build: two entries on the same URL, a translationKey used twice in one
// language, an invalid urlSlug. Errors stop the build (`prebuild`), warnings are only printed.
//   npm run check:content
import { contentIndex } from '../src/lib/translations.mjs';

const { entries, problems } = contentIndex();
const errors = problems.filter((p) => p.level === 'error');
const warnings = problems.filter((p) => p.level === 'warning');
console.log(`${entries.length} content entries checked: ${errors.length} error(s), ${warnings.length} warning(s).`);
for (const p of [...errors, ...warnings]) console.log(`  ${p.level === 'error' ? 'ERROR  ' : 'warning'} ${p.message}`);
process.exit(errors.length ? 1 : 0);
