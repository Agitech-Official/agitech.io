# Guide des éditeurs

Pour modifier le site agitech.io sans toucher au code : textes, articles, menus, pied de page.

## Se connecter

- Éditeur : `https://agitech.io/keystatic` (ou l'adresse de préversion Vercel de la branche sur laquelle vous travaillez).
- Connexion avec votre compte GitHub, qui doit avoir un accès en écriture au dépôt du site (voir `docs/decision-github-vercel.md`).
- Colonne de gauche : **Contenu** (Pages, Blog, Business Cases, Auteurs, Médiathèque) et **Réglages du site** (Réglages du site, Navigation, Pied de page, Libellés d'interface).

## Publier sans risque

Chaque enregistrement crée une modification dans GitHub. Le site de production ne change que lorsque cette modification arrive sur la branche `main`.

1. En haut à gauche, créez une **branche** (ex. `article-odoo-19`) et travaillez dessus.
2. Enregistrez. Vercel construit une **préversion** de la branche (lien dans la pull request GitHub) : vérifiez-y votre page.
3. Ouvrez une **pull request** sur GitHub, faites relire, puis fusionnez dans `main`. Le site est mis à jour en quelques minutes.

Si la construction échoue (message rouge dans GitHub / Vercel), l'ancien site reste en ligne. Le message le plus courant est expliqué en fin de guide.

## Écrire un article

Blog → **Create entry**. Champs importants :

| Champ | À savoir |
|---|---|
| Titre | Donne aussi le nom du fichier. |
| Langue | Français, English ou Nederlands. |
| Date et heure de publication | La date affichée vient d'ici. L'heure ordonne les articles du même jour. |
| Auteur, catégories | Les catégories s'affichent en pastilles. Pour qu'une catégorie ait son onglet dans le blog, ajoutez-la dans **Libellés d'interface → Onglets du blog**. |
| Résumé | Texte de la carte dans la liste, et description par défaut pour Google. |
| Image de couverture | Format paysage, à envoyer directement dans l'article. Le fichier est ajouté au site tel quel : réduisez-le avant (moins de 300 Ko). L'éditeur le range dans un dossier au nom de l'article et le renomme `coverImage`. |
| Titre SEO / Description SEO | Ce que Google affiche. Vides = titre et résumé de l'article. |
| Contenu | Éditeur de texte. Une image du texte s'insère avec le bouton Image ; cliquez ensuite dessus pour renseigner son **texte alternatif**. |

Les champs « Contenu HTML » ne servent qu'aux articles historiques de WordPress : ne pas les utiliser pour un nouvel article.

## Traduire une page ou un article

Une page et sa traduction sont reliées par la **Clé de traduction** : même valeur sur la version française, anglaise et néerlandaise (par convention, le slug français). Elle sert aux liens `hreflang` pour Google et au drapeau de langue, qui mène alors à la page jumelle. Sans clé, le drapeau mène à l'accueil de l'autre langue.

- Une seule langue : laissez la clé vide.
- Même adresse dans deux langues (ex. `contact-us` en français et en anglais) : les fichiers doivent avoir des noms différents (`contact-us`, `contact-us-en`) et la version qui ne porte pas le nom d'adresse reçoit `Slug de l'URL = contact-us`. Vide, l'adresse est le nom du fichier.

## Brouillon, indexation, partage

- **Brouillon** : coché, le contenu n'est pas publié (ni page, ni liste, ni sitemap, ni flux). Il reste visible dans les préversions Vercel.
- **Ne pas indexer (noindex)** : la page existe mais Google l'ignore, et elle sort du sitemap.
- **URL canonique** : seulement si la page reprend le contenu d'une autre ; adresse complète `https://agitech.io/…`.
- **Image de partage** : aperçu sur LinkedIn / WhatsApp, 1200 × 630 px conseillé. Vide = image de couverture, sinon image par défaut (Réglages du site).

## Menus, pied de page, libellés

- **Navigation** : un menu par langue. Trois niveaux : entrée → colonne → lien. Un lien `#` fait un titre sans destination. Le drapeau de langue est automatique.
- **Pied de page** : textes, adresse, liens du menu et mentions légales, par langue. Les réseaux sociaux se règlent dans **Réglages du site**.
- **Libellés d'interface** : « En savoir plus », boutons du blog, formulaire de contact, onglets du blog et des réalisations.

## Images des pages : la Médiathèque

Les icônes, logos, photos et images de couverture des réalisations utilisés dans les blocs des pages ne sont pas envoyés dans chaque bloc : ce sont des entrées de la **Médiathèque**, comme dans la médiathèque de WordPress.

- **Ajouter une image** : Médiathèque → *Create entry* → **Nom** (pour la retrouver), **Image** (le fichier) et **Texte alternatif**. Réduisez le fichier avant (SVG, WebP ou PNG léger).
- **Utiliser une image** : dans un bloc, le champ image propose la liste des entrées de la Médiathèque ; choisissez-la par son nom.
- **Texte alternatif** : il appartient à l'image et vaut partout où elle est utilisée. Il décrit l'image pour les lecteurs d'écran et Google. Vide, l'image est décorative (icône, fond).
- **Remplacer une image partout** : modifiez le fichier de l'entrée de la Médiathèque.
- Ne supprimez pas une entrée encore utilisée : la construction du site échoue avec « Médiathèque : l'image … est introuvable ».

## Ce qui ne s'édite pas ici

Pages de remerciement, page 404, formulaires (destinataires, anti-spam), logos du pied de page, redirections : voir une personne qui touche au code. Ces points sont décrits dans `docs/phase5-notes.md`.

## Messages d'erreur fréquents

- `… are both served at /… (give one of them a different "Slug de l'URL")` : deux contenus ont la même adresse. Donnez à l'un des deux un autre **Slug de l'URL**.
- `Médiathèque : l'image "…" est introuvable` : un bloc utilise une image supprimée de la Médiathèque. Recréez-la ou choisissez-en une autre dans le bloc.
- Lien cassé vers un brouillon : une page publiée renvoie vers un contenu coché *Brouillon*. Décochez-le ou retirez le lien (`npm run check:build` le signale).
