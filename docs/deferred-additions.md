# Ajouts propres à Astro retirés pour la bascule 1:1

Ces blocs n'existent pas sur le site WordPress. Ils ont été retirés des pages pour que le rendu soit identique à WordPress (décision 2 du plan). Le composant et le schéma Keystatic existent toujours : pour remettre un bloc, recopier son YAML dans le `blocks:` de la page.

## accueil.mdoc — blocs retirés de l'accueil (propres à Astro, absents de WordPress)

Ordre d'origine : forfaitHome, officesSection, faq, contactHero

```yaml
- discriminant: forfaitHome
  value:
    title: Ce qu'on développe, et comment on le facture
    intro: Ce qui était trop cher à développer sur mesure ne l'est plus.
    cards:
    - title: Développement au forfait
      text: Un prix, une date, un périmètre écrit. Si l'estimation était mauvaise, c'est notre problème.
      featured: false
    - title: Interfaces sur mesure
      text: Portails clients, applications mobiles, écrans métier — dans Odoo ou à côté.
      featured: true
    - title: Compatible aux migrations
      text: Ce que nous développons reste maintenu à chaque nouvelle version d'Odoo.
      featured: false
    tagsTitle: Notre combo technique
    tags:
    - Portail client
    - Application mobile terrain
    - Écran de saisie métier
    - Tableau de bord direction
    - Configurateur produit
    explainerText: Nous utilisons l'IA à fond sur notre production — le sur-mesure qui demandait quinze jours en demande cinq, et le temps gagné repart dans l'ergonomie plutôt que dans la facture.
    ctaPrimary:
      label: Décrivez votre besoin
      url: /contact-us/
    ctaSecondary:
      label: Voir comment ça se passe
      url: /developpement-odoo-forfait/
    diyTitle: Vous développez vous-même avec l'IA dans Odoo ?
    diyText: Nous avons une offre pour vous.
    diyCta:
      label: Découvrir l'offre
      url: /contact-us/
- discriminant: officesSection
  value:
    title: Nos bureaux
    subTitle: Trois bureaux en Belgique, pour être proches de vous où que vous soyez.
    mapLabel: Voir sur la carte
    showMap: true
    offices:
    - city: Bruxelles
      address: Clos Lucien Outers 11, 1160 Auderghem
    - city: Bouillon
      address: Grand-Rue 17, 6830 Bouillon
    - city: Anvers
      address: Silversquare Antwerp Tower, Frankrijklei 5, 2000 Antwerpen
- discriminant: faq
  value:
    title: Questions fréquentes sur Odoo & l'ERP
    subtitle: Ce que les dirigeants d'entreprise nous demandent le plus souvent.
    items:
    - question: Qu'est-ce qu'Odoo et pourquoi le choisir pour une entreprise ?
      answer: "Odoo est un ERP open source qui regroupe CRM, facturation, comptabilité, stock et RH sur une seule plateforme. Pour une entreprise, l'intérêt principal est d'arrêter de jongler entre plusieurs outils déconnectés : une seule licence par utilisateur, une seule base de données, et un coût total inférieur aux ERP propriétaires équivalents."
    - question: Combien coûte l'implémentation d'Odoo avec Agitech ?
      answer: Le coût dépend du nombre de modules, du niveau de personnalisation et de la complexité de vos processus. Une entreprise avec des besoins standards (CRM, ventes, comptabilité) démarre généralement un projet en quelques semaines. Nous fournissons toujours un devis détaillé après un premier échange gratuit pour cadrer vos besoins réels.
    - question: Combien de temps dure un projet d'implémentation Odoo ?
      answer: Pour une entreprise avec des modules standards, comptez généralement 4 à 8 semaines entre le cadrage et la mise en production. Les projets avec développements sur mesure ou migration de données complexe peuvent prendre plusieurs mois. Nous avançons toujours par itérations courtes pour livrer de la valeur rapidement.
    - question: Agitech est-il partenaire officiel Odoo ?
      answer: Oui, Agitech est partenaire officiel Odoo Silver. Cela signifie un accès direct à l'équipe technique d'Odoo, une expertise certifiée sur les dernières versions, et un accès complet au code pour personnaliser votre installation selon vos besoins réels.
    - question: Odoo peut-il remplacer mes outils Excel et mes logiciels séparés ?
      answer: Dans la grande majorité des cas, oui. Odoo couvre nativement la gestion commerciale, la comptabilité, le stock, les RH et le e-commerce. L'objectif n'est pas juste de "faire pareil qu'Excel" mais de connecter ces données entre elles pour éliminer les ressaisies et les erreurs de synchronisation.
    - question: Quel support propose Agitech après la mise en production ?
      answer: Nous proposons un contrat de support continu incluant maintenance applicative, correctifs, et accompagnement sur les évolutions futures de votre ERP. Un ERP qui fonctionne aujourd'hui doit continuer à évoluer avec votre entreprise — le support ne s'arrête pas au go-live.
    - question: Odoo est-il adapté à une petite entreprise, ou seulement aux grands groupes ?
      answer: Odoo est modulaire, ce qui le rend accessible dès quelques utilisateurs. Vous démarrez avec les modules dont vous avez besoin aujourd'hui (CRM, ventes, comptabilité) et vous en activez d'autres au fur et à mesure de votre croissance, sans changer de logiciel ni migrer vos données à chaque étape.
    - question: Quelle est la différence entre Odoo et un ERP comme SAP ou Microsoft Dynamics ?
      answer: Odoo se distingue par son coût total nettement inférieur (licence par utilisateur, pas de modules imposés), sa rapidité de mise en œuvre et son code source accessible pour un paramétrage sur mesure. SAP et Dynamics restent pertinents pour de très grands groupes aux processus figés, mais imposent des coûts et des délais d'implémentation bien plus lourds.
    - question: Faut-il un partenaire pour implémenter Odoo, ou peut-on le faire soi-même ?
      answer: Odoo est open source et peut techniquement être installé seul, mais la configuration métier, la migration des données existantes et la formation des équipes sont les étapes où la plupart des projets internes échouent. Un partenaire certifié comme Agitech sécurise ces étapes et réduit le temps entre le lancement et la première valeur réelle pour l'entreprise.
- discriminant: contactHero
  value:
    titleBefore: Discutons de votre
    titleHighlight: projet
    trustList:
    - 92 entreprises nous font déjà confiance
    - 68 projets réalisés avec succès
    - Partenaire officiel Odoo Silver
    directTitle: Vous préférez réserver directement ?
    directText: Choisissez un créneau ci-dessous pour un appel de 25 minutes avec Sam, sans détour par un commercial.
    calendlyUrl: https://calendly.com/sam-agitech/25-min-intro
    formAction: https://formspree.io/f/xeajdqgr
    formSubject: Nouvelle demande de contact - Agitech
    thankYouPath: /merci-formulaire/
```

