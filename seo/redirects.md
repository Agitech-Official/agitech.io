# Redirections 301 : agitech.io

## À lire d'abord

Ces redirections ne règlent que les anciennes URLs WordPress qui doivent disparaître.

Les URLs suivantes ne doivent PAS être redirigées : elles doivent être servies par le nouveau site. Elles renvoyaient encore l'ancien HTML WordPress lors de mon audit : `/`, `/odoo-erp/`, `/blog/`, `/implementation-odoo-pme-bruxelles/`, `/en/blog/`. Pour celles-là, il faut corriger le routage, le CDN ou le cache, puis purger.

Test rapide après purge : `curl -s https://agitech.io/ | grep -c wp-content` doit renvoyer 0.

## Table

| Source | Cible | Code | Note |
|---|---|---|---|
| `/fr_be/home-page/` | `/` | 301 | Lien du logo de l'ancien site, renvoyait une erreur |
| `/fr_be/*` | `/:splat` | 301 | Liens internes des anciens articles (gouvernance, budget, etc.) |
| `/en/home-page/` | `/en/` | 301 | Ancienne home EN |
| `/case-study/` | `/business-cases/` | 301 | Encore présent dans le sitemap |
| `/en/case-study/` | `/en/business-cases/` | 301 | Idem |

À vérifier avant de rediriger : `/en/industries-international-associations/`. L'ancien menu EN l'utilisait pour « Construction ». Si la page existe avec du contenu construction, rediriger vers `/en/industries-construction-batiment/` ; si c'est la page ONG, vers `/en/industries-ngos-international-associations/`.

À faire en parallèle : retirer `/case-study/` et `/en/case-study/` du sitemap, et corriger les liens internes qui pointent vers `/fr_be/...`.

## Netlify / Cloudflare Pages (`_redirects`)

```
/fr_be/home-page/   /            301
/fr_be/*            /:splat      301
/en/home-page/      /en/         301
/case-study/        /business-cases/      301
/en/case-study/     /en/business-cases/   301
```

## nginx

```nginx
location = /fr_be/home-page/ { return 301 /; }
location ~ ^/fr_be/(.*)$     { return 301 /$1; }
location = /en/home-page/    { return 301 /en/; }
location = /case-study/      { return 301 /business-cases/; }
location = /en/case-study/   { return 301 /en/business-cases/; }
```

## Apache (`.htaccess`)

```apache
RedirectMatch 301 ^/fr_be/home-page/?$ /
RedirectMatch 301 ^/fr_be/(.*)$ /$1
Redirect 301 /en/home-page/ /en/
Redirect 301 /case-study/ /business-cases/
Redirect 301 /en/case-study/ /en/business-cases/
```

## Après mise en place

- Tester chaque source avec `curl -sI` (attendu : 301 puis 200 sur la cible, sans chaîne de redirections).
- Soumettre le sitemap nettoyé dans la Search Console et inspecter 3 ou 4 URLs.
- Garder `/wp-content/uploads/` accessible tant que des pages ou des og:image y font référence.
