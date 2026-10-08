import { config, fields, collection, singleton } from '@keystatic/core';

// Shared sub-schemas ported from ACF field groups reused across blocks.
// Block images are not uploaded in place: they are entries of the "Médiathèque" collection (one copy per image, with its
// alt text) and blocks only pick one. Keystatic's own image field keeps files in a folder per entry, which would duplicate
// every shared icon and logo once per page.
const imageField = (label: string, _dir?: string) =>
  fields.relationship({ label, collection: 'media', validation: { isRequired: false } });

const ctaFields = {
  label: fields.text({ label: 'Texte du bouton' }),
  url: fields.text({ label: 'Lien' }),
  newTab: fields.checkbox({ label: 'Ouvrir dans un nouvel onglet', defaultValue: false }),
  calendly: fields.checkbox({ label: 'Popup Calendly (le lien est l\'URL Calendly)', defaultValue: false }),
};

const blocksField = fields.array(
  fields.conditional(
    fields.select({
      label: 'Type de bloc',
      options: [
        { label: 'Hero — Accueil', value: 'heroHome' },
        { label: 'Hero — Page intérieure', value: 'innerHero' },
        { label: 'Hero — Landing', value: 'landingHero' },
        { label: 'Talk to us', value: 'talkToUs' },
        { label: 'Trust on us (logos clients)', value: 'trustOnUs' },
        { label: 'Applications utilisées', value: 'applicationsUsed' },
        { label: 'Case intro (besoins/défi/solution)', value: 'caseIntro' },
        { label: 'Expertise Odoo', value: 'odooExpertise' },
        { label: 'Ideas into software', value: 'ideasIntoSoftware' },
        { label: 'Hero image below', value: 'heroImageBelow' },
        { label: 'Case overview (métriques)', value: 'caseOverview' },
        { label: 'Case insights', value: 'caseInsights' },
        { label: 'Feedback clients', value: 'feedback' },
        { label: 'Why choose us', value: 'whyChooseUs' },
        { label: 'Featured business cases', value: 'featuredCases' },
        { label: 'Credited assistance (RDV)', value: 'creditedAssistance' },
        { label: 'Help block (cartes services)', value: 'helpBlock' },
        { label: 'Équipe (slider)', value: 'teamMembersScrollSlider' },
        { label: 'Nos services', value: 'ourServices' },
        { label: 'Company intro', value: 'companyIntro' },
        { label: 'Méthodologie', value: 'methodologies' },
        { label: 'Key features (3 points numérotés)', value: 'keyFeatures' },
        { label: 'Section contact (formulaire)', value: 'contactUsSection' },
        { label: 'Nos bureaux', value: 'officesSection' },
        { label: 'Expertise (liste)', value: 'expertise' },
        { label: 'Pourquoi nous rejoindre', value: 'whyJoin' },
        { label: 'Postes ouverts', value: 'openPositions' },
        { label: 'Processus de sélection', value: 'selectionProcess' },
        { label: 'Page CMS (texte libre)', value: 'cmsPage' },
        { label: 'Équipe (grille)', value: 'teamMembers' },
        { label: 'Recrutement CTA', value: 'recruitingCta' },
        { label: 'Contact + Calendly (bas de page)', value: 'contactHero' },
        { label: 'FAQ', value: 'faq' },
        { label: 'Forfait — Section accueil', value: 'forfaitHome' },
        { label: 'Forfait — Section texte (H2 + contenu)', value: 'textSection' },
        { label: 'Forfait — Placeholder (cas chiffrés / galerie)', value: 'contentPlaceholder' },
        { label: 'Forfait — Bandeau CTA final', value: 'ctaBanner' },
        { label: 'Liste des articles du blog', value: 'blogPosts' },
        { label: 'Liste des business cases', value: 'businessCasesList' },
      ],
      defaultValue: 'heroHome',
    }),
    {
      heroHome: fields.object({
        title: fields.text({ label: 'Titre' }),
        subTitle: fields.text({ label: 'Sous-titre' }),
        cta: fields.object(ctaFields, { label: 'CTA' }),
        bottomLine: fields.checkbox({ label: 'Ligne décorative bas', defaultValue: false }),
        image: imageField('Image droite', 'blocks'),
      }, { label: 'Hero — Accueil' }),
      innerHero: fields.object({
        logo: imageField('Logo', 'blocks'),
        title: fields.text({ label: 'Titre' }),
        subTitle: fields.text({ label: 'Sous-titre' }),
        cta: fields.object(ctaFields, { label: 'CTA' }),
        cta2: fields.object(ctaFields, { label: 'CTA secondaire' }),
        image: imageField('Image droite', 'blocks'),
        bottomLine: fields.checkbox({ label: 'Ligne décorative bas', defaultValue: false }),
        logoAtBottom: fields.checkbox({ label: 'Logo en bas', defaultValue: false }),
      }, { label: 'Hero — Page intérieure' }),
      landingHero: fields.object({
        kpis: fields.array(
          fields.object({ heading: fields.text({ label: 'Chiffre' }), description: fields.text({ label: 'Description' }) }),
          { label: 'KPIs', itemLabel: props => props.fields.heading.value || 'KPI' },
        ),
        title: fields.text({ label: 'Titre' }),
        subTitle: fields.text({ label: 'Sous-titre' }),
        cta: fields.object(ctaFields, { label: 'CTA' }),
        bgImage: imageField('Image de fond', 'blocks'),
        bottomLine: fields.checkbox({ label: 'Ligne décorative bas', defaultValue: false }),
      }, { label: 'Hero — Landing' }),
      talkToUs: fields.object({
        bgClass: fields.text({ label: 'Classe fond (optionnel)' }),
        image: imageField('Photo', 'blocks'),
        title: fields.text({ label: 'Titre' }),
        subTitle: fields.text({ label: 'Sous-titre' }),
        contentDetails: fields.text({ label: 'Contenu', multiline: true }),
        cta: fields.object(ctaFields, { label: 'CTA' }),
      }, { label: 'Talk to us' }),
      trustOnUs: fields.object({
        title: fields.text({ label: 'Titre' }),
        subTitle: fields.text({ label: 'Sous-titre' }),
        logos: fields.array(imageField('Logo', 'blocks'), { label: 'Logos', itemLabel: () => 'Logo' }),
        cta: fields.object(ctaFields, { label: 'CTA' }),
      }, { label: 'Trust on us' }),
      applicationsUsed: fields.object({
        logo: imageField('Logo principal', 'blocks'),
        title: fields.text({ label: 'Titre' }),
        discoverCta: fields.object(ctaFields, { label: 'CTA' }),
        logos: fields.array(
          fields.object({ logo: imageField('Logo', 'blocks'), title: fields.text({ label: 'Nom' }) }),
          { label: 'Applications', itemLabel: props => props.fields.title.value || 'Application' },
        ),
      }, { label: 'Applications utilisées' }),
      caseIntro: fields.object({
        bgClass: fields.text({ label: 'Classe fond (optionnel)' }),
        needsLabel: fields.text({ label: 'Libellé "Besoins"', defaultValue: 'Needs' }),
        needs: fields.array(fields.text({ label: 'Besoin' }), { label: 'Besoins', itemLabel: props => props.value || 'Besoin' }),
        challengesLabel: fields.text({ label: 'Libellé "Défis"', defaultValue: 'The Challenges' }),
        challenge: fields.text({ label: 'Défi', multiline: true }),
        solutionLabel: fields.text({ label: 'Libellé "Solution"', defaultValue: 'The Solution' }),
        solution: fields.text({ label: 'Solution', multiline: true }),
      }, { label: 'Case intro' }),
      odooExpertise: fields.object({
        bgClass: fields.text({ label: 'Classe fond (optionnel)' }),
        title: fields.text({ label: 'Titre' }),
        items: fields.array(
          fields.object({
            logo: imageField('Icône', 'blocks'),
            heading: fields.text({ label: 'Titre' }),
            descriptionPoints: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Expertises', itemLabel: props => props.fields.heading.value || 'Expertise' },
        ),
      }, { label: 'Expertise Odoo' }),
      ideasIntoSoftware: fields.object({
        title: fields.text({ label: 'Titre' }),
        subTitle: fields.text({ label: 'Sous-titre', multiline: true }),
        ideas: fields.array(
          fields.object({ heading: fields.text({ label: 'Titre' }), description: fields.text({ label: 'Description', multiline: true }) }),
          { label: 'Idées', itemLabel: props => props.fields.heading.value || 'Idée' },
        ),
      }, { label: 'Ideas into software' }),
      heroImageBelow: fields.object({
        imageBelow: imageField('Image', 'blocks'),
        bottomLine: fields.checkbox({ label: 'Ligne décorative bas', defaultValue: false }),
      }, { label: 'Hero image below' }),
      caseOverview: fields.object({
        metrics: fields.array(
          fields.object({
            label: fields.text({ label: 'Libellé' }),
            counter: fields.text({ label: 'Compteur (optionnel)' }),
            value: fields.text({ label: 'Valeur' }),
          }),
          { label: 'Métriques', itemLabel: props => props.fields.label.value || 'Métrique' },
        ),
      }, { label: 'Case overview' }),
      caseInsights: fields.object({
        insights: fields.array(
          fields.object({
            heading: fields.text({ label: 'Titre' }),
            content: fields.text({ label: 'Contenu', multiline: true }),
            imageToDisplay: fields.select({
              label: 'Image(s) à afficher',
              options: [{ label: 'Aucune', value: '0' }, { label: 'Une image', value: '1' }, { label: 'Deux images', value: '2' }],
              defaultValue: '0',
            }),
            image: imageField('Image', 'blocks'),
            image1: imageField('Image 1', 'blocks'),
            image2: imageField('Image 2', 'blocks'),
          }),
          { label: 'Insights', itemLabel: props => props.fields.heading.value || 'Insight' },
        ),
      }, { label: 'Case insights' }),
      feedback: fields.object({
        feedbacks: fields.array(
          fields.object({
            title: fields.text({ label: 'Titre' }),
            feedback: fields.text({ label: 'Témoignage', multiline: true }),
            userImage: imageField('Photo', 'blocks'),
            name: fields.text({ label: 'Nom' }),
            role: fields.text({ label: 'Rôle' }),
          }),
          { label: 'Témoignages', itemLabel: props => props.fields.name.value || 'Témoignage' },
        ),
      }, { label: 'Feedback clients' }),
      whyChooseUs: fields.object({
        bgClass: fields.text({ label: 'Classe fond (optionnel)' }),
        title: fields.text({ label: 'Titre' }),
        badges: fields.array(imageField('Badge', 'blocks'), { label: 'Badges', itemLabel: () => 'Badge' }),
        logo: imageField('Logo', 'blocks'),
        image: imageField('Image', 'blocks'),
        items: fields.array(
          fields.object({ title: fields.text({ label: 'Titre' }), content: fields.text({ label: 'Contenu', multiline: true }) }),
          { label: 'Raisons', itemLabel: props => props.fields.title.value || 'Raison' },
        ),
        cta: fields.object(ctaFields, { label: 'CTA' }),
      }, { label: 'Why choose us' }),
      featuredCases: fields.object({
        bgClass: fields.text({ label: 'Classe fond (optionnel)' }),
        title: fields.text({ label: 'Titre' }),
        subTitle: fields.text({ label: 'Sous-titre' }),
        cta: fields.object(ctaFields, { label: 'CTA' }),
        cases: fields.array(
          fields.object({
            title: fields.text({ label: 'Titre' }),
            href: fields.text({ label: 'Lien' }),
            image: imageField('Image', 'blocks'),
            caseType: fields.text({ label: 'Type (optionnel, remplacé par "Types" si renseigné)' }),
            caseTypes: fields.array(fields.text({ label: 'Type' }), { label: 'Types (pastilles vertes)', itemLabel: props => props.value || 'Type' }),
            needs: fields.array(fields.text({ label: 'Besoin' }), { label: 'Besoins', itemLabel: props => props.value || 'Besoin' }),
          }),
          { label: 'Cases', itemLabel: props => props.fields.title.value || 'Case' },
        ),
      }, { label: 'Featured business cases' }),
      creditedAssistance: fields.object({
        title: fields.text({ label: 'Titre' }),
        subTitle: fields.text({ label: 'Sous-titre' }),
        cta: fields.object(ctaFields, { label: 'CTA' }),
        details: fields.array(
          fields.object({ image: imageField('Image', 'blocks'), title: fields.text({ label: 'Texte' }) }),
          { label: 'Détails', itemLabel: props => props.fields.title.value || 'Détail' },
        ),
      }, { label: 'Credited assistance' }),
      helpBlock: fields.object({
        bgClass: fields.text({ label: 'Classe fond (optionnel)' }),
        dark: fields.checkbox({ label: 'Cartes sombres (style pricing)', defaultValue: false }),
        title: fields.text({ label: 'Titre' }),
        headingTitle: fields.text({ label: 'Titre principal' }),
        cards: fields.array(
          fields.object({
            title: fields.text({ label: 'Titre' }),
            subTitle: fields.text({ label: 'Sous-titre' }),
            link: fields.text({ label: 'Lien' }),
            linkLabel: fields.text({ label: 'Texte du lien' }),
            newTab: fields.checkbox({ label: 'Ouvrir dans un nouvel onglet', defaultValue: false }),
          }),
          { label: 'Cartes', itemLabel: props => props.fields.title.value || 'Carte' },
        ),
        cta: fields.object(ctaFields, { label: 'CTA' }),
      }, { label: 'Help block' }),
      teamMembersScrollSlider: fields.object({
        subHeading: fields.text({ label: 'Sous-titre' }),
        mainHeading: fields.text({ label: 'Titre' }),
        teamMembers: fields.array(
          fields.object({
            image: imageField('Photo', 'blocks'),
            name: fields.text({ label: 'Nom' }),
            role: fields.text({ label: 'Rôle' }),
          }),
          { label: 'Équipe', itemLabel: props => props.fields.name.value || 'Membre' },
        ),
        cta: fields.object(ctaFields, { label: 'CTA' }),
      }, { label: 'Équipe (slider)' }),
      ourServices: fields.object({
        title: fields.text({ label: 'Titre' }),
        subTitle: fields.text({ label: 'Sous-titre' }),
        services: fields.array(
          fields.object({
            title: fields.text({ label: 'Nom de la formule' }),
            price: fields.text({ label: 'Prix affiché (optionnel)', description: 'Vide = affiche "Nous consulter". Ex: 3 500 € / an' }),
            link: fields.text({ label: 'Lien' }),
            linkLabel: fields.text({ label: 'Texte du lien' }),
            features: fields.array(
              fields.object({
                included: fields.checkbox({ label: 'Inclus (coché) ou non-inclus (décoché)', defaultValue: true }),
                text: fields.text({ label: 'Texte' }),
                href: fields.text({ label: 'Lien (optionnel)' }),
              }),
              { label: 'Caractéristiques', itemLabel: props => props.fields.text.value || 'Ligne' },
            ),
          }),
          { label: 'Formules', itemLabel: props => props.fields.title.value || 'Formule' },
        ),
      }, { label: 'Nos services — même structure que les offres agifid' }),
      companyIntro: fields.object({
        badges: fields.array(imageField('Badge', 'blocks'), { label: 'Badges', itemLabel: () => 'Badge' }),
        logo: imageField('Logo', 'blocks'),
        title: fields.text({ label: 'Titre' }),
        cta: fields.object(ctaFields, { label: 'CTA' }),
        leftImage: imageField('Image gauche (optionnel)', 'blocks'),
        variantClass: fields.text({ label: 'Classe variante (optionnel)' }),
      }, { label: 'Company intro' }),
      methodologies: fields.object({
        bgClass: fields.text({ label: 'Classe fond (optionnel)' }),
        title: fields.text({ label: 'Titre' }),
        description: fields.text({ label: 'Description', multiline: true }),
        methodologies: fields.array(
          fields.object({
            heading: fields.text({ label: 'Titre de l\'étape' }),
            subHeading: fields.text({ label: 'Sous-titre (paragraphe)', multiline: true }),
            description: fields.text({ label: 'Texte (HTML)', multiline: true }),
          }),
          { label: 'Étapes (numérotées automatiquement)', itemLabel: props => props.fields.heading.value || 'Étape' },
        ),
      }, { label: 'Méthodologie — même structure que l\'onboarding agifid' }),
      keyFeatures: fields.object({
        subTitle: fields.text({ label: 'Sous-titre intro' }),
        title: fields.text({ label: 'Titre intro' }),
        features: fields.array(
          fields.object({
            title: fields.text({ label: 'Titre' }),
            description: fields.text({ label: 'Description', multiline: true }),
            pointLabel: fields.text({ label: 'Libellé avantage' }),
            pointDescription: fields.text({ label: 'Description avantage' }),
            blockToDisplay: fields.select({
              label: 'Contenu affiché',
              options: [
                { label: 'Aucun', value: 'none' },
                { label: 'Logos', value: 'logos' },
                { label: 'Image', value: 'image' },
                { label: 'Vidéo (oEmbed)', value: 'oembed' },
              ],
              defaultValue: 'none',
            }),
            logos: fields.array(
              fields.object({ logo: imageField('Logo', 'blocks'), logoTitle: fields.text({ label: 'Nom' }) }),
              { label: 'Logos', itemLabel: props => props.fields.logoTitle.value || 'Logo' },
            ),
            image: imageField('Image', 'blocks'),
            embedUrl: fields.text({ label: 'URL embed vidéo' }),
          }),
          { label: 'Points clés', itemLabel: props => props.fields.title.value || 'Point' },
        ),
      }, { label: 'Key features' }),
      contactUsSection: fields.object({
        mainHeading: fields.text({ label: 'Titre' }),
        highlights: fields.array(fields.text({ label: 'Point' }), { label: 'Points clés', itemLabel: props => props.value || 'Point' }),
        ctaHeading: fields.text({ label: 'Titre CTA' }),
        ctaSubHeading: fields.text({ label: 'Sous-titre CTA' }),
        profileImage: imageField('Photo', 'blocks'),
        cta: fields.object(ctaFields, { label: 'CTA' }),
      }, { label: 'Section contact' }),
      officesSection: fields.object({
        title: fields.text({ label: 'Titre' }),
        subTitle: fields.text({ label: 'Sous-titre' }),
        mapLabel: fields.text({ label: 'Texte du lien carte', defaultValue: 'Voir sur la carte' }),
        showMap: fields.checkbox({ label: 'Afficher une carte intégrée par bureau', defaultValue: false }),
        offices: fields.array(
          fields.object({
            city: fields.text({ label: 'Ville' }),
            address: fields.text({ label: 'Adresse' }),
          }),
          { label: 'Bureaux', itemLabel: props => props.fields.city.value || 'Bureau' },
        ),
      }, { label: 'Nos bureaux' }),
      expertise: fields.object({
        bgClass: fields.text({ label: 'Classe fond (optionnel)' }),
        customList: fields.checkbox({ label: 'Liste personnalisée', defaultValue: false }),
        title: fields.text({ label: 'Titre' }),
        description: fields.text({ label: 'Description', multiline: true }),
        expertise: fields.array(
          fields.object({
            icon: imageField('Icône', 'blocks'),
            heading: fields.text({ label: 'Titre' }),
            subHeading: fields.text({ label: 'Sous-titre' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Expertises', itemLabel: props => props.fields.heading.value || 'Expertise' },
        ),
      }, { label: 'Expertise' }),
      whyJoin: fields.object({
        leftTitle: fields.text({ label: 'Titre gauche' }),
        mainTitle: fields.text({ label: 'Titre principal' }),
        content: fields.text({ label: 'Contenu', multiline: true }),
        perks: fields.array(
          fields.object({
            icon: imageField('Icône', 'blocks'),
            title: fields.text({ label: 'Titre' }),
            points: fields.text({ label: 'Points', multiline: true }),
          }),
          { label: 'Avantages', itemLabel: props => props.fields.title.value || 'Avantage' },
        ),
        image: imageField('Image', 'blocks'),
      }, { label: 'Pourquoi nous rejoindre' }),
      openPositions: fields.object({
        title: fields.text({ label: 'Titre' }),
        subTitle: fields.text({ label: 'Sous-titre' }),
        portalUrl: fields.text({ label: 'URL du portail recrutement (bouton, prioritaire sur la liste ci-dessous)', description: 'Ex: https://agitech-19.cloudpepper.site/jobs' }),
        portalLabel: fields.text({ label: 'Texte du bouton', description: 'Ex: Voir tous nos postes ouverts' }),
        jobs: fields.array(
          fields.object({ jobTitle: fields.text({ label: 'Intitulé du poste' }), link: fields.text({ label: 'Lien' }) }),
          { label: 'Postes (repli si pas de portail)', itemLabel: props => props.fields.jobTitle.value || 'Poste' },
        ),
      }, { label: 'Postes ouverts' }),
      selectionProcess: fields.object({
        title: fields.text({ label: 'Titre' }),
        steps: fields.array(
          fields.object({ heading: fields.text({ label: 'Titre' }), description: fields.text({ label: 'Description', multiline: true }) }),
          { label: 'Étapes', itemLabel: props => props.fields.heading.value || 'Étape' },
        ),
      }, { label: 'Processus de sélection' }),
      cmsPage: fields.object({
        title: fields.text({ label: 'Titre' }),
        content: fields.text({ label: 'Contenu (HTML)', multiline: true }),
      }, { label: 'Page CMS' }),
      teamMembers: fields.object({
        title: fields.text({ label: 'Titre' }),
        subTitle: fields.text({ label: 'Sous-titre' }),
        teamMembers: fields.array(
          fields.object({
            image: imageField('Photo', 'blocks'),
            name: fields.text({ label: 'Nom' }),
            role: fields.text({ label: 'Rôle' }),
            introduction: fields.text({ label: 'Introduction', multiline: true }),
            linkedinUrl: fields.text({ label: 'URL LinkedIn' }),
            linkedinLabel: fields.text({ label: 'Texte du lien' }),
          }),
          { label: 'Membres', itemLabel: props => props.fields.name.value || 'Membre' },
        ),
      }, { label: 'Équipe (grille)' }),
      recruitingCta: fields.object({
        title: fields.text({ label: 'Titre' }),
        subTitle: fields.text({ label: 'Sous-titre' }),
        contentDetails: fields.text({ label: 'Contenu', multiline: true }),
        cta: fields.object(ctaFields, { label: 'CTA' }),
        image: imageField('Image', 'blocks'),
      }, { label: 'Recrutement CTA' }),
      contactHero: fields.object({
        titleBefore: fields.text({ label: 'Titre (avant le mot en mauve)' }),
        titleHighlight: fields.text({ label: 'Mot en mauve', defaultValue: 'projet' }),
        trustList: fields.array(fields.text({ label: 'Point de confiance' }), { label: 'Liste de confiance', itemLabel: props => props.value || 'Point' }),
        directTitle: fields.text({ label: 'Titre "réserver directement"' }),
        directText: fields.text({ label: 'Texte', multiline: true }),
        calendlyUrl: fields.text({ label: 'URL Calendly', defaultValue: 'https://calendly.com/sam-agitech/25-min-intro' }),
        formAction: fields.text({ label: 'Endpoint Formspree' }),
        formSubject: fields.text({ label: 'Sujet email' }),
        thankYouPath: fields.text({ label: 'Page de remerciement (formulaire)' }),
        offices: fields.array(fields.text({ label: 'Bureau' }), { label: 'Bureaux (dropdown formulaire)', itemLabel: props => props.value || 'Bureau' }),
        officeLabel: fields.text({ label: 'Libellé du champ bureau' }),
      }, { label: 'Contact + Calendly' }),
      faq: fields.object({
        title: fields.text({ label: 'Titre' }),
        subtitle: fields.text({ label: 'Sous-titre' }),
        items: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            answer: fields.text({ label: 'Réponse', multiline: true }),
          }),
          { label: 'Questions', itemLabel: props => props.fields.question.value || 'Question' },
        ),
      }, { label: 'FAQ' }),
      forfaitHome: fields.object({
        title: fields.text({ label: 'Titre' }),
        intro: fields.text({ label: 'Intro (1 phrase)', multiline: true }),
        cards: fields.array(
          fields.object({
            title: fields.text({ label: 'Titre' }),
            text: fields.text({ label: 'Texte', multiline: true }),
            featured: fields.checkbox({ label: 'Mise en avant', defaultValue: false }),
          }),
          { label: 'Cartes', itemLabel: props => props.fields.title.value || 'Carte' },
        ),
        tagsTitle: fields.text({ label: 'Titre du combo technique' }),
        tags: fields.array(fields.text({ label: 'Élément construit' }), { label: 'Ce qu\'on construit (note sous le combo)', itemLabel: props => props.value || 'Élément' }),
        explainerText: fields.text({ label: 'Texte explicatif (1 paragraphe)', multiline: true }),
        ctaPrimary: fields.object(ctaFields, { label: 'CTA principal' }),
        ctaSecondary: fields.object(ctaFields, { label: 'CTA secondaire' }),
        diyTitle: fields.text({ label: 'Encart DIY — titre' }),
        diyText: fields.text({ label: 'Encart DIY — texte' }),
        diyCta: fields.object(ctaFields, { label: 'Encart DIY — CTA' }),
      }, { label: 'Forfait — Section accueil' }),
      blogPosts: fields.object({
        loadMoreLabel: fields.text({ label: 'Libellé du bouton « voir plus » (optionnel)', description: 'Vide = libellé par défaut de la langue de la page' }),
      }, { label: 'Liste des articles (filtres par catégorie, 8 par page). Les articles viennent de la collection Blog, dans la langue de la page.' }),
      businessCasesList: fields.object({
        loadMoreLabel: fields.text({ label: 'Libellé du bouton « voir plus » (optionnel)', description: 'Vide = libellé par défaut de la langue de la page' }),
      }, { label: 'Liste des business cases (filtres par type, 8 par page). Les cas viennent de la collection Business Cases, dans la langue de la page.' }),
      textSection: fields.object({
        title: fields.text({ label: 'Titre (H2)' }),
        content: fields.text({ label: 'Contenu (HTML)', multiline: true }),
        emphasis: fields.checkbox({ label: 'Mise en emphase (section limites)', defaultValue: false }),
      }, { label: 'Forfait — Section texte' }),
      contentPlaceholder: fields.object({
        variant: fields.select({
          label: 'Variante',
          options: [
            { label: 'Cas chiffrés', value: 'cases' },
            { label: 'Galerie captures', value: 'gallery' },
          ],
          defaultValue: 'cases',
        }),
        title: fields.text({ label: 'Titre (H2)' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        count: fields.integer({ label: 'Nombre de placeholders', defaultValue: 3 }),
      }, { label: 'Forfait — Placeholder' }),
      ctaBanner: fields.object({
        title: fields.text({ label: 'Titre' }),
        ctaLabel: fields.text({ label: 'Texte bouton' }),
        ctaUrl: fields.text({ label: 'Lien' }),
      }, { label: 'Forfait — CTA final' }),
    },
  ),
  { label: 'Contenu (blocs)', itemLabel: props => props.discriminant },
);

// ---- Site settings (singletons). Stored as JSON under src/content/settings and read by src/lib/settings.ts. ----
const linkFields = {
  label: fields.text({ label: 'Texte' }),
  href: fields.text({ label: 'Lien', description: 'Adresse relative (/contact-us/), adresse complète, ou # pour un titre sans lien.' }),
};
const labelOf = (props: { fields: { label: { value: string } } }) => props.fields.label.value || 'Sans titre';
const menuLeaf = fields.object({ ...linkFields }, { label: 'Lien' });
const menuColumn = fields.object(
  { ...linkFields, children: fields.array(menuLeaf, { label: 'Liens de la colonne', itemLabel: labelOf }) },
  { label: 'Colonne' },
);
const menuItem = fields.object(
  { ...linkFields, children: fields.array(menuColumn, { label: 'Sous-menu (colonnes)', itemLabel: labelOf }) },
  { label: 'Entrée' },
);
const navigationOf = (label: string) => fields.object({
  items: fields.array(menuItem, { label: 'Entrées du menu', itemLabel: labelOf }),
  discuss: fields.text({ label: 'Texte du bouton de contact' }),
  discussHref: fields.text({ label: 'Lien du bouton de contact' }),
}, { label });

const footerOf = (label: string) => fields.object({
  newsletterTitle: fields.text({ label: 'Titre de la newsletter' }),
  emailPlaceholder: fields.text({ label: 'Exemple dans le champ e-mail' }),
  tagline: fields.text({ label: 'Phrase d\'accroche' }),
  companyName: fields.text({ label: 'Nom de la société (adresse)' }),
  addressLines: fields.array(fields.text({ label: 'Ligne' }), { label: 'Adresse', itemLabel: (props) => props.value || 'Ligne' }),
  navTitle: fields.text({ label: 'Titre du menu' }),
  links: fields.array(fields.object({ ...linkFields }, { label: 'Lien' }), { label: 'Liens du menu', itemLabel: labelOf }),
  rights: fields.text({ label: 'Mention « droits réservés »' }),
  privacyLabel: fields.text({ label: 'Texte du lien confidentialité' }),
  privacyHref: fields.text({ label: 'Lien confidentialité' }),
  termsLabel: fields.text({ label: 'Texte du lien conditions' }),
  termsHref: fields.text({ label: 'Lien conditions' }),
}, { label });

const labelsOf = (label: string) => fields.object({
  learnMore: fields.text({ label: 'Lien « En savoir plus » des cartes' }),
  listing: fields.object({
    all: fields.text({ label: 'Onglet « tout »' }),
    morePosts: fields.text({ label: 'Bouton « plus d\'articles »' }),
    moreCases: fields.text({ label: 'Bouton « plus de cas »' }),
  }, { label: 'Listes blog et réalisations' }),
  article: fields.object({
    back: fields.text({ label: 'Retour' }),
    share: fields.text({ label: 'Partager' }),
    send: fields.text({ label: 'Envoyer' }),
    visit: fields.text({ label: 'Visiter le site' }),
  }, { label: 'Page d\'article' }),
  contactForm: fields.object({
    title: fields.text({ label: 'Titre' }),
    name: fields.text({ label: 'Nom' }),
    company: fields.text({ label: 'Société' }),
    email: fields.text({ label: 'E-mail' }),
    phone: fields.text({ label: 'Téléphone' }),
    message: fields.text({ label: 'Message' }),
    send: fields.text({ label: 'Bouton d\'envoi' }),
    formLabel: fields.text({ label: 'Nom du formulaire (accessibilité)' }),
  }, { label: 'Formulaire de la page Contact' }),
  blogCategories: fields.array(fields.text({ label: 'Catégorie' }), {
    label: 'Onglets du blog (catégories)',
    description: 'Un onglet par catégorie, avec le même nom que sur les articles. Vide = les catégories réellement utilisées.',
    itemLabel: (props) => props.value || 'Catégorie',
  }),
  caseTypes: fields.array(fields.object({
    name: fields.text({ label: 'Nom (comme dans le champ « Types » des réalisations)' }),
    slug: fields.text({ label: 'Identifiant du filtre', description: 'Lettres minuscules et tirets.' }),
  }, { label: 'Type' }), { label: 'Onglets des réalisations (types)', itemLabel: (props) => props.fields.name.value || 'Type' }),
}, { label });

// Same value on the FR, EN and NL versions of one page / post / case: drives the hreflang links,
// the language switcher and the sitemap alternates (src/lib/translations.mjs). Empty = no translation.
const translationKeyField = fields.text({
  label: 'Clé de traduction',
  description: 'Identique sur les versions FR, EN et NL d\'un même contenu (en général le slug français). Vide si le contenu n\'existe que dans une langue.',
});

// Images inserted in the text of an article / page: stored under public/ so the site serves them (the editor's
// default would put them next to the content file, which is not published).
const markdocImages = { image: { directory: 'public/assets/img/posts', publicPath: '/assets/img/posts/' } };

const urlSlugField = fields.text({
  label: 'Slug de l\'URL',
  description: 'Fin de l\'adresse (ex. contact-us). Laisser vide pour reprendre le nom du fichier. À remplir quand la version EN ou NL d\'une page porte la même adresse que la française : le fichier doit alors avoir un nom différent (ex. contact-us-en).',
});
const draftField = fields.checkbox({
  label: 'Brouillon',
  description: 'Coché : le contenu n\'est pas publié (ni page, ni liste, ni sitemap, ni flux). Il reste visible dans les préversions Vercel.',
  defaultValue: false,
});
// SEO fields shared by pages, posts and business cases (title and description are defined per collection).
const seoExtraFields = {
  ogImage: fields.image({
    label: 'Image de partage (Open Graph)',
    description: 'Aperçu sur LinkedIn, WhatsApp… Vide = image de couverture, sinon image par défaut du site (Réglages du site).',
    directory: 'public/assets/img/og',
    publicPath: '/assets/img/og/',
  }),
  canonicalUrl: fields.text({ label: 'URL canonique (optionnel)', description: 'Adresse complète si cette page reprend le contenu d\'une autre (https://agitech.io/…). Vide = son adresse.' }),
  noindex: fields.checkbox({ label: 'Ne pas indexer (noindex)', description: 'Demande aux moteurs de recherche d\'ignorer la page ; elle sort aussi du sitemap.', defaultValue: false }),
};

export default config({
  // This file also runs in the browser (editor UI), where only import.meta.env exists, not process.env.
  // PUBLIC_KEYSTATIC_STORAGE=github in development lets /keystatic run the "create the GitHub App" setup;
  // PUBLIC_KEYSTATIC_REPO follows the repository if it moves to another GitHub organisation.
  storage:
    import.meta.env.DEV && import.meta.env.PUBLIC_KEYSTATIC_STORAGE !== 'github'
      ? { kind: 'local' }
      : { kind: 'github', repo: (import.meta.env.PUBLIC_KEYSTATIC_REPO || 'Diego-Agitech/agitech.io') as `${string}/${string}` },
  ui: {
    brand: { name: 'Agitech — Éditeur du site' },
    navigation: {
      Contenu: ['pages', 'blog', 'businessCases', 'authors', 'media'],
      'Réglages du site': ['siteSettings', 'navigation', 'footer', 'labels'],
    },
  },
  collections: {
    authors: collection({
      label: 'Auteurs',
      slugField: 'name',
      path: 'src/content/authors/*',
      format: 'yaml',
      schema: {
        name: fields.slug({ name: { label: 'Nom (tel qu\'affiché dans le blog)' } }),
        image: imageField('Photo', 'blocks'),
        role: fields.text({ label: 'Intitulé (petit titre de l\'encart)' }),
        heading: fields.text({ label: 'Titre de l\'encart', multiline: true }),
        introduction: fields.text({ label: 'Texte (HTML)', multiline: true }),
        website: fields.text({ label: 'Site web (bouton « Visiter le site », optionnel)' }),
      },
    }),
    media: collection({
      label: 'Médiathèque',
      slugField: 'title',
      path: 'src/content/media/*',
      format: 'yaml',
      columns: ['title', 'alt'],
      schema: {
        title: fields.slug({ name: { label: 'Nom', description: 'Sert à retrouver l\'image dans les listes des blocs.' } }),
        image: fields.image({
          label: 'Image',
          description: 'Réduire le fichier avant l\'envoi (SVG, WebP ou PNG léger).',
          directory: 'public/assets/img/media',
          publicPath: '/assets/img/media/',
        }),
        alt: fields.text({
          label: 'Texte alternatif',
          multiline: true,
          description: 'Décrit l\'image pour les lecteurs d\'écran et Google. Vide = image décorative (icône, fond).',
        }),
      },
    }),
    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'body' },
      columns: ['title', 'lang', 'publishedAt', 'author'],
      schema: {
        title: fields.slug({ name: { label: 'Titre' } }),
        lang: fields.select({
          label: 'Langue',
          options: [
            { label: 'Français', value: 'fr' },
            { label: 'English', value: 'en' },
            { label: 'Nederlands', value: 'nl' },
          ],
          defaultValue: 'fr',
        }),
        translationKey: translationKeyField,
        urlSlug: urlSlugField,
        draft: draftField,
        publishedAt: fields.datetime({ label: 'Date et heure de publication', description: 'La date affichée vient d\'ici ; l\'heure sert à ordonner les articles du même jour.' }),
        author: fields.relationship({ label: 'Auteur', collection: 'authors' }),
        categories: fields.array(fields.text({ label: 'Catégorie' }), {
          label: 'Catégories (pastilles et filtres du blog)',
          itemLabel: props => props.value || 'Catégorie',
        }),
        excerpt: fields.text({ label: 'Résumé', multiline: true }),
        seoTitle: fields.text({ label: 'Titre SEO (balise title)', description: 'Vide = titre de l\'article' }),
        seoDescription: fields.text({ label: 'Description SEO (meta description)', multiline: true, description: 'Vide = résumé' }),
        ...seoExtraFields,
        coverImage: fields.image({
          label: 'Image de couverture',
          directory: 'public/assets/img/blog',
          publicPath: '/assets/img/blog/',
        }),
        contentHtml: fields.text({ label: 'Contenu HTML (articles historiques WordPress)', multiline: true, description: 'Si rempli, remplace le contenu ci-dessous : à utiliser seulement pour les articles construits avec des blocs WordPress (tableaux, colonnes, tailles de texte).' }),
        body: fields.markdoc({ label: 'Contenu', options: markdocImages }),
      },
    }),
    businessCases: collection({
      label: 'Business Cases',
      slugField: 'title',
      path: 'src/content/business-cases/*',
      format: { contentField: 'body' },
      columns: ['title', 'lang', 'client'],
      schema: {
        title: fields.slug({ name: { label: 'Titre' } }),
        lang: fields.select({
          label: 'Langue',
          options: [
            { label: 'Français', value: 'fr' },
            { label: 'English', value: 'en' },
            { label: 'Nederlands', value: 'nl' },
          ],
          defaultValue: 'fr',
        }),
        translationKey: translationKeyField,
        urlSlug: urlSlugField,
        draft: draftField,
        client: fields.text({ label: 'Nom affiché dans les listes', description: 'Titre de la carte (ex. Break The Ice)' }),
        publishedAt: fields.datetime({ label: 'Date de publication (ordre de la page Réalisations)' }),
        types: fields.array(fields.text({ label: 'Type' }), {
          label: 'Types (pastilles vertes et filtres de la page Réalisations)',
          itemLabel: props => props.value || 'Type',
        }),
        coverImage: imageField('Image de couverture (carte)', 'blocks'),
        seoTitle: fields.text({ label: 'Titre SEO' }),
        seoDescription: fields.text({ label: 'Description SEO', multiline: true }),
        ...seoExtraFields,
        blocks: blocksField,
        body: fields.markdoc({ label: 'Contenu additionnel (optionnel)', options: markdocImages }),
      },
    }),
    pages: collection({
      label: 'Pages',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'body' },
      columns: ['title', 'lang'],
      schema: {
        title: fields.slug({ name: { label: 'Titre' } }),
        lang: fields.select({
          label: 'Langue',
          options: [
            { label: 'Français', value: 'fr' },
            { label: 'English', value: 'en' },
            { label: 'Nederlands', value: 'nl' },
          ],
          defaultValue: 'fr',
        }),
        translationKey: translationKeyField,
        urlSlug: urlSlugField,
        draft: draftField,
        seoTitle: fields.text({ label: 'Titre SEO' }),
        seoDescription: fields.text({ label: 'Description SEO', multiline: true }),
        ...seoExtraFields,
        blocks: blocksField,
        body: fields.markdoc({ label: 'Contenu additionnel (optionnel)', options: markdocImages }),
      },
    }),
  },
  singletons: {
    siteSettings: singleton({
      label: 'Réglages du site',
      path: 'src/content/settings/site',
      format: { data: 'json' },
      schema: {
        siteName: fields.text({ label: 'Nom du site', description: 'Repris dans le titre des partages et les données structurées.' }),
        companyName: fields.text({ label: 'Nom de la société (mention © du pied de page)' }),
        defaultImage: fields.image({
          label: 'Image par défaut (partages et logo des données structurées)',
          description: 'Utilisée quand une page n\'a pas d\'image de partage.',
          directory: 'public/assets/img/og',
          publicPath: '/assets/img/og/',
        }),
        socialLinks: fields.array(fields.object({
          label: fields.text({ label: 'Réseau' }),
          url: fields.text({ label: 'Adresse' }),
          icon: imageField('Icône (pied de page)', 'blocks'),
          inStructuredData: fields.checkbox({ label: 'Déclarer comme profil officiel (Google)', defaultValue: true }),
        }, { label: 'Réseau' }), { label: 'Réseaux sociaux (pied de page)', itemLabel: labelOf }),
      },
    }),
    navigation: singleton({
      label: 'Navigation (menu principal)',
      path: 'src/content/settings/navigation',
      format: { data: 'json' },
      schema: { fr: navigationOf('Français'), en: navigationOf('English'), nl: navigationOf('Nederlands') },
    }),
    footer: singleton({
      label: 'Pied de page',
      path: 'src/content/settings/footer',
      format: { data: 'json' },
      schema: { fr: footerOf('Français'), en: footerOf('English'), nl: footerOf('Nederlands') },
    }),
    labels: singleton({
      label: 'Libellés d\'interface',
      path: 'src/content/settings/labels',
      format: { data: 'json' },
      schema: { fr: labelsOf('Français'), en: labelsOf('English'), nl: labelsOf('Nederlands') },
    }),
  },
});
