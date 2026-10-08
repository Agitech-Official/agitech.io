# agitech.io

Site d'Agitech : Astro + Keystatic (éditeur sur `/keystatic`), déployé sur Vercel. Il reprend à l'identique l'ancien site WordPress.

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur local, éditeur sur http://localhost:4321/keystatic (fichiers locaux) |
| `npm run build` | construit le site (lance d'abord `check:content`) |
| `npm run serve:build` | sert le build avec les redirections et en-têtes de `vercel.json` |
| `npm run check:content` | conflits d'adresse, clés de traduction, slugs |
| `npm run check:build` | canonical, hreflang, sitemap, JSON-LD, liens et images du build |
| `npm run check:redirects` | redirections de `vercel.json` rejouées sur les anciennes adresses de WordPress |
| `npm run check:deploy -- <url>` | contrôle d'un déploiement Vercel (préversion ou production) |
| `npm run parity:capture` / `parity:compare` | recette visuelle WordPress ↔ nouveau site |
| `npm run wp:import -- --apply` | rapatrie les articles de WordPress (lecture seule sur WordPress) |

Variables d'environnement : `.env.example`.

## Documentation (`docs/`)

- `guide-editeurs.md` : modifier le site sans toucher au code.
- `cutover-plan.md` : bascule DNS, surveillance, retour arrière.
- `acceptance-report.md` : résultat de la recette de parité.
- `decision-github-vercel.md` : organisation GitHub, accès, Vercel.
- `phase2-notes.md` à `phase6-notes.md` : ce qui a été fait, phase par phase, et pourquoi.
- `deferred-additions.md` : ajouts propres au nouveau site, mis de côté pour la bascule à l'identique.
