# Phase 7 — recette et bascule

Le site respecte le critère d'acceptation sur les 164 pages comparables avec WordPress. Il reste à le déployer, à refaire la mesure sur la préversion Vercel et à basculer le DNS : tout est outillé, les étapes qui demandent vos comptes sont dans `docs/cutover-plan.md`.

## Livré

| Quoi | Où |
|---|---|
| Outil de recette WordPress ↔ nouveau site (captures, comparaison, rapport, écarts justifiés) | `scripts/parity/`, `npm run parity:capture` / `parity:compare` |
| Compte rendu de recette | `docs/acceptance-report.md` |
| Contrôle d'un déploiement Vercel (redirections réelles, slash final, 404, noindex, en-têtes, estimateur, `/keystatic`, GTM) | `npm run check:deploy -- <url>` |
| Serveur local qui rejoue `vercel.json` (`astro preview` ne fonctionne pas avec l'adaptateur Vercel) | `npm run serve:build` |
| Contrôle automatique à chaque pull request | `.github/workflows/checks.yml` |
| Plan de bascule DNS, surveillance, retour arrière | `docs/cutover-plan.md` |
| `README.md` du dépôt | racine |

## Trouvailles de la recette

- **17 pages en échec au premier passage**, toutes expliquées : blocs vides de WordPress (témoignage, logos, bouton, paragraphe), pages `industries` (fiche réalisation à la place de l'index des secteurs), carrousel d'équipe qui défile seul, et trois points que le nouveau site fait mieux que WordPress (voir `docs/acceptance-report.md`). Aucune régression du nouveau site.
- **Texte « X SMEs already trust us »** visible sur six pages EN de WordPress : corrigé avec les chiffres français.
- **Pas de `h1`** : WordPress n'a qu'un `h1` vide ; le nouveau site n'en avait que sur 15 pages sur 260. Chaque page a maintenant un `h1` masqué visuellement.
- **DNS** : `www` porte aussi un enregistrement CAA, donc il doit pointer en A comme l'apex, pas en CNAME. TTL déjà à 5 minutes : retour arrière rapide.
- L'outil de recette a une limite assumée : il masque les défauts vides de WordPress au lieu de les reproduire. Ils sont listés dans le rapport.

## Décisions qui vous reviennent

1. **Pages néerlandaises** : 76 contenus (28 pages, 42 articles, 6 réalisations) n'existent pas sur WordPress et sont publiés tels quels. La décision 2 (par défaut) recommandait de les remettre après la bascule. Trois options : les publier après relecture par un néerlandophone, les publier en noindex, ou les retirer du lancement (je peux le faire).
2. **Organisation GitHub, dépôt privé, accès, Vercel** : `docs/decision-github-vercel.md`.
3. **Publication automatique d'articles** (décision 4) : à trancher avant le gel, sinon les articles Outrank/Soro publiés dans WordPress après la bascule disparaissent.
4. **Bandeau cookies et Consent Mode** : WordPress n'en a pas, le nouveau site non plus.
5. **Anti-spam des formulaires** (reCAPTCHA Formspree ou envoi vers Odoo, décision 5).
6. **Relecture des textes** remplacés pendant la phase 2 (`docs/phase2-notes.md`) et des corrections de contenu ci-dessus.
