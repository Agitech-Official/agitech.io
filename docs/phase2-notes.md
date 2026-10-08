# Phase 2 — blocs alignés sur le thème WordPress

Objectif : chaque bloc rend le même markup que le gabarit du thème (`template-parts/block/*.php`), avec les mêmes données que le site WordPress en production (relevées le 7 octobre 2026).

## Ce qui a changé

- **Composants** : `FeaturedCases`, `TeamMembersScrollSlider`, `Feedback` (carrousels Owl), `TeamMembers` (onglets par 3), `TrustOnUs`, `WhyChooseUs`, `HelpBlock`, `OurServices`, `OpenPositions`, `Methodologies` (sous-titre), `KeyFeatures`, `ContactUsSection` (formulaire du thème), `InnerHero`, `HeroHome`, `LandingHero`, `CaseOverview`, `Cta` (lien Calendly en popup).
- **Contenu** : les blocs de 47 fichiers (35 pages, 12 business cases) ont été resynchronisés depuis le HTML WordPress (textes, listes, logos, CTA, images). Les images utilisées par les fiches business case (25 fichiers, tailles comprises) ont été copiées dans `public/wp-content/uploads/` ; celles des articles de blog sont traitées en phase 4.
- **Accueil** : même ordre de sections que WordPress ; les blocs propres à Astro sont rangés dans `deferred-additions.md`.
- **Schéma Keystatic** : champs ajoutés `calendly` (CTA), `caseTypes` (pastilles de cas), `subHeading` (méthodologie). Aucun champ supprimé.
- **Calendly** : les boutons « Discuter avec Sam », « Planifier une visio de 25 mn » ouvrent la popup Calendly (comme sur WordPress) et transmettent les UTM.

## Défauts WordPress volontairement non reproduits

