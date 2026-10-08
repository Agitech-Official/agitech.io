# Compte rendu de recette : parité avec WordPress

Mesure du 8 octobre 2026, nouveau site contre le site WordPress en ligne, **164 pages, en 1440 px et en 390 px**.

**Critère** (plan, phase 7) : par page et par format, hauteur à ±1 % et moins de 2 % de pixels différents, zones dynamiques masquées.

## Résultat

| Format | Conformes | Écarts justifiés | À corriger |
|---|---|---|---|
| Desktop 1440 px | 161 | 3 | 0 |
| Mobile 390 px | 157 | 7 | 0 |

La médiane des pixels différents, en desktop, est de 0,02 %. Les pages conformes les plus proches de la limite sont la page Contact en mobile (1,6 %), sa version EN (1,5 %) et `erp-sea` en mobile (1,3 %).

Images : aucune image cassée sur les 164 pages. Les 76 contenus néerlandais (28 pages, 42 articles, 6 réalisations) n'existent pas sur WordPress : ils ne sont pas comparables.

## Écarts justifiés

| Page | Écart | Raison |
|---|---|---|
| `/industries/` et `/en/industries/` | hauteur −22 % à −42 % | WordPress sert à cette adresse une fiche réalisation (« Cro'vettes & POS »). Le nouveau site garde la page « Une expertise Odoo par industrie » (décision 1, `docs/phase2-notes.md`). |
| `/en/industries-e-commerce/`, `/en/industries-international-associations/`, `/en/industries-ngos-international-associations/`, `/en/industries-wholesale-b2b-sales/`, `/en/solution-business-services/` | +0,5 % à +1 %, 3 à 5 % de pixels | Le titre « X SMEs already trust us in this sector » (le « X » n'a jamais été remplacé sur WordPress) porte maintenant le vrai chiffre de la page française : il n'occupe pas le même nombre de lignes. |

## Défauts de WordPress masqués avant la mesure

Contenus de WordPress que le nouveau site ne reproduit pas ; masqués dans les deux captures pour que le reste de chaque page soit quand même comparé (`scripts/parity/config.mjs`).

- Bloc « témoignage » vide : 299 px de blanc sur les réalisations Lastlink et Cro'vettes.
- Emplacements de logos vides dans la grille « ils nous font confiance » : huit sur les pages secteurs EN, neuf sur la page FR Transport, trois sur la page FR ONG, jusqu'à 180 px de blanc.
- Paragraphe vide de 16 px avant le pied de page (page Contact).
- Bloc bouton vide avant le vrai bouton de la section « Parlez de votre projet avec Sam » : 22 px en mobile.

Zones dynamiques masquées : widgets Calendly et iframes, reCAPTCHA, dates, carrousel d'équipe (qui défile tout seul).

## Corrections de contenu faites pendant la recette (à valider)

1. **« X SMEs already trust us in this sector »** sur six pages secteurs EN : remplacé par les chiffres de la version française (14 e-commerce, 16 construction, 15 services aux entreprises, 6 transport, 5 ONG, 10 grossistes B2B). C'est visible du public sur WordPress aujourd'hui.
2. **Un `h1` sur chaque page.** WordPress n'a qu'un `<h1>` vide ; le nouveau site n'en avait que sur 15 pages sur 260. Chaque page porte maintenant un `h1` masqué visuellement (le titre SEO de la page, sans suffixe de marque), comme celui déjà présent sur la page forfait : sans effet sur l'affichage.
3. **Titres de `/industries/` et `/en/industries/`** : ceux de WordPress sont rétablis (décision 3).

## Ce que la comparaison SEO montre

| Contrôle | Résultat |
|---|---|
| Titre de page | identique sur 164 pages sur 164 |
| Description | WordPress n'en a pas sur 54 pages ; le nouveau site en ajoute une. Aucune description de WordPress n'est perdue ni modifiée. |
| `h1` | WordPress : un `h1` vide, plus un `h1` sur les pages légales (même texte que chez nous). Voir correction 2. |
| Canonical | identique, sauf `/en/home-page/` (WordPress) devenue `/en/`, avec redirection |

## Autres contrôles passés

`check:content` (254 entrées, 0 erreur), `check:build` (260 pages, 15 749 liens et ressources, 0 problème), `check:redirects` (196 anciennes adresses : 33 redirigées, 163 servies telles quelles, 0 en erreur), `check:deploy` sur le build servi avec les règles de `vercel.json` (14 contrôles sur 14).

## Ce qui reste à mesurer avec les vrais services

- La mesure ci-dessus est faite sur le build servi localement. Avant la bascule, la refaire sur la **préversion Vercel** : `ASTRO_BASE=https://<préversion>.vercel.app npm run parity:capture -- --site astro`, puis `npm run parity:compare` (la capture de WordPress est conservée dans `parity-data/wp`).
- `npm run check:deploy -- https://<préversion>.vercel.app` teste ce que le build local ne peut pas montrer : le comportement réel de Vercel pour le slash final et les redirections, l'estimateur (qui doit refuser une origine étrangère) et `/keystatic`.
- Les 76 contenus néerlandais n'ont pas de référence WordPress : à relire par un néerlandophone avant publication, ou à retirer du lancement (voir `docs/phase7-notes.md`).
