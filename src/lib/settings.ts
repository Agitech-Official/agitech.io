// Editable site settings (Keystatic singletons "Réglages du site", "Navigation", "Pied de page", "Libellés").
// They are plain JSON files under src/content/settings, imported so that a change in the editor is picked up
// by the dev server and baked into the build.
import site from '../content/settings/site.json';
import navigation from '../content/settings/navigation.json';
import footer from '../content/settings/footer.json';
import labels from '../content/settings/labels.json';

export { site, navigation, footer, labels };
