# JSON-LD Schema.org : agitech.io

Chaque bloc va dans un `<script type="application/ld+json">` du `<head>`.
Valider chaque page avec le Rich Results Test et validator.schema.org après mise en ligne.

À compléter par vous (non trouvé sur le site, donc non inventé) : forme juridique et numéro de TVA, téléphone des bureaux, logo en version non blanche.

Dans Astro : `<script type="application/ld+json" set:html={JSON.stringify(schema)} />` dans le layout, avec `schema` construit par page.

## 1. Organisation et bureaux (accueil, ou toutes les pages)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://agitech.io/#organization",
      "name": "Agitech",
      "legalName": "Agile Technologies",
      "url": "https://agitech.io/",
      "logo": "https://agitech.io/assets/img/blocks/Agitech_LogoWhite_footer.svg",
      "description": "Partenaire officiel Odoo Silver en Belgique : implémentation, migration, support et développement Odoo pour PME.",
      "areaServed": ["BE", "FR"],
      "knowsAbout": ["Odoo", "ERP", "Implémentation Odoo", "Migration Odoo", "Développement Odoo", "Comptabilité Odoo"],
      "sameAs": [
        "https://www.linkedin.com/company/agitechbelgium/",
        "https://www.youtube.com/@Agitech-OdooPartner"
      ]
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://agitech.io/#office-bruxelles",
      "name": "Agitech Bruxelles",
      "url": "https://agitech.io/",
      "parentOrganization": { "@id": "https://agitech.io/#organization" },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Clos Lucien Outers 11",
        "postalCode": "1160",
        "addressLocality": "Auderghem",
        "addressRegion": "Bruxelles",
        "addressCountry": "BE"
      }
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://agitech.io/#office-bouillon",
      "name": "Agitech Bouillon",
      "url": "https://agitech.io/",
      "parentOrganization": { "@id": "https://agitech.io/#organization" },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Grand-Rue 17",
        "postalCode": "6830",
        "addressLocality": "Bouillon",
        "addressCountry": "BE"
      }
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://agitech.io/#office-anvers",
      "name": "Agitech Anvers",
      "url": "https://agitech.io/",
      "parentOrganization": { "@id": "https://agitech.io/#organization" },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Silversquare Antwerp Tower, Frankrijklei 5",
        "postalCode": "2000",
        "addressLocality": "Antwerpen",
        "addressCountry": "BE"
      }
    }
  ]
}
```

## 2. WebSite (accueil)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://agitech.io/#website",
  "url": "https://agitech.io/",
  "name": "Agitech",
  "publisher": { "@id": "https://agitech.io/#organization" },
  "inLanguage": ["fr-BE", "en", "nl-BE"]
}
```

## 3. Article, exemple rempli (`/implementation-odoo-pme-bruxelles/`)

Dates et auteur repris de l'ancienne version de la page. Pour chaque autre article, remplacer les champs entre crochets.

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Implémentation Odoo PME à Bruxelles",
  "description": "Réussir une implémentation Odoo PME à Bruxelles exige méthode, priorités claires et partenaire fiable pour éviter coûts cachés et retards.",
  "datePublished": "2026-06-23T09:01:30+00:00",
  "dateModified": "2026-06-23T09:19:50+00:00",
  "inLanguage": "fr-BE",
  "mainEntityOfPage": "https://agitech.io/implementation-odoo-pme-bruxelles/",
  "image": "https://agitech.io/wp-content/uploads/2026/06/implementation-odoo-pme-a-bruxelles-featured.webp",
  "author": { "@type": "Person", "name": "Sam Gutman", "jobTitle": "Directeur & Project Manager", "worksFor": { "@id": "https://agitech.io/#organization" } },
  "publisher": { "@id": "https://agitech.io/#organization" }
}
```

Modèle pour les autres articles :

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[H1 de l'article]",
  "description": "[meta description]",
  "datePublished": "[AAAA-MM-JJ]",
  "dateModified": "[AAAA-MM-JJ]",
  "inLanguage": "[fr-BE | en | nl-BE]",
  "mainEntityOfPage": "[URL canonique]",
  "image": "[URL image à la une, pas og-default.png]",
  "author": { "@type": "Person", "name": "[Sam Gutman | Diego ...]", "worksFor": { "@id": "https://agitech.io/#organization" } },
  "publisher": { "@id": "https://agitech.io/#organization" }
}
```

## 4. FAQPage (accueil EN, texte identique à celui affiché sur `/en/`)

Le texte du JSON-LD doit correspondre mot pour mot au texte visible. Refaire le même bloc pour `/` (FR) et `/nl/` à partir de la FAQ de chaque page.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "inLanguage": "en",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Odoo and why choose it for an SME?",
      "acceptedAnswer": { "@type": "Answer", "text": "Odoo is an open-source ERP that brings together CRM, invoicing, accounting, inventory and HR on a single platform. For an SME, the main benefit is no longer juggling disconnected tools: one license per user, one database, and a lower total cost than equivalent proprietary ERPs." }
    },
    {
      "@type": "Question",
      "name": "How much does an Odoo implementation with Agitech cost?",
      "acceptedAnswer": { "@type": "Answer", "text": "The cost depends on the number of modules, the level of customization and the complexity of your processes. An SME with standard needs (CRM, sales, accounting) usually starts a project within a few weeks. Get a ballpark figure in 2 minutes with our price simulator. We always provide a detailed quote after a first free call to scope your real needs." }
    },
    {
      "@type": "Question",
      "name": "How long does an Odoo implementation project take?",
      "acceptedAnswer": { "@type": "Answer", "text": "For an SME with standard modules, expect roughly 4 to 8 weeks between scoping and go-live. Projects with custom development or complex data migration can take several months. We always move in short iterations to deliver value quickly." }
    },
    {
      "@type": "Question",
      "name": "Is Agitech an official Odoo partner?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes, Agitech is an official Odoo Silver partner. This means direct access to Odoo's technical team, certified expertise on the latest versions, and full access to the code to customize your installation to your real needs." }
    },
    {
      "@type": "Question",
      "name": "Can Odoo replace my Excel spreadsheets and separate software?",
      "acceptedAnswer": { "@type": "Answer", "text": "In most cases, yes. Odoo natively covers sales management, accounting, inventory, HR and e-commerce. The goal isn't just to \"do the same as Excel\" but to connect that data together to eliminate re-entry and sync errors." }
    },
    {
      "@type": "Question",
      "name": "What support does Agitech offer after go-live?",
      "acceptedAnswer": { "@type": "Answer", "text": "We offer an ongoing support contract including application maintenance, fixes, and guidance on your ERP's future evolutions. An ERP that works today needs to keep evolving with your company — support doesn't stop at go-live." }
    }
  ]
}
```

## 5. BreadcrumbList (articles de blog, exemple FR)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://agitech.io/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://agitech.io/blog/" },
    { "@type": "ListItem", "position": 3, "name": "Implémentation Odoo PME à Bruxelles", "item": "https://agitech.io/implementation-odoo-pme-bruxelles/" }
  ]
}
```

## Ce qui n'est volontairement pas inclus

- `AggregateRating` et `Review` : « 140 entreprises nous font confiance » n'est pas une note d'avis, Google peut sanctionner ce balisage.
- Téléphone, TVA, horaires : absents du site, à ajouter par vous.
