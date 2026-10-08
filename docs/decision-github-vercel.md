# Décision : organisation GitHub, accès et Vercel

Recommandation, à valider avant la mise en ligne. Rien n'est modifié tant que vous n'avez pas répondu : aujourd'hui le dépôt est `Diego-Agitech/agitech.io` (public) et aucun projet Vercel n'existe.

## Ce que je recommande

| Sujet | Aujourd'hui | Recommandation | Pourquoi |
|---|---|---|---|
| Propriétaire du dépôt | Organisation `Diego-Agitech`, nom d'une personne | Transférer le dépôt vers l'organisation GitHub d'Agitech (à confirmer laquelle : celle qui héberge déjà vos autres dépôts) | Le site ne doit pas dépendre du compte d'une personne : départ, droits, facturation |
| Visibilité | Public | **Privé** | Les brouillons et les contenus non publiés sont des fichiers du dépôt : en public, tout le monde peut les lire |
| Branche de production | `main` | `main` protégée : modification par pull request uniquement, une relecture, et le contrôle « Vérifications du site » (`.github/workflows/checks.yml`) exigé | Un éditeur ne peut pas casser le site en direct ; la préversion Vercel sert de relecture et le contrôle bloque un lien cassé, un conflit d'adresse ou un SEO invalide |
| Accès des éditeurs | — | Une équipe GitHub `site-editeurs` avec le droit **Write** sur ce seul dépôt ; 2 personnes **Admin** | Keystatic demande un compte GitHub avec accès en écriture ; chaque modification est tracée à son auteur |
| Vercel | — | Une **équipe Vercel** au nom d'Agitech (plan Pro), projet relié au dépôt de l'organisation | Le plan Hobby est réservé à un usage personnel non commercial |
| Variables | — | Voir `.env.example` : `PUBLIC_INDEXABLE` et `PUBLIC_GTM_ID` sur **Production** uniquement | Les préversions ne doivent ni être indexées ni alimenter Google Analytics et Ads |
| Domaine | agitech.io sur WordPress | Ajouté à Vercel au moment de la bascule (phase 7), `www` redirigé vers l'apex | Les redirections de `vercel.json` sont prêtes |

## Ce que cela change dans le code

Rien à changer au transfert, deux variables suffisent :

- `PUBLIC_KEYSTATIC_REPO=organisation/agitech.io` (Production et Preview) : nom du dépôt utilisé par l'éditeur.
- La GitHub App de Keystatic se crée dans la **nouvelle** organisation (procédure dans `docs/phase5-notes.md`), après le transfert, pour que ses accès pointent au bon endroit.

## Étapes, dans l'ordre

1. Décider : organisation propriétaire, dépôt privé ou public, qui est Admin, qui est éditeur.
2. Transférer le dépôt (GitHub → Settings → Transfer) et le passer en privé. Les liens vers l'ancien nom redirigent.
3. Créer l'équipe `site-editeurs` et activer la protection de `main`.
4. Créer l'équipe Vercel, importer le dépôt (framework Astro détecté), renseigner les variables.
5. Créer la GitHub App Keystatic dans l'organisation, recopier ses 4 variables dans Vercel.
6. Tester avec un éditeur : connexion à `/keystatic`, création d'une branche, enregistrement, préversion, fusion.

## À vérifier de votre côté

- Le plan et le prix exacts de Vercel pour votre équipe (facturation par membre) : je n'ai pas accès à votre compte.
- Si un dépôt privé impose des limites sur votre formule GitHub actuelle.
- Qui, côté Agitech, doit recevoir les alertes d'échec de construction.
