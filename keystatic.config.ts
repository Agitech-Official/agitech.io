import { config, fields, collection } from '@keystatic/core';

// Shared sub-schemas ported from ACF field groups reused across blocks.
const imageField = (label: string, dir: string) =>
  fields.image({ label, directory: `public/assets/img/${dir}`, publicPath: `/assets/img/${dir}/` });

const ctaFields = {
  label: fields.text({ label: 'Texte du bouton' }),
  url: fields.text({ label: 'Lien' }),
  newTab: fields.checkbox({ label: 'Ouvrir dans un nouvel onglet', defaultValue: false }),
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
        { label: 'Forfait — Cas exemples', value: 'forfaitCases' },
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
            caseType: fields.text({ label: 'Type (optionnel)' }),
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
            description: fields.text({ label: 'Texte', multiline: true }),
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
        eyebrow: fields.text({ label: 'Sur-titre violet' }),
        cards: fields.array(
          fields.object({
            title: fields.text({ label: 'Titre' }),
            text: fields.text({ label: 'Texte', multiline: true }),
            featured: fields.checkbox({ label: 'Mise en avant', defaultValue: false }),
          }),
          { label: 'Cartes', itemLabel: props => props.fields.title.value || 'Carte' },
        ),
        ctaPrimary: fields.object(ctaFields, { label: 'CTA principal' }),
        ctaSecondary: fields.object(ctaFields, { label: 'CTA secondaire' }),
        diyTitle: fields.text({ label: 'Lien DIY — phrase' }),
        diyCta: fields.object(ctaFields, { label: 'Lien DIY — CTA' }),
      }, { label: 'Forfait — Section accueil' }),
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
      forfaitCases: fields.object({
        title: fields.text({ label: 'Titre (H2)' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        note: fields.text({ label: 'Mention sous les cas', multiline: true }),
        labels: fields.object({
          context: fields.text({ label: 'Libellé contexte' }),
          need: fields.text({ label: 'Libellé besoin' }),
          regie: fields.text({ label: 'Libellé coût régie' }),
          forfait: fields.text({ label: 'Libellé prix forfait' }),
          result: fields.text({ label: 'Libellé résultat' }),
        }, { label: 'Libellés' }),
        cases: fields.array(
          fields.object({
            sector: fields.text({ label: 'Secteur' }),
            context: fields.text({ label: 'Contexte client', multiline: true }),
            need: fields.text({ label: 'Besoin', multiline: true }),
            regie: fields.text({ label: 'Coût en régie estimé' }),
            forfait: fields.text({ label: 'Prix forfaitaire' }),
            delay: fields.text({ label: 'Délai' }),
            result: fields.text({ label: 'Résultat', multiline: true }),
          }),
          { label: 'Cas', itemLabel: props => props.fields.sector.value || 'Cas' },
        ),
      }, { label: 'Forfait — Cas exemples' }),
      ctaBanner: fields.object({
        title: fields.text({ label: 'Titre' }),
        ctaLabel: fields.text({ label: 'Texte bouton' }),
        ctaUrl: fields.text({ label: 'Lien' }),
      }, { label: 'Forfait — CTA final' }),
    },
  ),
  { label: 'Contenu (blocs)', itemLabel: props => props.discriminant },
);

export default config({
  storage:
    process.env.NODE_ENV === 'development'
      ? { kind: 'local' }
      : { kind: 'github', repo: 'Diego-Agitech/agitech.io' },
  ui: {
    brand: { name: 'Agitech — Éditeur du site' },
  },
  collections: {
    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'body' },
      columns: ['title', 'lang', 'publishedAt'],
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
        publishedAt: fields.date({ label: 'Date de publication' }),
        category: fields.text({ label: 'Catégorie' }),
        excerpt: fields.text({ label: 'Résumé (SEO/liste)', multiline: true }),
        coverImage: fields.image({
          label: 'Image de couverture',
          directory: 'public/assets/img/blog',
          publicPath: '/assets/img/blog/',
        }),
        body: fields.markdoc({ label: 'Contenu' }),
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
        client: fields.text({ label: 'Client' }),
        industry: fields.text({ label: 'Secteur' }),
        coverImage: imageField('Image de couverture', 'blocks'),
        seoTitle: fields.text({ label: 'Titre SEO' }),
        seoDescription: fields.text({ label: 'Description SEO', multiline: true }),
        blocks: blocksField,
        body: fields.markdoc({ label: 'Contenu additionnel (optionnel)' }),
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
        seoTitle: fields.text({ label: 'Titre SEO' }),
        seoDescription: fields.text({ label: 'Description SEO', multiline: true }),
        blocks: blocksField,
        body: fields.markdoc({ label: 'Contenu additionnel (optionnel)' }),
      },
    }),
  },
});
