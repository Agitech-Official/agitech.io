# Phase 4 — contenu et médias

Le blog du repo est maintenant identique à celui de WordPress : mêmes articles, mêmes images, mêmes liens, mêmes titres et descriptions SEO.

## Mesures (Playwright, 1440 px et 390 px, 112 articles WordPress comparés au repo)

| | Desktop | Mobile |
|---|---|---|
| Écart de hauteur de page | 0 % pour les 112 | 0 % pour les 112 |
| Pixels différents (médiane / pire cas) | 0 % / 0,1 % | 0,1 % / 0,2 % |
| Images chargées | 112/112 identiques | 112/112 identiques |

Pages d'index : blog FR et EN à 0 % de pixels (desktop et mobile). Réalisations FR ≈ 1 % (0,4 % de hauteur). Réalisations EN à 0 % en desktop ; en mobile 9 % de pixels pour une hauteur identique, car WordPress n'y charge pas les images des cartes dans la capture (alt « trotinette électrique » visible) et Astro les affiche.

Build : `npx astro build` passe, 261 pages ; 14 792 liens et ressources internes vérifiés dans la sortie, 0 cassé (PDF `AgiTech-CHECKLIST-Attendance.pdf` compris).

## Ce qui a été fait

- **62 articles importés** (FR 104 + EN 8 = 112 sur WordPress, comme le repo) avec auteur, catégories, date de publication, extrait, couverture, titre et description SEO tirés de Rank Math.
- **Images** : 105 couvertures dans `public/assets/img/blog/`, images du texte dans `public/wp-content/uploads/…` (≈ 8 Mo avec le reste des médias du thème). Les URL des articles n'ont pas changé.
- **Mise en page des articles** : sur les 112 articles WordPress, 98 sont en Markdoc et 14 en HTML brut (champ `contentHtml` dans Keystatic) parce que WordPress y affiche du balisage que Markdoc ne sait pas exprimer : blocs Gutenberg avec classes, styles en ligne, `<br>`, sommaire.
- **Classe `post-template-default`** ajoutée au `<body>` des articles : les règles du thème pour les listes (marge basse de 25 px), les tableaux et les liens en dépendent. Sans elle, les articles avec listes perdaient jusqu'à 3,4 % de hauteur.
- **Texte brut de WordPress** : le gabarit d'article de WordPress affiche le contenu stocké sans `wptexturize`. L'importateur part donc de cette page (et non de l'API REST) pour garder les apostrophes et tirets droits ; une apostrophe courbe suffisait à ajouter une ligne et décaler le reste de la page.
- **Liens internes** : anciennes URL `/fr_be/…`, `category/…`, `tag/…` réécrites. Trois liens que WordPress redirige en 301 pointent directement vers leur cible (`/home-page/` → `/`, `…-choose-3/` et `the-truth-…` → `/en/…`), y compris dans deux articles NL.

## Synchroniser avant la mise en ligne (gel)

WordPress continue de publier (≈ 1 article par jour via Outrank/Soro). Le jour du gel :

```bash
npm run wp:import                       # simulation : liste ce qui serait importé
npm run wp:import -- --apply            # importe les articles absents du repo
npm run wp:import -- --apply --update   # réécrit aussi les articles existants depuis WordPress
npm run wp:import -- --apply --only=slug-1,slug-2
```

Les options sont décrites en tête de `scripts/wp-import/import-posts.mjs`. L'importateur ne touche pas à WordPress (lecture seule).

## Limites et points ouverts

- **Décision 4 (publication automatique) toujours ouverte** : tant que WordPress est la source des articles Outrank/Soro, il faut relancer l'import avant la bascule. Après la bascule, ces articles devront arriver par Keystatic ou par un nouveau flux.
- **42 articles NL** n'ont pas d'équivalent sur WordPress : ils n'ont pas été rafraîchis et gardent leur contenu existant.
- Les 14 articles en HTML brut s'éditent dans un champ texte, pas dans l'éditeur riche de Keystatic.
- L'encart auteur EN reste en français, comme sur WordPress (pas de texte source).
- reCAPTCHA non reproduit (phase 5). Redirections `/business-cases/` → `/case-study/` et `en-home-page` à poser en phase 5.