- `/industries/` affiche une fiche business case (« Cro'vettes & POS ») : la page Astro « Une expertise Odoo par industrie » est conservée.
- Pages EN « solutions » : titre « X SMEs already trust us in this sector » et 8 emplacements de logos vides. Textes et espaces laissés tels quels (hauteur de page inférieure de 180 px), à renseigner par Sam.
- Fiches Cro'vettes et Lastlink : WordPress affiche une section « témoignage » vide (299 px de blanc). Non reproduite.
- Hero de `/en/solution-business-services/` : « the Business Services » (mot en trop). Texte Astro conservé.
- Coquilles : « viso call » (→ visio call), « plusieurs languages » (→ langages), « Termes et Conditionss », placeholder anglais et adresse en anglais dans le pied de page FR.

## Écarts connus qui restent

- **reCAPTCHA** du formulaire de contact : non reproduit (94 px de moins sur la section). L'anti-spam est traité avec les formulaires (phase 5).
- **Gabarits propres** : blog (liste et article), liste des réalisations, page `/business-cases/` : phase 3.
- **Pages NL** : elles n'existent pas sur WordPress ; elles utilisent les nouveaux composants mais gardent leur ancien contenu (accueil NL non restructuré).
- Bloc **« talk-section »** absent des 50 articles : phase 3 (gabarit d'article).

## Textes remplacés par la version WordPress

Décision 3 du plan : le texte de WordPress fait foi pour la bascule. La liste ci-dessous montre, champ par champ, ce que la synchronisation a remplacé (hors apostrophes typographiques, espaces et entités HTML). À relire par Sam : pour garder une formulation d'Astro, il suffit de la remettre dans le contenu.

### business-cases/breaktheice-erp-en.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `talkToUs.value.title` | Talk about your project with Sam | Share your project with Sam |
| `talkToUs.value.subTitle` | No sales rep at Agitech, we talk directly, business owner to business owner. | At Agitech, there are no sales representatives, discussions are directly from one SME owner to another. |
| `talkToUs.value.contentDetails` | Need a straight answer, a quick budget estimate? You can book a video call with me directly via the link below. If your request is urgent, you can email me d… | Looking for an honest opinion or a quick budget estimate? Simply book a video call with me using the link below. If it's urgent, feel free to email me at: Sa… |
| `talkToUs.value.cta.label` | Talk to Sam | Talk with Sam |
| `featuredCases.value.cta.label` | *(vide)* | business cases |

### business-cases/breaktheice-erp.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `caseIntro.value.solution` | La base de données Odoo de BreakTheIce a été personnalisée pour s'adapter parfaitement à leurs flux métier. Elle intègre une gestion des événements , un CRM … | La base de données Odoo de BreakTheIce a été personnalisée pour s'adapter parfaitement à leurs flux métier. Elle intègre une gestion des événements , un CRM … |
| `talkToUs.value.subTitle` | Pas de commercial chez Agitech, on se parle directement entre patron d'entreprise. | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |
| `talkToUs.value.contentDetails` | Besoin d'un avis franc, d'une estimation budgétaire à la volée ? Vous pouvez directement réserver un visio call avec moi via le lien ci-dessous. Si votre dem… | Besoin d'un avis franc, d'une estimation budgétaire à la volée ? Vous pouvez directement réserver un visio call avec moi via le lien ci-dessous. Si votre dem… |
| `featuredCases.value.cta.label` | *(vide)* | business cases |

### business-cases/crovettes-en.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `talkToUs.value.title` | Talk about your project with Sam | Share your project with Sam |
| `talkToUs.value.subTitle` | No sales rep at Agitech, we talk directly, business owner to business owner. | At Agitech, there are no sales representatives, discussions are directly from one SME owner to another. |
| `talkToUs.value.contentDetails` | Need a straight answer, a quick budget estimate? You can book a video call with me directly via the link below. If your request is urgent, you can email me d… | Looking for an honest opinion or a quick budget estimate? Simply book a video call with me using the link below. If it's urgent, feel free to email me at: Sa… |
| `talkToUs.value.cta.label` | Talk to Sam | Talk with Sam |
| `featuredCases.value.cta.label` | *(vide)* | business cases |

### business-cases/crovettes.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `talkToUs.value.subTitle` | Pas de commercial chez Agitech, on se parle directement entre patron d'entreprise. | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |
| `talkToUs.value.contentDetails` | Besoin d'un avis franc, d'une estimation budgétaire à la volée ? Vous pouvez directement réserver un visio call avec moi via le lien ci-dessous. Si votre dem… | Besoin d'un avis franc, d'une estimation budgétaire à la volée ? Vous pouvez directement réserver un visio call avec moi via le lien ci-dessous. Si votre dem… |
| `featuredCases.value.cta.label` | *(vide)* | business cases |

### business-cases/fernatech-erp-en.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `caseIntro.value.solution` | Full Odoo implementation: Agitech deployed a centralized ERP solution covering sales, invoicing, subscriptions, field service operations, and customer manage… | Full Odoo implementation: Agitech deployed a centralized ERP solution covering sales, invoicing, subscriptions, field service operations, and customer manage… |
| `talkToUs.value.title` | Talk about your project with Sam | Share your project with Sam |
| `talkToUs.value.subTitle` | No sales rep at Agitech, we talk directly, business owner to business owner. | At Agitech, there are no sales representatives, discussions are directly from one SME owner to another. |
| `talkToUs.value.contentDetails` | Need a straight answer, a quick budget estimate? You can book a video call with me directly via the link below. If your request is urgent, you can email me d… | Looking for an honest opinion or a quick budget estimate? Simply book a video call with me using the link below. If it's urgent, feel free to email me at: Sa… |
| `talkToUs.value.cta.label` | Talk to Sam | Talk with Sam |
| `featuredCases.value.cta.label` | *(vide)* | business cases |

### business-cases/fernatech-erp.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `caseIntro.value.solution` | Implémentation complète d'Odoo : Agitech a déployé une solution ERP centralisée couvrant les ventes, la facturation, les abonnements, les services sur site e… | Implémentation complète d'Odoo : Agitech a déployé une solution ERP centralisée couvrant les ventes, la facturation, les abonnements, les services sur site e… |
| `talkToUs.value.subTitle` | Pas de commercial chez Agitech, on se parle directement entre patron d'entreprise. | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |
| `talkToUs.value.contentDetails` | Besoin d'un avis franc, d'une estimation budgétaire à la volée ? Vous pouvez directement réserver un visio call avec moi via le lien ci-dessous. Si votre dem… | Besoin d'un avis franc, d'une estimation budgétaire à la volée ? Vous pouvez directement réserver un visio call avec moi via le lien ci-dessous. Si votre dem… |
| `featuredCases.value.cta.label` | *(vide)* | business cases |

### business-cases/freemoov-erp-ecommerce-personnalise-en.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `caseIntro.value.solution` | For Freemoov, we implemented a complete and customized ERP solution, including an integrated eCommerce website, as well as task , inventory , purchasing , sa… | For Freemoov, we implemented a complete and customized ERP solution, including an integrated eCommerce website, as well as task , inventory , purchasing , sa… |
| `talkToUs.value.title` | Talk about your project with Sam | Share your project with Sam |
| `talkToUs.value.subTitle` | No sales rep at Agitech, we talk directly, business owner to business owner. | At Agitech, there are no sales representatives, discussions are directly from one SME owner to another. |
| `talkToUs.value.contentDetails` | Need a straight answer, a quick budget estimate? You can book a video call with me directly via the link below. If your request is urgent, you can email me d… | Looking for an honest opinion or a quick budget estimate? Simply book a video call with me using the link below. If it's urgent, feel free to email me at: Sa… |
| `talkToUs.value.cta.label` | Talk to Sam | Talk with Sam |
| `featuredCases.value.cta.label` | *(vide)* | business cases |

### business-cases/freemoov-erp-ecommerce-personnalise.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `caseIntro.value.solution` | Pour Freemoov, nous avons mis en place une solution ERP complète et personnalisée, comprenant un site eCommerce intégré, la gestion des tâches , du stock , d… | Pour Freemoov, nous avons mis en place une solution ERP complète et personnalisée, comprenant un site eCommerce intégré, la gestion des tâches , du stock , d… |
| `talkToUs.value.subTitle` | Pas de commercial chez Agitech, on se parle directement entre patron d'entreprise. | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |
| `talkToUs.value.contentDetails` | Besoin d'un avis franc, d'une estimation budgétaire à la volée ? Vous pouvez directement réserver un visio call avec moi via le lien ci-dessous. Si votre dem… | Besoin d'un avis franc, d'une estimation budgétaire à la volée ? Vous pouvez directement réserver un visio call avec moi via le lien ci-dessous. Si votre dem… |
| `featuredCases.value.cta.label` | *(vide)* | business cases |

### business-cases/lastlink-erp-en.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `talkToUs.value.title` | Talk about your project with Sam | Share your project with Sam |
| `talkToUs.value.subTitle` | No sales rep at Agitech, we talk directly, business owner to business owner. | At Agitech, there are no sales representatives, discussions are directly from one SME owner to another. |
| `talkToUs.value.contentDetails` | Need a straight answer, a quick budget estimate? You can book a video call with me directly via the link below. If your request is urgent, you can email me d… | Looking for an honest opinion or a quick budget estimate? Simply book a video call with me using the link below. If it's urgent, feel free to email me at: Sa… |
| `talkToUs.value.cta.label` | Talk to Sam | Talk with Sam |
| `featuredCases.value.cta.label` | *(vide)* | business cases |

### business-cases/lastlink-erp.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `talkToUs.value.subTitle` | Pas de commercial chez Agitech, on se parle directement entre patron d'entreprise. | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |
| `talkToUs.value.contentDetails` | Besoin d'un avis franc, d'une estimation budgétaire à la volée ? Vous pouvez directement réserver un visio call avec moi via le lien ci-dessous. Si votre dem… | Besoin d'un avis franc, d'une estimation budgétaire à la volée ? Vous pouvez directement réserver un visio call avec moi via le lien ci-dessous. Si votre dem… |
| `featuredCases.value.cta.label` | *(vide)* | business cases |

### business-cases/romaforeurope-erp-en.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `caseIntro.value.solution` | A centralized Odoo database with: A centralized Odoo database with: Accounting and analytical accounts to accurately track expenses Financial management with… | A centralized Odoo database with: Accounting and analytical accounts to accurately track expenses Financial management with budgeting and financial reporting… |
| `talkToUs.value.title` | Talk about your project with Sam | Share your project with Sam |
| `talkToUs.value.subTitle` | No sales rep at Agitech, we talk directly, business owner to business owner. | At Agitech, there are no sales representatives, discussions are directly from one SME owner to another. |
| `talkToUs.value.contentDetails` | Need a straight answer, a quick budget estimate? You can book a video call with me directly via the link below. If your request is urgent, you can email me d… | Looking for an honest opinion or a quick budget estimate? Simply book a video call with me using the link below. If it's urgent, feel free to email me at: Sa… |
| `talkToUs.value.cta.label` | Talk to Sam | Talk with Sam |
| `featuredCases.value.cta.label` | *(vide)* | business cases |

### business-cases/romaforeurope-erp.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `caseIntro.value.solution` | Une base de données Odoo centralisée avec : Une base de données Odoo centralisée avec : Comptabilité et comptes analytiques pour suivre précisément ses dépen… | Une base de données Odoo centralisée avec : Comptabilité et comptes analytiques pour suivre précisément ses dépenses Gestion financière avec budgétisation et… |
| `talkToUs.value.subTitle` | Pas de commercial chez Agitech, on se parle directement entre patron d'entreprise. | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |
| `talkToUs.value.contentDetails` | Besoin d'un avis franc, d'une estimation budgétaire à la volée ? Vous pouvez directement réserver un visio call avec moi via le lien ci-dessous. Si votre dem… | Besoin d'un avis franc, d'une estimation budgétaire à la volée ? Vous pouvez directement réserver un visio call avec moi via le lien ci-dessous. Si votre dem… |
| `featuredCases.value.cta.label` | *(vide)* | business cases |

### pages/accueil-en.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `teamMembersScrollSlider.value.cta.label` | Meet our team | *(vide)* |
| `ourServices.value.services[0].title` | Solutions | Odoo ERP Project |
| `ourServices.value.services[0].features[0].text` | E-Commerce | Odoo Ecommerce & PIM |
| `ourServices.value.services[0].features[1].text` | Wholesale & B2B Sales | Odoo CRM |
| `ourServices.value.services[0].features[2].text` | Business Services | Odoo ERP |
| `ourServices.value.services[0].features[3].text` | Transport & Logistics | Odoo MRP |
| `ourServices.value.services[0].features[4].text` | NGOs & International Associations | Odoo Accounting |
| `ourServices.value.services[0].features[5].text` | Property Management | Odoo Dashboard & Reporting |
| `ourServices.value.services[0].features[6].text` | Driving School | Payment: Stripe & Ingenico |
| `ourServices.value.services[1].title` | Services | Custom Solution |
| `ourServices.value.services[1].features[0].text` | Accounting (AgiFid) | PHP |
| `ourServices.value.services[1].features[1].text` | Odoo Implementation | Python |
| `ourServices.value.services[1].features[2].text` | Training | Java |
| `ourServices.value.services[1].features[3].text` | Support | WordPress |
| `ourServices.value.services[1].features[4].text` | Data Migration | Magento |
| `ourServices.value.services[1].features[5].text` | Version Upgrade | *(vide)* |
| `ourServices.value.services[1].features[6].text` | Network & IoT | *(vide)* |
| `ourServices.value.services[1].features[7].text` | Development | *(vide)* |
| `ourServices.value.services[2].title` | *(vide)* | IT Infrastructure |
| `ourServices.value.services[2].features[0].text` | *(vide)* | Azure Cloud Server |
| `ourServices.value.services[2].features[1].text` | *(vide)* | AWS Cloud Server |
| `ourServices.value.services[2].features[2].text` | *(vide)* | Maintenance |
| `ourServices.value.services[2].features[3].text` | *(vide)* | Security |
| `ourServices.value.services[2].features[4].text` | *(vide)* | IT Network |
| `trustOnUs.value.cta.label` | *(vide)* | Book an appointment |
| `featuredCases.value.cta.label` | *(vide)* | business cases |
| `talkToUs.value.title` | *(vide)* | Share your project with Sam |
| `talkToUs.value.subTitle` | *(vide)* | At Agitech, there are no sales representatives, discussions are directly from one owner to another. |
| `talkToUs.value.contentDetails` | *(vide)* | Looking for an honest opinion or a quick budget estimate? Simply book a video call with me using the link below. If it's urgent, feel free to email me at: Sa… |
| `talkToUs.value.cta.label` | *(vide)* | Talk with Sam |

### pages/accueil.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `heroHome.value.subTitle` | Odoo, adapté à votre entreprise. Pas l'inverse. | Odoo, adapté à votre PME. Pas l'inverse. |
| `teamMembersScrollSlider.value.cta.label` | Découvrir notre équipe | *(vide)* |
| `whyChooseUs.value.items[0].title` | Patrons d'entreprise & Expert | Patrons de PME & Expert |
| `whyChooseUs.value.items[0].content` | Vous parlez à quelqu'un qui comprend la technique software & Odoo. Et les réalités d'un dirigeant d'entreprise. | Vous parlez à quelqu'un qui comprend la technique software & Odoo. Et les réalités d'un dirigeant de PME. |
| `ourServices.value.services[0].title` | Solutions | Projet ERP Odoo |
| `ourServices.value.services[0].features[0].text` | E-Commerce | Odoo Ecommerce & PIM |
| `ourServices.value.services[0].features[1].text` | Grossiste & Vente B2B | Odoo CRM |
| `ourServices.value.services[0].features[2].text` | Construction & Bâtiment | Odoo ERP |
| `ourServices.value.services[0].features[3].text` | Services aux Entreprises | Odoo MRP |
| `ourServices.value.services[0].features[4].text` | Transport & Logistique | Odoo Comptabilité |
| `ourServices.value.services[0].features[5].text` | Associations Internationales | Odoo Dashboard & Reporting |
| `ourServices.value.services[0].features[6].text` | Gestion Immobilière | Paiement: Stripe & Ingenico |
| `ourServices.value.services[0].features[7].text` | Auto-École | *(vide)* |
| `ourServices.value.services[1].title` | Services | Solution sur mesure |
| `ourServices.value.services[1].features[0].text` | Comptabilité (AgiFid) | PHP |
| `ourServices.value.services[1].features[1].text` | Implémentation Odoo | Python |
| `ourServices.value.services[1].features[2].text` | Formation | Java Script |
| `ourServices.value.services[1].features[3].text` | Support | WordPress |
| `ourServices.value.services[1].features[4].text` | Migration de données | HubSpot |
| `ourServices.value.services[1].features[5].text` | Mise à niveau de version | *(vide)* |
| `ourServices.value.services[1].features[6].text` | Réseau et IoT | *(vide)* |
| `ourServices.value.services[1].features[7].text` | Développement | *(vide)* |
| `trustOnUs.value.title` | 92 entreprises nous font déjà confiance | 92 PME nous font déjà confiance |
| `trustOnUs.value.subTitle` | Chef d'entreprise, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. | Patron de PME, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. |
| `teamMembersScrollSlider.value.teamMembers[8].name` | *(vide)* | Alexia |
| `teamMembersScrollSlider.value.teamMembers[8].role` | *(vide)* | Business Analyst |
| `teamMembersScrollSlider.value.teamMembers[9].name` | *(vide)* | Alexis |
| `teamMembersScrollSlider.value.teamMembers[9].role` | *(vide)* | Business Analyst |
| `ourServices.value.services[2].title` | *(vide)* | Infrastructure IT |
| `ourServices.value.services[2].features[0].text` | *(vide)* | Serveur Cloud Azure |
| `ourServices.value.services[2].features[1].text` | *(vide)* | Serveur Cloud AWS |
| `ourServices.value.services[2].features[2].text` | *(vide)* | Maintenance |
| `ourServices.value.services[2].features[3].text` | *(vide)* | Sécurité |
| `ourServices.value.services[2].features[4].text` | *(vide)* | Réseau |
| `trustOnUs.value.cta.label` | *(vide)* | prendre rendez-vous |
| `featuredCases.value.cta.label` | *(vide)* | business cases |
| `talkToUs.value.title` | *(vide)* | Parlez de votre projet avec Sam |
| `talkToUs.value.subTitle` | *(vide)* | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |
| `talkToUs.value.contentDetails` | *(vide)* | Besoin d'un avis franc, d'une estimation budgétaire à la volée ? Vous pouvez directement réserver un visio call avec moi via le lien ci-dessous. Si votre dem… |
| `talkToUs.value.cta.label` | *(vide)* | Discuter avec Sam |

### pages/contact-us-en.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `contactUsSection.value.mainHeading` | *(vide)* | Let's discuss your project together |
| `contactUsSection.value.highlights[0]` | *(vide)* | 92 SMEs already trust us |
| `contactUsSection.value.highlights[1]` | *(vide)* | 68 projects successfully completed |
| `contactUsSection.value.highlights[2]` | *(vide)* | Official Odoo Silver Partner |
| `contactUsSection.value.ctaHeading` | *(vide)* | Prefer to chat in person? |
| `contactUsSection.value.ctaSubHeading` | *(vide)* | No salespeople, we speak directly between SME bosses. |
| `contactUsSection.value.cta.label` | *(vide)* | Schedule a 25 min video call |

### pages/contact-us-nl.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `contactUsSection.value.mainHeading` | *(vide)* | Laten we praten over uw project |
| `contactUsSection.value.highlights[0]` | *(vide)* | 92 KMO's vertrouwen ons al |
| `contactUsSection.value.highlights[1]` | *(vide)* | 68 projecten succesvol gerealiseerd |
| `contactUsSection.value.highlights[2]` | *(vide)* | Officiële Odoo Silver Partner |
| `contactUsSection.value.ctaHeading` | *(vide)* | Liever meteen een moment boeken? |
| `contactUsSection.value.ctaSubHeading` | *(vide)* | Kies hieronder een moment voor een gesprek van 25 minuten met Sam, rechtstreeks zonder verkoper. |
| `contactUsSection.value.cta.label` | *(vide)* | Plan een videogesprek van 25 min |

### pages/contact-us.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `contactUsSection.value.mainHeading` | *(vide)* | Discutons de votre projet ensemble |
| `contactUsSection.value.highlights[0]` | *(vide)* | 92 PME nous font déjà confiance |
| `contactUsSection.value.highlights[1]` | *(vide)* | 68 projets réalisés avec succès |
| `contactUsSection.value.highlights[2]` | *(vide)* | Partenaire officiel Odoo Silver |
| `contactUsSection.value.ctaHeading` | *(vide)* | Vous préférez discuter en personne ? |
| `contactUsSection.value.ctaSubHeading` | *(vide)* | Pas de commercial, on se parle directement entre patron de PME. |
| `contactUsSection.value.cta.label` | *(vide)* | Planifier une visio de 25 mn |

### pages/development-en.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `talkToUs.value.title` | Talk about your project with Sam | Share your project with Sam |
| `talkToUs.value.subTitle` | No sales rep at Agitech, we talk directly, business owner to business owner. | At Agitech, there are no sales representatives, discussions are directly from one owner to another. |
| `talkToUs.value.contentDetails` | Need a straight answer, a quick budget estimate? You can book a video call with me directly via the link below. If your request is urgent, you can email me d… | Looking for an honest opinion or a quick budget estimate? Simply book a video call with me using the link below. If it's urgent, feel free to email me at: Sa… |
| `talkToUs.value.cta.label` | Talk to Sam | Talk with Sam |
| `expertise.value.description` | *(vide)* | Our developers are proficient in multiple programming languages, allowing us to address a wide range of needs. |

### pages/development.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `talkToUs.value.subTitle` | Pas de commercial chez Agitech, on se parle directement entre patron d'entreprise. | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |
| `expertise.value.description` | *(vide)* | Nos développeurs maîtrisent plusieurs langages pour répondre à tous types de besoins : |

### pages/erp-sea.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `landingHero.value.subTitle` | Un seul logiciel de gestion pour votre entreprise. Pas Six. | Un seul logiciel de gestion pour votre PME. Pas Six. |
| `caseOverview.value.metrics[0].value` | entreprises | PME |
| `contactUsSection.value.highlights[0]` | 92 entreprises nous font déjà confiance | 92 PME nous font déjà confiance |
| `contactUsSection.value.ctaSubHeading` | Pas de commercial, on se parle directement entre patron d'entreprise. | Pas de commercial, on se parle directement entre patron de PME. |
| `trustOnUs.value.title` | 92 entreprises nous font déjà confiance | 92 PME nous font déjà confiance |
| `trustOnUs.value.subTitle` | Patron d'entreprise, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. | Patron de PME, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. |
| `helpBlock.value.cta.label` | *(vide)* | prendre rendez-vous |
| `contactUsSection.value.cta.label` | *(vide)* | Planifier une visio de 25 mn |
| `trustOnUs.value.cta.label` | *(vide)* | prendre rendez-vous |

### pages/industries-associations-internationales.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `trustOnUs.value.subTitle` | Patron d'entreprise, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. | Patron de PME, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. |
| `talkToUs.value.subTitle` | Pas de commercial chez Agitech, on se parle directement entre patron d'entreprise. | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |
| `talkToUs.value.contentDetails` | Besoin d'un avis franc, d'une estimation budgétaire à la volée ? Vous pouvez directement réserver un visio call avec moi via le lien ci-dessous. Si votre dem… | Besoin d'un avis franc, d'une estimation budgétaire à la volée ? Vous pouvez directement réserver un visio call avec moi via le lien ci-dessous.rnrnSi votre … |
| `trustOnUs.value.cta.label` | *(vide)* | prendre rendez-vous |

### pages/industries-construction-batiment.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `odooExpertise.value.title` | Notre solution pour les entreprises de la construction | Notre solution pour les PME de la construction |
| `trustOnUs.value.title` | 16 entreprises de la construction nous font déjà confiance : | 16 PME de la construction nous font déjà confiance : |
| `trustOnUs.value.subTitle` | Patron d'entreprise, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. | Patron de PME, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. |
| `talkToUs.value.subTitle` | Pas de commercial chez Agitech, on se parle directement entre patron d'entreprise. | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |
| `trustOnUs.value.cta.label` | *(vide)* | prendre rendez-vous |

### pages/industries-e-commerce-en.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `talkToUs.value.subTitle` | No sales rep at Agitech, we talk directly, business owner to business owner. | No salespeople at Agitech, you speak directly with an SME owner. |
| `talkToUs.value.contentDetails` | Need a straight answer, a quick budget estimate? You can book a video call with me directly via the link below. If your request is urgent, you can email me d… | *]:pointer-events-auto R6Vx5W_threadScrollVars scroll-mb-[calc(var(--scroll-root-safe-area-inset-bottom,0px)+var(--thread-response-height))] scroll-mt-[calc(… |
| `talkToUs.value.cta.label` | Talk to Sam | Discuss with Sam |
| `trustOnUs.value.cta.label` | *(vide)* | Book an appointment |

### pages/industries-e-commerce.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `trustOnUs.value.title` | 14 entreprises du E-commerce nous font déjà confiance | 14 PME du E-commerce nous font déjà confiance |
| `trustOnUs.value.subTitle` | Patron d'entreprise, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. | Patron de PME, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. |
| `talkToUs.value.subTitle` | Pas de commercial chez Agitech, on se parle directement entre patron d'entreprise. | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |
| `trustOnUs.value.cta.label` | *(vide)* | prendre rendez-vous |

### pages/industries-grossiste-vente-b2b.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `trustOnUs.value.subTitle` | Patron d'entreprise, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. | Patron de PME, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. |
| `talkToUs.value.subTitle` | Pas de commercial chez Agitech, on se parle directement entre patron d'entreprise. | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |
| `trustOnUs.value.cta.label` | *(vide)* | prendre rendez-vous |

### pages/industries-international-associations.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `talkToUs.value.subTitle` | No sales rep at Agitech, we talk directly, business owner to business owner. | No salespeople at Agitech, you speak directly with an SME owner. |
| `talkToUs.value.contentDetails` | Need a straight answer, a quick budget estimate? You can book a video call with me directly via the link below. If your request is urgent, you can email me d… | *]:pointer-events-auto R6Vx5W_threadScrollVars scroll-mb-[calc(var(--scroll-root-safe-area-inset-bottom,0px)+var(--thread-response-height))] scroll-mt-[calc(… |
| `talkToUs.value.cta.label` | Talk to Sam | Discuss with Sam |
| `trustOnUs.value.cta.label` | *(vide)* | Book an appointment |

### pages/industries-ngos-international-associations.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `odooExpertise.value.items[4].descriptionPoints` | Turn your field data into compelling impact reports. Custom impact indicators by program Real-time dashboards for management and funders Report exports in th… | *]:pointer-events-auto R6Vx5W_threadScrollVars scroll-mb-[calc(var(--scroll-root-safe-area-inset-bottom,0px)+var(--thread-response-height))] scroll-mt-[calc(… |
| `talkToUs.value.subTitle` | No sales rep at Agitech, we talk directly, business owner to business owner. | No salespeople at Agitech, you speak directly with an SME owner. |
| `talkToUs.value.contentDetails` | Need a straight answer, a quick budget estimate? You can book a video call with me directly via the link below. If your request is urgent, you can email me d… | No salespeople at Agitech — you speak directly with an SME owner. Need an honest opinion or a quick budget estimate? You can book a video call with me direct… |
| `talkToUs.value.cta.label` | Talk to Sam | Discuss with Sam |
| `trustOnUs.value.cta.label` | *(vide)* | Book an appointment |

### pages/industries-services-aux-entreprises.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `trustOnUs.value.title` | 15 entreprises nous font déjà confiance dans ce secteur | 15 PME nous font déjà confiance dans ce secteur |
| `trustOnUs.value.subTitle` | Patron d'entreprise, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. | Patron de PME, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. |
| `talkToUs.value.subTitle` | Pas de commercial chez Agitech, on se parle directement entre patron d'entreprise. | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |
| `trustOnUs.value.cta.label` | *(vide)* | prendre rendez-vous |

### pages/industries-wholesale-b2b-sales.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `talkToUs.value.subTitle` | No sales rep at Agitech, we talk directly, business owner to business owner. | No salespeople at Agitech, you speak directly with an SME owner. |
| `talkToUs.value.contentDetails` | Need a straight answer, a quick budget estimate? You can book a video call with me directly via the link below. If your request is urgent, you can email me d… | No salespeople at Agitech — you speak directly with an SME owner. Need an honest opinion or a quick budget estimate? You can book a video call with me direct… |
| `talkToUs.value.cta.label` | Talk to Sam | Discuss with Sam |
| `trustOnUs.value.cta.label` | *(vide)* | Book an appointment |

### pages/infrastructure-it-en.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `expertise.value.expertise[3].heading` | Network & IoT | Network |
| `expertise.value.expertise[3].subHeading` | Connecting PoS terminals and IoT devices to your Odoo. | Configuration & optimisation of your network infrastructure. |
| `expertise.value.expertise[3].description` | Point of Sale terminals and IoT sensors integrated directly into Odoo Proactive detection of performance issues Remote management, access security and guaran… | Proactive detection of performance issues Remote management, access security and guaranteed quality of service |
| `methodologies.value.methodologies[0].description` | *(vide)* | Audit of your existing infrastructure Identification of business priorities |
| `methodologies.value.methodologies[1].description` | *(vide)* | Definition of a deployment plan understood by the client Selection of standard, robust and scalable solutions |
| `methodologies.value.methodologies[2].description` | *(vide)* | Implementation of the chosen solutions Documentation and knowledge transfer |
| `methodologies.value.methodologies[3].description` | *(vide)* | Ongoing support contract Quick response in case of issues |
| `talkToUs.value.title` | Talk about your project with Sam | Share your project with Sam |
| `talkToUs.value.subTitle` | No sales rep at Agitech, we talk directly, business owner to business owner. | At Agitech, there are no sales representatives, discussions are directly from one owner to another. |
| `talkToUs.value.contentDetails` | Need a straight answer, a quick budget estimate? You can book a video call with me directly via the link below. If your request is urgent, you can email me d… | Looking for an honest opinion or a quick budget estimate? Simply book a video call with me using the link below. If it's urgent, feel free to email me at: Sa… |
| `talkToUs.value.cta.label` | Talk to Sam | Talk with Sam |
| `expertise.value.description` | *(vide)* | Our teams handle your IT infrastructure with no fuss, just reassurance and results. |

### pages/infrastructure-it.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `expertise.value.expertise[3].heading` | Réseau & IoT | Réseau |
| `expertise.value.expertise[3].subHeading` | Connexion des terminaux PoS et objets IoT à votre Odoo. | Configuration & optimisation de votre infrastructure réseau. |
| `expertise.value.expertise[3].description` | Intégration de terminaux Point de Vente et capteurs IoT directement dans Odoo Détection proactive des problèmes de performance Gestion à distance, sécurisati… | Détection proactive des problèmes de performance Gestion à distance, sécurisation des accès et qualité de service garantie |
| `methodologies.value.methodologies[0].description` | *(vide)* | Audit de votre infrastructure existante Identification des priorités business |
| `methodologies.value.methodologies[1].description` | *(vide)* | Définition d'un plan de déploiement compris par le client Choix de solutions standard , robustes et évolutives |
| `methodologies.value.methodologies[2].description` | *(vide)* | Implémentation des solutions retenues Documentation et transfert de connaissance |
| `methodologies.value.methodologies[3].description` | *(vide)* | Contrat de support continu Intervention rapide en cas de souci |
| `talkToUs.value.subTitle` | Pas de commercial chez Agitech, on se parle directement entre patron d'entreprise. | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |
| `expertise.value.description` | *(vide)* | Nos solutions sont 100 % cloud, simples et fiables. Si votre informaticien vous facture chaque année des serveurs locaux, VPN, machines virtuelles et “data m… |

### pages/jobs-en.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `innerHero.value.cta.label` | See all our open positions | Recruitment |
| `innerHero.value.cta2.label` | Our hiring process | *(vide)* |
| `talkToUs.value.title` | Talk about your project with Sam | Share your project with Sam |
| `talkToUs.value.subTitle` | No sales rep at Agitech, we talk directly, business owner to business owner. | At Agitech, there are no sales representatives, discussions are directly from one owner to another. |
| `talkToUs.value.contentDetails` | Need a straight answer, a quick budget estimate? You can book a video call with me directly via the link below. If your request is urgent, you can email me d… | Looking for an honest opinion or a quick budget estimate? Simply book a video call with me using the link below. If it's urgent, feel free to email me at: Sa… |
| `talkToUs.value.cta.label` | Talk to Sam | Talk with Sam |

### pages/jobs.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `innerHero.value.cta.label` | Voir tous nos postes ouverts | Recrutement |
| `innerHero.value.cta2.label` | Notre processus de recrutement | *(vide)* |
| `whyChooseUs.value.items[0].title` | Patrons d'entreprise & Expert | Patrons de PME & Expert |
| `whyChooseUs.value.items[0].content` | Vous parlez à quelqu'un qui comprend la technique software & Odoo. Et les réalités d'un dirigeant d'entreprise. | Vous parlez à quelqu'un qui comprend la technique software & Odoo. Et les réalités d'un dirigeant de PME. |
| `recruitingCta.value.contentDetails` | Depuis nos bureaux a Auderghem, on aide chaque jour une quarantaine d'entreprises belges à améliorer leurs performances. On bosse dur, on rigole bien. | Depuis nos bureaux a Auderghem, on aide chaque jour une quarantaine de PME belges à améliorer leurs performances. On bosse dur, on rigole bien. |
| `talkToUs.value.subTitle` | Pas de commercial chez Agitech, on se parle directement entre patron d'entreprise. | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |

### pages/landing-page-sea-pb.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `landingHero.value.subTitle` | Un seul logiciel de gestion pour votre entreprise. Pas Six. | Odoo, adapté à votre PME. Pas l'inverse. |
| `caseOverview.value.metrics[0].value` | entreprises | PME |
| `odooExpertise.value.title` | Propulsé par Odoo, la plateforme de gestion n°1 en Europe | Un interlocuteur unique |
| `odooExpertise.value.items[0].heading` | Vendez, facturez, encaissez | Une relation d'égal à égal |
| `odooExpertise.value.items[0].descriptionPoints` | Du devis au paiement, tout s'enchaîne sans ressaisie. CRM relié à vos devis et factures Relances de paiement automatiques Trésorerie visible en temps réel | Votre premier appel avec Agitech ne se fait pas avec un vendeur, Parlez directement à un des fondateurs Un patron de PME, comme vous Pas à un commercial |
| `odooExpertise.value.items[1].heading` | Un stock enfin fiable | Un interlocuteur unique |
| `odooExpertise.value.items[1].descriptionPoints` | Achats, inventaire et livraisons synchronisés en permanence. Ruptures anticipées, pas subies Inventaires sans fichier Excel Valorisation du stock toujours à … | du début à la fin du projet, vous parlez à un expert qui connaît vos process sur le bout des doigts. 1 business analyst en charge de votre dossier Aidé d'un … |
| `odooExpertise.value.items[2].heading` | Pilotez avec de vrais chiffres | Pas de junior sur vos dossiers |
| `odooExpertise.value.items[2].descriptionPoints` | Comptabilité et tableaux de bord alimentés automatiquement. Marges par produit ou par projet Reporting sans retraitement manuel Conforme comptabilité BE & FR | Uniquement des experts certifiés dédiés à faire croître votre commerce Tous nos Business Analyst sont certifiés Odoo v17, v18 ou v19 Formations internes mens… |
| `helpBlock.value.cards[0].title` | Quitter Excel | Implémenter Odoo |
| `helpBlock.value.cards[0].subTitle` | Mon entreprise tourne sur Excel ou des outils qui ne se parlent pas. | Mon entreprise tourne sur excel ou un ERP duquel je ne suis pas satisfait |
| `helpBlock.value.cards[1].title` | Remplacer mon logiciel | Améliorer mon Odoo |
| `helpBlock.value.cards[1].subTitle` | Mon ERP ou logiciel de gestion actuel ne me satisfait plus. | Mon entreprise est déjà sur Odoo et je cherche un partenaire pour m'aider. |
| `helpBlock.value.cards[2].title` | Un besoin spécifique | Développer sur mesure |
| `helpBlock.value.cards[2].subTitle` | J'ai des processus métier particuliers à intégrer à mon logiciel. | Je recherche des experts PhP, Python, Magento, Hubspot ou WordPress |
| `helpBlock.value.cards[3].title` | Estimer coût et ROI | Réaliser une Analyse |
| `helpBlock.value.cards[3].subTitle` | Budget d'un logiciel de gestion. Roadmap et stratégie informatique. | Coût et ROI d'un nouvel ERP. Due Diligence pour M&A. Roadmap et Stratégie informatique. |
| `contactUsSection.value.highlights[0]` | 92 entreprises nous font déjà confiance | 92 PME nous font déjà confiance |
| `contactUsSection.value.ctaSubHeading` | Pas de commercial, on se parle directement entre patron d'entreprise. | Pas de commercial, on se parle directement entre patron de PME. |
| `trustOnUs.value.title` | 92 entreprises nous font déjà confiance | 92 PME nous font déjà confiance |
| `trustOnUs.value.subTitle` | Patron d'entreprise, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. | Patron de PME, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. |
| `helpBlock.value.cta.label` | *(vide)* | prendre rendez-vous |
| `contactUsSection.value.cta.label` | *(vide)* | Planifier une visio de 25 mn |
| `trustOnUs.value.cta.label` | *(vide)* | prendre rendez-vous |

### pages/odoo-erp-en.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `methodologies.value.methodologies[0].description` | We seek to understand your practices and your business. Review of your current processes Functional scoping | Review of your current processes Functional scoping |
| `methodologies.value.methodologies[1].description` | We move forward in short iterations. Configuration of standard modules and development if needed Client validations & testing at each stage | Configuration of standard modules and development if needed Client validations & testing at each stage |
| `methodologies.value.methodologies[2].description` | An ERP is live when it is actually used. User training Go-live | User training Go-live |
| `methodologies.value.methodologies[3].description` | Your ERP evolves with your business. Ongoing support contract New features, integrations, enhancements | Ongoing support contract New features, integrations, enhancements |
| `talkToUs.value.title` | Talk about your project with Sam | Share your project with Sam |
| `talkToUs.value.subTitle` | No sales rep at Agitech, we talk directly, business owner to business owner. | At Agitech, there are no sales representatives, discussions are directly from one owner to another. |
| `talkToUs.value.contentDetails` | Need a straight answer, a quick budget estimate? You can book a video call with me directly via the link below. If your request is urgent, you can email me d… | Looking for an honest opinion or a quick budget estimate? Simply book a video call with me using the link below. If it's urgent, feel free to email me at: Sa… |
| `talkToUs.value.cta.label` | Talk to Sam | Talk with Sam |
| `methodologies.value.methodologies[0].subHeading` | *(vide)* | We seek to understand your practices and your business. |
| `methodologies.value.methodologies[1].subHeading` | *(vide)* | We move forward in short iterations. |
| `methodologies.value.methodologies[2].subHeading` | *(vide)* | An ERP is live when it is actually used. |
| `methodologies.value.methodologies[3].subHeading` | *(vide)* | Your ERP evolves with your business. |

### pages/odoo-erp.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `methodologies.value.methodologies[0].description` | Nous cherchons à comprendre vos pratiques et votre entreprise. Revue de vos processus actuels Cadrage fonctionnel | Revue de vos processus actuels Cadrage fonctionnel |
| `methodologies.value.methodologies[1].description` | Nous avançons par itérations courtes. Paramétrage des modules standards et développement si nécessaire Validations & test client à chaque étape. | Paramétrage des modules standards et développement si nécessaire Validations & test client à chaque étape. |
| `methodologies.value.methodologies[2].description` | Un ERP est live quand il est réellement utilisé. Formation des utilisateurs Mise en production | Formation des utilisateurs Mise en production |
| `methodologies.value.methodologies[3].description` | Votre ERP évolue avec votre entreprise. Contrat de support continu Nouvelles fonctionnalités, intégrations, évolutions | Contrat de support continu Nouvelles fonctionnalités, intégrations, évolutions |
| `talkToUs.value.subTitle` | Pas de commercial chez Agitech, on se parle directement entre patron d'entreprise. | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |
| `methodologies.value.methodologies[0].subHeading` | *(vide)* | Nous cherchons à comprendre vos pratiques et votre entreprise. |
| `methodologies.value.methodologies[1].subHeading` | *(vide)* | Nous avançons par itérations courtes. |
| `methodologies.value.methodologies[2].subHeading` | *(vide)* | Un ERP est live quand il est réellement utilisé. |
| `methodologies.value.methodologies[3].subHeading` | *(vide)* | Votre ERP évolue avec votre entreprise. |

### pages/recruitment-en.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `selectionProcess.value.steps[2].heading` | Final interview with a founder | Final interview with a founder to discuss your offer |
| `selectionProcess.value.steps[2].description` | To discuss your offer and go deeper into your motivation, autonomy, and how you think and collaborate. | A deeper conversation about your motivation, autonomy, and how you think and collaborate. |
| `openPositions.value.jobs[0].jobTitle` | *(vide)* | Our open positions |

### pages/recruitment.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `whyJoin.value.content` | Depuis nos bureaux à Auderghem, on aide chaque jour une quarantaine d'entreprises belges à améliorer leurs performances. On bosse dur, on rigole bien. Et com… | Depuis nos bureaux à Auderghem, on aide chaque jour une quarantaine de PME belges à améliorer leurs performances. On bosse dur, on rigole bien. Et comme on v… |
| `whyJoin.value.perks[1].points` | Flexibilité Projets à impact réel Environnement simple et structuré Autonomie et de vraies responsabilités Feedback constant pour progresser | Flexibilité Projets à impact réel Environnement simple et structure Autonomie et de vraie responsabilités Feedback constant pour progresser |
| `selectionProcess.value.steps[2].heading` | Entretien final avec un fondateur | Dernier entretien avec un fondateur pour discuter de votre offre |
| `selectionProcess.value.steps[2].description` | Pour discuter de votre offre, creuser votre motivation, votre autonomie, votre manière de réfléchir et de collaborer. | Pour creuser votre motivation, votre autonomie, votre manière de réfléchir et de collaborer. |
| `openPositions.value.jobs[0].jobTitle` | *(vide)* | Rejoignez-nous |

### pages/solution-business-services.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `talkToUs.value.subTitle` | No sales rep at Agitech, we talk directly, business owner to business owner. | No salespeople at Agitech, you speak directly with an SME owner. |
| `talkToUs.value.contentDetails` | Need a straight answer, a quick budget estimate? You can book a video call with me directly via the link below. If your request is urgent, you can email me d… | No salespeople at Agitech — you speak directly with an SME owner. Need an honest opinion or a quick budget estimate? You can book a video call with me direct… |
| `talkToUs.value.cta.label` | Talk to Sam | Discuss with Sam |
| `trustOnUs.value.cta.label` | *(vide)* | Book an appointment |

### pages/solution-transport-logistics.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `odooExpertise.value.items[4].descriptionPoints` | Digitize your documents and secure your compliance. Automatic generation of CMRs and delivery notes Electronic signature upon delivery Centralized archiving … | *]:pointer-events-auto R6Vx5W_threadScrollVars scroll-mb-[calc(var(--scroll-root-safe-area-inset-bottom,0px)+var(--thread-response-height))] scroll-mt-[calc(… |
| `talkToUs.value.subTitle` | No sales rep at Agitech, we talk directly, business owner to business owner. | No salespeople at Agitech, you speak directly with an SME owner. |
| `talkToUs.value.contentDetails` | Need a straight answer, a quick budget estimate? You can book a video call with me directly via the link below. If your request is urgent, you can email me d… | No salespeople at Agitech — you speak directly with an SME owner. Need an honest opinion or a quick budget estimate? You can book a video call with me direct… |
| `talkToUs.value.cta.label` | Talk to Sam | Discuss with Sam |
| `trustOnUs.value.cta.label` | *(vide)* | Book an appointment |

### pages/solution-transport-logistique.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `trustOnUs.value.title` | 6 entreprises nous font déjà confiance dans ce secteur | 6 PME nous font déjà confiance dans ce secteur |
| `trustOnUs.value.subTitle` | Patron d'entreprise, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. | Patron de PME, nous savons que la qualité d'un ERP se mesure à son impact réel sur votre entreprise, pas au nombre de fonctionnalité. |
| `talkToUs.value.subTitle` | Pas de commercial chez Agitech, on se parle directement entre patron d'entreprise. | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |
| `trustOnUs.value.cta.label` | *(vide)* | prendre rendez-vous |

### pages/why-odoo-en.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `talkToUs.value.title` | Talk about your project with Sam | Share your project with Sam |
| `talkToUs.value.subTitle` | No sales rep at Agitech, we talk directly, business owner to business owner. | At Agitech, there are no sales representatives, discussions are directly from one SME owner to another. |
| `talkToUs.value.contentDetails` | Need a straight answer, a quick budget estimate? You can book a video call with me directly via the link below. If your request is urgent, you can email me d… | Looking for an honest opinion or a quick budget estimate? Simply book a video call with me using the link below. If it's urgent, feel free to email me at: Sa… |
| `talkToUs.value.cta.label` | Talk to Sam | Talk with Sam |

### pages/why-odoo.mdoc

| Champ | Avant (Astro) | Après (WordPress) |
|---|---|---|
| `keyFeatures.value.features[0].description` | Tous les outils dont votre entreprise a besoin réunis au même endroit : CRM, facturation, stock, comptabilité, RH, etc. | Tous les outils dont votre PME a besoin réunis au même endroit : CRM, facturation, stock, comptabilité, RH, etc. |
| `keyFeatures.value.features[1].description` | Odoo est un logiciel open source. En tant que partenaire officiel, Agitech dispose d'un accès complet au code pour adapter chaque module à vos besoins spécif… | Odoo est un logiciel open source. En tant que partenaire officiel, Agitech dispose du code source et le modifie pour répondre à vos besoins spécifiques. |
| `keyFeatures.value.features[2].title` | Abordable & pensé pour les entreprises | Abordable & pensé pour les PME |
| `keyFeatures.value.features[2].description` | Plus de 95 % du code est mutualisé entre les entreprises, ce qui permet des économies d'échelle importantes. Conçu pour les entreprises, Odoo va à l'essentie… | Plus de 95 % du code est mutualisé entre les entreprises, ce qui permet des économies d'échelle importantes. Conçu pour les PME, Odoo va à l'essentiel, sans … |
| `talkToUs.value.subTitle` | Pas de commercial chez Agitech, on se parle directement entre patron d'entreprise. | Pas de commercial chez Agitech, on se parle directement entre patron de PME. |
| `talkToUs.value.contentDetails` | Besoin d'un avis franc, d'une estimation budgétaire à la volée ? Vous pouvez directement réserver un visio call avec moi via le lien ci-dessous. Si votre dem… | Besoin d'un avis franc, d'une estimation budgétaire à la volée ? Vous pouvez directement réserver un visio call avec moi via le lien ci-dessous. Si votre dem… |
