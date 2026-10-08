# Plan de bascule et de retour arrière

Passage de agitech.io de WordPress à ce site sur Vercel. Les étapes qui demandent un accès à Vercel, GitHub, Route 53, Search Console, GTM ou Formspree sont à faire par vous ; tout le reste est outillé (`npm run check:deploy`, `npm run parity:*`).

## Ce que j'ai relevé (8 octobre 2026, DNS public)

| Élément | Valeur actuelle | Conséquence |
|---|---|---|
| Hébergeur DNS | Route 53 (serveurs `awsdns`) | Les changements se font dans la zone Route 53 d'Agitech |
| `agitech.io` | A `34.243.63.23` (serveur WordPress, Apache), TTL 300 s | À repointer vers Vercel |
| `www.agitech.io` | A `34.243.63.23`, TTL 300 s, **plus un enregistrement CAA** | Ne pas le transformer en CNAME (un CNAME ne coexiste pas avec un autre enregistrement) : le pointer en A comme l'apex |
| Messagerie | MX Google Workspace ; SPF `include:mailgun.org` | Ne pas toucher aux MX ni aux TXT. Remarque hors bascule : le SPF ne mentionne pas Google |
| CAA | `letsencrypt.org` uniquement | Compatible avec les certificats Vercel (Let's Encrypt) |
| HTTP et `www` | WordPress redirige en 301 vers `https://agitech.io/` | À retrouver : `vercel.json` redirige `www` vers l'apex, Vercel gère HTTP vers HTTPS |

Le TTL est déjà de 5 minutes : il n'y a pas à l'abaisser avant la bascule, et un retour arrière prend le même temps.

## Avant le jour J

1. **Décisions** : organisation GitHub et accès (`docs/decision-github-vercel.md`), bandeau cookies et Consent Mode, anti-spam des formulaires (reCAPTCHA Formspree ou Odoo, décision 5), publication automatique d'articles (décision 4, voir « Articles publiés pendant la bascule »).
2. **Comptes** : équipe Vercel et projet relié au dépôt ; variables du `.env.example` ; GitHub App de Keystatic (`docs/phase5-notes.md`) ; déclencheurs GTM pour `thank-you-form` et `thank-you-meeting`.
3. **Préversion** : déployer la branche, puis
   ```bash
   npm run check:deploy -- https://<préversion>.vercel.app
   ```
   Tout doit passer : redirections, slash final, 404, noindex, en-têtes, flux, estimateur (refus d'une origine étrangère), `/keystatic`. Faire relire les textes remplacés (`docs/phase2-notes.md`) et les corrections de contenu (`docs/acceptance-report.md`).
4. **Formulaires** : un envoi réel depuis la préversion pour chacun (contact, newsletter), un rendez-vous Calendly de test, une estimation du simulateur ; vérifier réception et page de remerciement.
5. **Gel de WordPress** (date convenue) : plus de publication dans WordPress, puis
   ```bash
   npm run wp:import -- --apply --update
   npm run build && npm run check:content && npm run check:build && npm run check:redirects
   ```
   et commit des nouveaux articles.
6. **Sauvegarde** de WordPress : copie complète (fichiers et base) et capture de référence `parity-data/wp` (`npm run parity:capture -- --site wp`), à conserver : elle reste utilisable après la bascule.

## Jour J (créneau calme, de préférence un matin de semaine)

| # | Étape | Vérification |
|---|---|---|
| 1 | Vercel → Production : `PUBLIC_INDEXABLE=true`, `PUBLIC_GTM_ID=GTM-P7LT3M5`. Déployer `main`. | `npm run check:deploy -- https://<production>.vercel.app --indexable --gtm GTM-P7LT3M5` |
| 2 | Vercel → Domains : ajouter `agitech.io` et `www.agitech.io` au projet. Si Vercel demande une vérification de propriété, créer le TXT indiqué dans Route 53. | Vercel affiche les enregistrements attendus |
| 3 | Route 53 : `agitech.io` → A `76.76.21.21` ; `www` → A `76.76.21.21` (valeurs à confirmer dans l'écran Domains de Vercel). MX, TXT, CAA et les autres sous-domaines restent tels quels. | `dig +short agitech.io` renvoie l'adresse Vercel |
| 4 | Attendre le certificat (quelques minutes) | `curl -I https://agitech.io` répond sans erreur TLS, en-tête `server: Vercel` |
| 5 | Contrôle complet | `npm run check:deploy -- https://agitech.io --indexable --gtm GTM-P7LT3M5` |
| 6 | Contrôle métier | un envoi de contact réel, un rendez-vous Calendly, Tag Assistant (conversions `merci-formulaire`, `merci-rdv`, `calendly_scheduled`) |
| 7 | Search Console : soumettre `https://agitech.io/sitemap.xml` ; inspecter l'accueil, un article, une page secteur | URL indexables, aucune « bloquée par robots.txt » |

Laisser WordPress allumé et inchangé sur son serveur : c'est le plan de retour.

## Après la bascule (30 premiers jours)

- **Search Console** : couverture et erreurs 404 (comparer avec `scripts/wp-urls.txt`), sitemap lu, exploration, Core Web Vitals.
- **Mesure** : GA4 et Ads, conversions de la semaine contre la semaine précédente (le comptage unique corrige l'ancien double comptage : un recul apparent est attendu).
- **Disponibilité** : ajouter agitech.io à la supervision existante.
- **Parité** : relancer `npm run parity:capture -- --site astro` puis `npm run parity:compare` après chaque grosse modification, contre la capture WordPress conservée.
- Ne pas arrêter WordPress avant 30 jours sans problème.

## Articles publiés pendant la bascule

Outrank/Soro publient environ un article par jour dans WordPress. Après la bascule, ces articles n'apparaissent plus sur le site. Avant le jour J : suspendre cette publication ou décider de la suite (décision 4). Tant que WordPress reste allumé, `npm run wp:import -- --apply` peut rapatrier les articles manquants.

## Retour arrière

**Déclencheurs** : formulaires qui n'arrivent pas, erreurs 5xx, pages principales cassées, chute brutale du trafic ou des conversions.

| Cas | Action | Durée |
|---|---|---|
| Problème de site (code ou contenu) | Vercel → Deployments → promouvoir le déploiement précédent, ou annuler le commit sur `main` | 1 à 3 minutes, sans toucher au DNS |
| Problème de domaine ou de plateforme | Route 53 : remettre `agitech.io` et `www` en A `34.243.63.23` | environ 5 à 10 minutes (TTL 300 s) |

- La messagerie n'est pas touchée dans les deux cas.
- Les envois de formulaires vont chez Formspree, pas dans WordPress : rien n'est perdu au retour.
- Un article créé dans Keystatic après la bascule n'existe pas dans WordPress : l'exporter (fichier `.mdoc` du dépôt) avant de revenir.
- Le retour DNS ne remet pas `PUBLIC_INDEXABLE` à zéro : le site Vercel reste indexable sur son adresse `*.vercel.app` (le retirer si le retour dure).

## Ce qui ne bouge pas

Les sous-domaines d'Agitech (Odoo, supervision, etc.) ne sont pas concernés : seuls `agitech.io` et `www` changent.
