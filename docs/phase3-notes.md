# Phase 3 — gabarits blog, article et réalisations

Objectif : les pages qui n'étaient pas faites de blocs (liste du blog, article, liste des réalisations) rendent le même HTML que WordPress, avec les mêmes données.

## Ce qui a changé

- **Liste du blog** (`/blog/`, `/en/blog/`, `/nl/blog/`) et **liste des réalisations** (`/case-study/`, `/en/case-study/`, `/nl/case-study/`) sont maintenant des pages Keystatic composées de blocs (hero, liste, « Parlez avec Sam »), comme sur WordPress. Deux nouveaux blocs : `blogPosts` et `businessCasesList`. Les cartes viennent des collections `Blog` et `Business Cases` dans la langue de la page.
- **Filtres et pagination** : onglets de catégories / types et bouton « voir plus » par 8, en JavaScript (`public/wp-theme/js/agitech-theme.js`), à la place des appels AJAX de WordPress. Toutes les cartes sont dans le HTML.
- **Article** : composant `PostArticle` (barre Retour / Partagez / Envoyez, catégories, titre, auteur, date, contenu, encart auteur). Le sommaire latéral n'y figure plus (décision 2).
- **Auteurs** : nouvelle collection `Auteurs` (Sam Gutman, Diego, agitech) avec photo, intitulé, texte et site, reprise des profils WordPress.
- **Articles** : champs `author` (relation), `categories` (liste), `coverImage` (image de la carte) et `publishedAt` (date et heure) renseignés pour les 92 articles ; 43 images de couverture dans `public/assets/img/blog/`.
- **Business cases** : champs `client` (titre de la carte), `types` (pastilles et filtres), `coverImage` (vraie photo), `publishedAt` (ordre) ; l'ancien champ `industry` est supprimé.
- **Dates** : affichées comme sur WordPress (« octobre 7, 2026 », « August 11, 2026 »), avec les noms de mois de la langue.

## Corrections volontaires

- Libellés « voir plus de case » (FR) et « see more boxes » (EN), qui étaient des valeurs par défaut de WordPress : remplacés par « Voir plus d'articles / de cas », « See more posts / cases ».
- Barre de l'article et bouton « Visiter le site » : WordPress les affichait en français sur les pages EN, ils sont traduits (EN, NL).
- Encart auteur : lien `mailto:` correct (WordPress avait `href="sam@agitech.io"`, relatif), « viso call » corrigé, antislash de « d\'Agitech » retiré.
- Un paragraphe vide de 16 px sous la liste des réalisations sur WordPress n'est pas reproduit.

## Ce qui reste (phase 4)

- **62 articles** présents sur WordPress et absents du repo (104 FR + 8 EN contre 42 + 8). La liste du blog est donc identique à WordPress pour les 8 articles EN, mais pas pour la première page FR (les 8 plus récents manquent).
- **Corps des articles** : mise en forme et images propres à certains articles (graphique, tailles de texte) perdues à la conversion initiale en Markdoc ; images `/wp-content/uploads/` du texte à copier.
- Pages NL : mêmes gabarits, contenu NL existant.
- Encart auteur EN : WordPress affiche le texte français ; non traduit faute de texte source.
