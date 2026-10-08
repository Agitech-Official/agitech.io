# Phase 5 — technique, SEO et Vercel

Le site est prêt à être déployé sur Vercel et à remplacer WordPress côté référencement : redirections, hreflang réels, sitemap, 404, flux RSS, GTM, formulaires protégés. Il reste fermé aux moteurs tant que l'interrupteur de mise en ligne n'est pas activé.

Contrôle : `npm run build && npm run check:build && npm run check:redirects` (voir « Vérifications »).

## Ce qui a été fait

**Lien de traduction et hreflang**
- Champ `translationKey` (Keystatic : pages, articles, réalisations), identique sur les versions FR, EN et NL d'un même contenu. 187 entrées en ont un : 26 pages en 3 langues, 2 pages FR+NL, 6 réalisations en 3 langues, 87 articles liés. Les 67 articles sans jumeau n'en ont pas, donc pas de hreflang.
- Les paires viennent de Polylang (API REST de WordPress) et des conventions du repo (NL reprend le slug FR). Un article FR (« faites-ce-que-je-dis… ») déclare à tort comme traductions celles d'un autre article dans WordPress : ses paires ont été ignorées.
- `hreflang` : seulement les langues qui existent, la page elle-même incluse, `x-default` = la version française. Auparavant chaque page annonçait FR, EN et NL même sans traduction.
- Sélecteur de langue (drapeaux) : mène à la page jumelle, ou à l'accueil de l'autre langue s'il n'y en a pas, comme Polylang.
- Règles d'URL partagées dans `src/lib/routes.mjs` (les routes EN/NL les importent), index des traductions dans `src/lib/translations.mjs`.