## accueil-en.mdoc — blocs retirés de l'accueil (propres à Astro, absents de WordPress)

Ordre d'origine : forfaitHome, officesSection, faq, contactHero

```yaml
- discriminant: forfaitHome
  value:
    title: What we build, and how we price it
    intro: What used to be too expensive to build custom no longer is.
    cards:
    - title: Fixed-price development
      text: A price, a date, a written scope. If the estimate was wrong, that's our problem.
      featured: false
    - title: Custom interfaces
      text: Customer portals, mobile apps, business screens — inside Odoo or alongside it.
      featured: true
    - title: Migration-compatible
      text: What we build stays maintained across every new Odoo version.
      featured: false
    tagsTitle: Our tech combo
    tags:
    - Customer portal
    - Field mobile app
    - Business data-entry screen
    - Executive dashboard
    - Product configurator
    explainerText: We use AI extensively across our production work — custom development that used to take fifteen days now takes five, and the time saved goes into usability instead of the invoice.
    ctaPrimary:
      label: Describe your need
      url: /en/contact-us/
    ctaSecondary:
      label: See how it works
      url: /en/developpement-odoo-forfait/
    diyTitle: Building on Odoo yourself with AI?
    diyText: We have an offer for you.
    diyCta:
      label: See the offer
      url: /en/contact-us/
- discriminant: officesSection
  value:
    title: Our offices
    subTitle: Three offices in Belgium, to stay close to you wherever you are.
    mapLabel: View on map
    showMap: true
    offices:
    - city: Brussels
      address: Clos Lucien Outers 11, 1160 Auderghem
    - city: Bouillon
      address: Grand-Rue 17, 6830 Bouillon
    - city: Antwerp
      address: Silversquare Antwerp Tower, Frankrijklei 5, 2000 Antwerpen
- discriminant: faq
  value:
    title: Frequently Asked Questions about Odoo & ERP
    subtitle: What SME owners ask us most often.
    items:
    - question: What is Odoo and why choose it for an SME?
      answer: "Odoo is an open-source ERP that brings together CRM, invoicing, accounting, inventory and HR on a single platform. For an SME, the main benefit is no longer juggling disconnected tools: one license per user, one database, and a lower total cost than equivalent proprietary ERPs."
    - question: How much does an Odoo implementation with Agitech cost?
      answer: The cost depends on the number of modules, the level of customization and the complexity of your processes. An SME with standard needs (CRM, sales, accounting) usually starts a project within a few weeks. We always provide a detailed quote after a first free call to scope your real needs.
    - question: How long does an Odoo implementation project take?
      answer: For an SME with standard modules, expect roughly 4 to 8 weeks between scoping and go-live. Projects with custom development or complex data migration can take several months. We always move in short iterations to deliver value quickly.
    - question: Is Agitech an official Odoo partner?
      answer: Yes, Agitech is an official Odoo Silver partner. This means direct access to Odoo's technical team, certified expertise on the latest versions, and full access to the code to customize your installation to your real needs.
    - question: Can Odoo replace my Excel spreadsheets and separate software?
      answer: In most cases, yes. Odoo natively covers sales management, accounting, inventory, HR and e-commerce. The goal isn't just to "do the same as Excel" but to connect that data together to eliminate re-entry and sync errors.
    - question: What support does Agitech offer after go-live?
      answer: We offer an ongoing support contract including application maintenance, fixes, and guidance on your ERP's future evolutions. An ERP that works today needs to keep evolving with your company — support doesn't stop at go-live.
- discriminant: contactHero
  value:
    titleBefore: Let's discuss your
    titleHighlight: project
    trustList:
    - 92 SMEs already trust us
    - 68 projects successfully completed
    - Official Odoo Silver Partner
    directTitle: Prefer to book directly?
    directText: Pick a slot below for a 25-minute call with Sam, no sales rep in between.
    calendlyUrl: https://calendly.com/sam-agitech/25-min-intro
    formAction: https://formspree.io/f/xeajdqgr
    formSubject: New contact request - Agitech
    thankYouPath: /en/thank-you-form/
```

