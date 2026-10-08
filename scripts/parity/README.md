# Recette de parité WordPress ↔ nouveau site

Compare chaque page du site WordPress (`https://agitech.io`) à sa page sur le nouveau site, en 1440 px et en 390 px, et applique le critère d'acceptation : **hauteur à ±1 %, moins de 2 % de pixels différents**, zones dynamiques masquées.

## Utilisation

```bash
npm run build && npm run serve:build            # le nouveau site, avec les règles de vercel.json, sur http://127.0.0.1:4400
npm run parity:capture                          # WordPress + nouveau site, 164 pages, 2 formats (≈ 30 min)
npm run parity:compare                          # rapport : parity-data/report/report.md
```

| Option | Effet |
|---|---|
| `--site wp` / `--site astro` | ne capturer qu'un site. WordPress se capture **une fois** ; ensuite seul `--site astro` est à refaire |
| `--only id,id` | quelques pages (l'identifiant est le chemin sans slash : `contact-us`, `en__blog`) |
| `--viewports d` / `m` | un seul format |
| `--concurrency 6` | captures en parallèle (4 par défaut) |

Variables : `WP_BASE` (défaut `https://agitech.io`), `ASTRO_BASE` (défaut `http://127.0.0.1:4400`, ou une préversion Vercel), `PARITY_DIR` (défaut `parity-data`, ignoré par Git), `CHROME_PATH` si Chromium n'est pas trouvé (`npx playwright-core install chromium` sinon).

## Ce qui est mesuré

- **Hauteur** de la page entière, et **pixels différents** (comparaison par bandes de 100 px, tolérance de couleur 0,1). Les pages doivent avoir la même hauteur pour que la comparaison pixel soit juste : une ligne de décalage fait diverger tout le reste.
- **Zones masquées** dans les deux captures (`config.mjs`, `MASKS`) : widgets Calendly et tout iframe, reCAPTCHA, dates de publication. Les requêtes d'analyse, de Tag Manager, de Calendly et de reCAPTCHA sont bloquées.
- **Contrôles SEO** sans effet sur le verdict, listés dans le rapport : titre, description, `h1`, canonical, images cassées.
- Verdicts : `PASS`, `JUSTIFIÉ` (page en échec mais listée dans `deviations.json`), `FAIL`. Code de sortie 1 s'il reste un `FAIL`. Pour chaque page hors `PASS`, une image « WordPress | nouveau site | différence » est écrite dans `parity-data/report/diff/`.

## Défauts de WordPress

Un défaut de contenu de WordPress que le nouveau site ne reproduit pas (décision 1) ne doit pas masquer le reste de la page.

- **Masqué dans la capture WordPress**, pour toutes les pages : `WP_DEFECTS` dans `config.mjs` (blocs vides, paragraphe vide). Le rapport les liste.
- **Écart justifié** pour une page entière : une entrée `"/chemin/": { "reason": "…" }` dans `deviations.json`. Ajouter `"wpCss": "…"` pour masquer en plus un élément propre à cette page dans la capture WordPress.

## Après la bascule DNS

`agitech.io` ne sert plus WordPress : ne plus capturer `--site wp`. Comparer le nouveau site à la capture WordPress conservée (`parity-data/wp`), avec `--site astro` puis `parity:compare`.