**Balises et données structurées** (`src/layouts/Layout.astro`)
- `canonical` calculé pour toutes les pages (auparavant absent des pages de remerciement, du simulateur…).
- Open Graph et Twitter : image de couverture des articles et réalisations, sinon le logo de WordPress (`Signature-Logo.png`) ; `og:type` article pour articles et réalisations ; `article:published_time` et `article:section` pour les articles.
- JSON-LD : mêmes nœuds que Rank Math (organisation, site, page, fil d'Ariane, BlogPosting pour les articles) plus la FAQ déjà présente sur l'accueil.
- Favicon et `apple-touch-icon` : ceux de WordPress. `<html lang>` en `fr-BE` / `en-US` / `nl-BE` comme WordPress.
- Robots meta : `noindex, nofollow` tant que le site n'est pas indexable ; ensuite `follow, index, max-snippet:-1, …` comme Rank Math. Les pages de remerciement et la 404 restent `noindex` même en production.

**Fichiers générés**
- `/sitemap.xml` : 254 URL, hreflang et `lastmod` des articles. Les anciens noms WordPress (`/sitemap_index.xml`, `/post-sitemap.xml`…) redirigent vers lui, pour que Search Console continue de fonctionner.
- `/robots.txt` : fermé (`Disallow: /`) en préversion ; à la mise en ligne il autorise tout sauf `/keystatic/` et `/api/` et annonce le sitemap. Les `Disallow` de WordPress étaient des URL absolues, ignorées des robots, sur des pages indexées : non repris.
- `/feed.xml` et `/en/feed.xml` (20 derniers articles, résumé) ; `/feed/` et `/en/feed/` y redirigent.
- `/404.html` : gabarit `404.php` du thème, texte traduit (WordPress l'affichait en anglais).

**Redirections et en-têtes** (`vercel.json`)
- Slash final obligatoire (`trailingSlash`), comme WordPress.
- 33 URL de l'ancien site redirigées : `/home-page/`, `/en/home-page/`, `/home/`, `/business-cases/` (+ EN, NL) vers `/case-study/`, pages Newsletter, `/fr_be/…`, redirections que WordPress faisait déjà (`/odoo/`, `/solutions/`…), archives catégories / étiquettes / auteurs vers `/blog/`, flux, sitemaps, `www` vers l'apex (en plus du réglage de domaine Vercel).
- En-têtes : `nosniff`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN` ; `X-Robots-Tag: noindex` sur `/keystatic` et `/api` ; cache d'un an pour les polices, d'une semaine pour les images.
- `/locations.kml` n'est pas repris (décision 8).

**Mesure et formulaires**
- GTM : conteneur de WordPress (`GTM-P7LT3M5`) chargé seulement si `PUBLIC_GTM_ID` est défini. Le `gtag.js` de Site Kit n'est pas repris : le conteneur configure déjà GA4, WordPress comptait donc chaque visite deux fois.
- Le conteneur attend déjà `merci-formulaire`, `merci-rdv` et l'événement `calendly_scheduled` : les deux pages existent et l'événement est envoyé par `public/assets/tracking.js` (widget et popup).
- UTM / gclid / page d'arrivée : `tracking.js` les garde pour la visite (sessionStorage, aucun cookie) et les copie dans les formulaires, qui avaient déjà ces champs vides sur WordPress. L'e-mail reçu indique donc d'où vient le contact.
- Formulaires : champ piège `_gotcha` (Formspree rejette les envois qui le remplissent), redirection `_next` vers la page de remerciement dans la langue du formulaire (le formulaire de la page Contact renvoyait vers la page Formspree).
- Simulateur `/api/send-estimate` : refus des requêtes venant d'un autre site (403), taille limitée (413), 5 envois / 10 min / IP (429). Compteur en mémoire d'une instance : voir « À faire côté comptes ».
- `.env.example` : toutes les variables ; `PUBLIC_KEYSTATIC_STORAGE=github` permet de créer la GitHub App depuis un poste local.

## Vérifications

| Contrôle | Résultat |
|---|---|
| `check:build` (260 pages) | 0 problème : canonical = URL de la page, hreflang réciproques et vers des pages existantes, 254 URL du sitemap = toutes les pages indexables, JSON-LD valide, image OG présente, pages de remerciement et 404 en noindex, 15 749 liens et ressources internes sans lien cassé |
| `check:redirects` | 196 URL de WordPress : 33 redirigées (au plus 2 sauts), 163 servies telles quelles, 0 en erreur ; aucune des 261 pages du nouveau site n'est redirigée. Joué avec le compilateur de routes de Vercel lui-même |
| Deux builds | préversion (noindex, sans GTM) et `PUBLIC_INDEXABLE=true PUBLIC_GTM_ID=…` : comportements conformes, mêmes 0 problème |
| Comparaison visuelle | 53 pages hors articles, desktop et mobile : 99 mesures sur 104 identiques à la phase 3 ; les 5 autres sont le blog (amélioré par la phase 4), `/business-cases/` (page supprimée, désormais redirigée) et `landing-page-sea-pb` en mobile (7,7 % de pixels contre 8,2 %). En navigateur : champs cachés, UTM copiés, événement `calendly_scheduled` poussé, aucune erreur de page |

## Mise en ligne (checklist)

1. Vercel : importer le dépôt, renseigner les variables du `.env.example` par environnement. `PUBLIC_INDEXABLE` et `PUBLIC_GTM_ID` seulement sur **Production**.
2. Tester sur la préversion : redirections (`curl -I`), un envoi du simulateur (le slash final fait passer `/api/send-estimate` par une redirection 308, à confirmer), la connexion à `/keystatic`.
3. Domaine : pointer `agitech.io` (et `www`) vers Vercel.
4. Le jour J : `PUBLIC_INDEXABLE=true` + `PUBLIC_GTM_ID=GTM-P7LT3M5` sur Production, redéployer, soumettre `/sitemap.xml` dans Search Console.

## À faire côté comptes (je n'y ai pas accès)

- **GitHub App Keystatic** : en local, `PUBLIC_KEYSTATIC_STORAGE=github npm run dev`, ouvrir `/keystatic`, suivre « créer l'application GitHub » (organisation Diego-Agitech), puis recopier les quatre variables `KEYSTATIC_*` / `PUBLIC_KEYSTATIC_*` dans Vercel.
- **GTM** : les déclencheurs des conversions portent sur les chemins français. Pour compter aussi les formulaires et rendez-vous en EN/NL, ajouter `thank-you-form` et `thank-you-meeting` à ces déclencheurs.
- **Consentement** : WordPress n'a aucun bandeau cookies, GTM déclenche GA4 et Ads dès l'arrivée ; le nouveau site fait de même. Un bandeau avec Consent Mode est à décider avant la mise en ligne (obligation légale, hors périmètre de cette phase).
- **Anti-spam des formulaires** : activer reCAPTCHA dans le tableau de bord du formulaire Formspree (`xeajdqgr`), ou le remplacer par l'envoi vers Odoo (décision 5). Les destinataires se règlent aussi dans Formspree.
- **Limite de débit du simulateur** : ajouter une règle dans Vercel Firewall (5 requêtes / 10 min / IP sur `/api/send-estimate`) ; celle du code ne limite qu'une instance.

## Choix et limites

- La newsletter du pied de page n'a pas de page de remerciement propre (page Formspree par défaut) : `merci-formulaire` déclenche la conversion Ads, les inscriptions y seraient comptées comme des contacts.
- JSON-LD : les horaires « tous les jours 9 h-17 h » de Rank Math ne sont pas repris (valeur par défaut manifestement fausse) ; l'auteur n'a pas de lien (pas de pages auteur sur le nouveau site) ; pas de `dateModified` (le contenu n'a pas de date de mise à jour).
- Les redirections 301 de WordPress sont des 308 chez Vercel (équivalent pour le référencement).
- Flux RSS FR et EN seulement.
- 4 articles NL n'ont ni résumé ni description (balise vide).
- `/simulateur/` n'existe pas sur WordPress : il devient indexable à la mise en ligne.
- Un nouveau contenu traduit doit recevoir le même `translationKey` sur toutes ses versions ; la phase 6 rend ce champ plus simple à remplir.
