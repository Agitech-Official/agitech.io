// Single source of truth for the main menu — Header and Footer both read from here
// so the two can never drift apart.
export type Lang = 'fr' | 'en' | 'nl';
type Link = { label: string; href: string; external?: boolean };

const strings = {
  fr: { odoo: 'Odoo ERP', industries: 'Solutions', services: 'Services', cases: 'Réalisations', blog: 'Blog', team: 'Jobs', contact: 'Discutons', allIndustries: 'Toutes les solutions' },
  en: { odoo: 'Odoo ERP', industries: 'Solutions', services: 'Services', cases: 'Case Studies', blog: 'Blog', team: 'Jobs', contact: 'Contact', allIndustries: 'All solutions' },
  nl: { odoo: 'Odoo ERP', industries: 'Oplossingen', services: 'Diensten', cases: 'Realisaties', blog: 'Blog', team: 'Jobs', contact: 'Contact', allIndustries: 'Alle oplossingen' },
};

const industries: Record<Lang, Link[]> = {
  fr: [
    { label: 'E-Commerce', href: '/industries-e-commerce/' },
    { label: 'Grossiste & Vente B2B', href: '/industries-grossiste-vente-b2b/' },
    { label: 'Construction & Bâtiment', href: '/industries-construction-batiment/' },
    { label: 'Services aux Entreprises', href: '/industries-services-aux-entreprises/' },
    { label: 'Transport & Logistique', href: '/solution-transport-logistique/' },
    { label: 'Associations Internationales', href: '/industries-associations-internationales/' },
    { label: 'Gestion Immobilière', href: '/solution-gestion-immobiliere/' },
    { label: 'Auto-École', href: '/solution-auto-ecole/' },
  ],
  en: [
    { label: 'E-Commerce', href: '/en/industries-e-commerce/' },
    { label: 'Wholesale & B2B Sales', href: '/en/industries-wholesale-b2b-sales/' },
    { label: 'Construction & Building', href: '/en/industries-construction-batiment/' },
    { label: 'Business Services', href: '/en/solution-business-services/' },
    { label: 'Transport & Logistics', href: '/en/solution-transport-logistics/' },
    { label: 'NGOs & International Associations', href: '/en/industries-ngos-international-associations/' },
    { label: 'Property Management', href: '/en/solution-gestion-immobiliere/' },
    { label: 'Driving School', href: '/en/solution-auto-ecole/' },
  ],
  nl: [
    { label: 'E-commerce', href: '/nl/industries-e-commerce/' },
    { label: 'Groothandel & B2B-verkoop', href: '/nl/industries-grossiste-vente-b2b/' },
    { label: 'Bouw & Constructie', href: '/nl/industries-construction-batiment/' },
    { label: 'Zakelijke Dienstverlening', href: '/nl/industries-services-aux-entreprises/' },
    { label: 'Transport & Logistiek', href: '/nl/solution-transport-logistique/' },
    { label: 'Internationale Verenigingen', href: '/nl/industries-associations-internationales/' },
    { label: 'Vastgoedbeheer', href: '/nl/solution-gestion-immobiliere/' },
    { label: 'Rijschool', href: '/nl/solution-auto-ecole/' },
  ],
};

// "Comptabilité" hands off to AgiFid (sister company, separate site).
const services: Record<Lang, Link[]> = {
  fr: [
    { label: 'Comptabilité (AgiFid)', href: '/comptabilite-odoo-agifid/' },
    { label: 'Implémentation Odoo', href: '/odoo-erp/' },
    { label: 'Formation', href: '/formation/' },
    { label: 'Support', href: '/support/' },
    { label: 'Hosting & Monitoring', href: '/hosting-monitoring/' },
    { label: 'Migration de données', href: '/migration/' },
    { label: 'Mise à niveau de version', href: '/mise-a-niveau-version/' },
    { label: 'Réseau et IoT', href: '/infrastructure-it/' },
    { label: 'Développement', href: '/development/' },
    { label: 'Développement au forfait (IA)', href: '/developpement-odoo-forfait/' },
  ],
  en: [
    { label: 'Accounting (AgiFid)', href: '/en/comptabilite-odoo-agifid/' },
    { label: 'Odoo Implementation', href: '/en/odoo-erp/' },
    { label: 'Training', href: '/en/formation/' },
    { label: 'Support', href: '/en/support/' },
    { label: 'Hosting & Monitoring', href: '/en/hosting-monitoring/' },
    { label: 'Data Migration', href: '/en/migration/' },
    { label: 'Version Upgrade', href: '/en/mise-a-niveau-version/' },
    { label: 'Network & IoT', href: '/en/infrastructure-it/' },
    { label: 'Development', href: '/en/development/' },
    { label: 'Fixed-Price Development (AI)', href: '/en/developpement-odoo-forfait/' },
  ],
  nl: [
    { label: 'Boekhouding (AgiFid)', href: '/nl/comptabilite-odoo-agifid/' },
    { label: 'Odoo Implementatie', href: '/nl/odoo-erp/' },
    { label: 'Opleiding', href: '/nl/formation/' },
    { label: 'Support', href: '/nl/support/' },
    { label: 'Hosting & Monitoring', href: '/nl/hosting-monitoring/' },
    { label: 'Data Migratie', href: '/nl/migration/' },
    { label: 'Versie-upgrade', href: '/nl/mise-a-niveau-version/' },
    { label: 'Netwerk & IoT', href: '/nl/infrastructure-it/' },
    { label: 'Ontwikkeling', href: '/nl/development/' },
    { label: 'Ontwikkeling met vaste prijs (AI)', href: '/nl/developpement-odoo-forfait/' },
  ],
};

export function getNav(lang: Lang) {
  return { strings: strings[lang], industries: industries[lang], services: services[lang] };
}