## Autres variantes Astro retirées (phase 2)

Ces variantes n'existent pas dans le bloc WordPress d'origine. Le détail des anciennes valeurs est dans le commit de base (`git show e36f992:<fichier>`).

| Où | Variante retirée | Fichier d'origine |
|---|---|---|
| Hero « Équipe » (`/jobs/`, FR/EN/NL) | Deuxième lien « Notre processus de recrutement » (`cta2`) et bouton « Voir tous nos postes ouverts » vers le portail de recrutement | `src/content/pages/jobs*.mdoc` |
| Bloc « Postes ouverts » (`/recruitment/`) | Bouton unique vers le portail Odoo (`portalUrl`) à la place de la liste des postes | `src/content/pages/recruitment*.mdoc`, `OpenPositions.astro` |
| Bloc « Nos services » (accueil) | Variante « tarifs » (prix, ✓/✗) et cartes Solutions / Services élargies | `OurServices.astro`, `accueil*.mdoc` |
| Slider d'équipe | Bouton « Découvrir notre équipe » sous le slider | `TeamMembersScrollSlider.astro` |
| Bloc « Besoins » (`helpBlock`) | Option `dark` (cartes sombres) | `HelpBlock.astro` |
| En-tête | Entrées « Services » et « Jobs », menu de langues FR / EN / NL en texte | `Header.astro` |
| Pied de page | Lien « Voir nos 3 bureaux » | `Footer.astro` |
| Page contact | Bloc « Contact + Calendly » avec choix du bureau, remplacé par le formulaire du thème | `ContactHero.astro`, `contact-us*.mdoc` |

## Retiré en phase 3 (gabarits blog et réalisations)

| Où | Variante retirée | Où la retrouver |
|---|---|---|
| Article de blog | Sommaire latéral généré à partir des titres (`toc-sidebar`), date au format ISO, titre en `h1` | `git show e36f992:src/pages/[...slug].astro`, `src/lib/toc.ts` (conservé) |
| `/blog/` | Cartes sans image avec extrait et date ISO, sans filtre | `git show e36f992:src/pages/blog/index.astro` |
| `/case-study/` | Cartes à motif décoratif, sans filtre ni besoins | `git show e36f992:src/pages/case-study.astro` |
| `/business-cases/` (FR, EN, NL) | Page de liste des business cases. WordPress sert une page vide à cette adresse : la page est supprimée (404) et devra être redirigée vers `/case-study/` (phase 5) | `git show e36f992:src/pages/business-cases/index.astro` |
