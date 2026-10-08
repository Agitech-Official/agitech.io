# Phase 6 — CMS prêt pour la production

Les éditeurs peuvent modifier menus, pied de page, libellés, images, traductions et SEO dans Keystatic, sans toucher au code et sans casser le site. Le rendu reste celui de la phase 5 : le HTML des 261 pages est identique, aux chemins d'images et à quelques détails listés plus bas près.

Guide pour les éditeurs : `docs/guide-editeurs.md`. Organisation GitHub et accès : `docs/decision-github-vercel.md` (recommandation, à valider).

## Ce qui a été fait

**Réglages éditables** (menu « Réglages du site » de l'éditeur ; fichiers `src/content/settings/*.json`, lus par `src/lib/settings.ts`)
- **Réglages du site** : nom, société, image par défaut des partages, réseaux sociaux.
- **Navigation** : un menu par langue, trois niveaux (entrée, colonne, lien), bouton de contact. Le drapeau de langue reste automatique.
- **Pied de page** : textes, adresse, liens, mentions légales, par langue.
- **Libellés d'interface** : « En savoir plus », boutons du blog, formulaire de contact, onglets du blog (catégories) et des réalisations (types).
- Ces textes étaient codés en dur dans `Header`, `Footer`, `blog.ts` et `lang.ts`. Le seul codé en dur qui reste est le logo du partenaire dans le pied de page.

**Lien de traduction à la place des suffixes** : le champ `urlSlug` (101 entrées) donne l'adresse quand elle diffère du nom du fichier, et `translationKey` relie les versions. Les listes d'exceptions `-en` / `-nl` de `routes.mjs` et les six fichiers de route ont disparu : `src/lib/content.ts` produit les chemins pour toutes les langues. `npm run check:content`, lancé avant chaque build, bloque les conflits d'adresse, les clés de traduction utilisées deux fois dans une langue et les slugs invalides.

**SEO complet** sur pages, articles et réalisations : image de partage, URL canonique, noindex. Sitemap, flux RSS et hreflang suivent (une page noindex ou canonicalisée ailleurs sort du sitemap).

**Brouillon** : case à cocher sur les trois collections. Un brouillon n'est ni page, ni élément de liste, ni sitemap, ni flux, ni lien hreflang en production ; il est construit en local et dans les préversions Vercel (`PUBLIC_SHOW_DRAFTS=true`, voir `.env.example`). Un lien depuis une page publiée vers un brouillon est signalé comme lien cassé par `check:build`.

**Images** : une **Médiathèque** (186 images, une copie chacune, avec son texte alternatif). Les blocs choisissent une image par son nom. Les couvertures d'articles restent des images propres à chaque article. Textes alternatifs repris de WordPress quand ils décrivent vraiment l'image (39 ; les « logo », « banner-bg-1 »… ont été écartés). Images avec alt : 251 → 410 sur 921, contre 494 sur WordPress.

## Défauts trouvés en essayant l'éditeur pour de vrai (corrigés)

1. **L'éditeur ne s'ouvrait plus.** Mon interrupteur de la phase 5 lisait `process.env` dans le navigateur. Remplacé par `import.meta.env` ; les variables s'appellent maintenant `PUBLIC_KEYSTATIC_STORAGE` et `PUBLIC_KEYSTATIC_REPO`. Un build ne l'aurait pas montré.
2. **Enregistrer une entrée supprimait ses images** (couvertures, icônes, logos). Keystatic attend les images dans un dossier au nom de l'entrée et enregistre le chemin public complet ; nos contenus stockaient un nom de fichier dans un dossier partagé, que le site lisait mais pas l'éditeur. D'où la Médiathèque et les dossiers par article. Les copier par page aurait fait passer les images de 10 à 69 Mo.
3. **Dates.** Keystatic réécrit `2025-05-20T09:58` en `2025-05-20T09:58:00.000Z` (heure sans fuseau malgré le `Z`). Sans correction, la date des métadonnées et du flux RSS devenait invalide. `src/lib/dates.mjs` lit les deux formes.
4. **L'import WordPress écrasait les champs du CMS** (`translationKey`, `urlSlug`, brouillon…) avec `--update`. Ils sont conservés ; les couvertures sont écrites dans le nouveau format.

## Vérifications

| Contrôle | Résultat |
|---|---|
| HTML avant / après la migration de la Médiathèque | 261 pages identiques, aux chemins d'images près |
| HTML de la phase 6 / phase 5 | seuls changements : ordre des profils `sameAs`, drapeau de langue du pied de page vers la page jumelle, textes alternatifs ajoutés |
| Éditeur, six entrées enregistrées (accueil, page EN, contact, réalisation, 2 articles) | rendu identique ; seule différence : Keystatic renomme la couverture d'un article en `coverImage.<ext>` |
| Éditeur, autres actions | modification du pied de page (une seule ligne du fichier change), création d'une image avec texte alternatif, enregistrement des réglages du site : conformes |
| Brouillon, noindex, canonical, image de partage, slug | testés sur de vrais builds, en production et en préversion, puis fichiers restaurés |
| `check:content`, `check:build` (15 749 liens et ressources), `check:redirects` | 0 problème |
| Images chargées par un navigateur, 261 pages, 4 267 images | aucune cassée ; 4 hors périmètre (logo du simulateur absent avant, 3 images externes) |
| Comparaison visuelle d'un échantillon (22 mesures) | hauteurs identiques |

## Limites

- Enregistrer dans l'éditeur réécrit tout l'en-tête du fichier (guillemets, retours à la ligne) : la première modification d'un fichier produit un diff Git plus gros que le changement réel.
- Le champ « Image » d'un bloc liste les images de la Médiathèque par nom, sans vignette, et ne permet pas d'envoyer un fichier directement : il faut passer par la Médiathèque.
- Pas d'aperçu en direct dans l'éditeur : la préversion Vercel de la branche en tient lieu.
- Ne s'éditent toujours pas ici : pages de remerciement, 404, destinataires et anti-spam des formulaires, logos du pied de page, redirections.
- La page `/simulateur/` appelle `/agitech-Logo.png` à la racine : logo absent, défaut antérieur à la phase 6.
