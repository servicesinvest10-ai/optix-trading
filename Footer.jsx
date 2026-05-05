import { Facebook, Twitter, Linkedin, Youtube, Mail, Phone } from 'lucide-react';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_financeportal-25/artifacts/063k1u8o_image.png';

export const Footer = () => {
  const footerSections = [
    {
      title: 'Trading',
      links: ['Forex', 'Actions', 'Indices', 'Crypto', 'Matières Premières', 'ETFs'],
    },
    {
      title: 'Plateforme',
      links: ['Optix Royal Desktop', 'Application Mobile', 'Web Trader', 'API Trading', 'MetaTrader 5'],
    },
    {
      title: 'Société',
      links: ['À Propos', 'Carrières', 'Presse', 'Partenaires', 'Affiliés', 'Contact'],
    },
    {
      title: 'Support',
      links: ['Centre d\'Aide', 'FAQ', 'Formation', 'Webinaires', 'Glossaire', 'Conditions'],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <a href="#" className="flex items-center space-x-3 mb-4 group">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src={LOGO_URL} 
                  alt="Optix Royal" 
                  className="w-full h-full object-contain group-hover:animate-gold-glow"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary" style={{ fontFamily: 'Cinzel, serif' }}>
                  OPTIX ROYAL
                </span>
                <span className="text-[9px] tracking-wider text-muted-foreground uppercase">
                  Elite Trading
                </span>
              </div>
            </a>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Votre partenaire d&apos;excellence pour le trading en ligne. Accédez aux marchés financiers mondiaux avec une vision précise et des outils professionnels.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="text-sm font-medium text-foreground mb-1">Support Client 24/7</div>
                <a href="tel:+33123456789" className="text-sm text-muted-foreground hover:text-primary">
                  +33 1 23 45 67 89
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="text-sm font-medium text-foreground mb-1">Email</div>
                <a href="mailto:support@optixroyal.com" className="text-sm text-muted-foreground hover:text-primary">
                  support@optixroyal.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Warning */}
        <div className="bg-muted border border-border rounded-lg p-6 mb-8">
          <h4 className="text-sm font-semibold text-foreground mb-2">⚠️ Avertissement sur les Risques</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Les CFDs sont des instruments complexes et présentent un risque élevé de perte rapide en capital en raison de l&apos;effet de levier. 
            <span className="font-semibold text-foreground"> 76% des comptes d&apos;investisseurs particuliers perdent de l&apos;argent</span> lorsqu&apos;ils tradent des CFDs avec ce fournisseur. 
            Vous devez vous demander si vous comprenez le fonctionnement des CFDs et si vous pouvez vous permettre de prendre le risque élevé de perdre votre argent. 
            Les performances passées ne garantissent pas les résultats futurs. Veuillez considérer notre Déclaration de Divulgation des Risques.
          </p>
        </div>

        {/* Legal & Copyright */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 Optix Royal. Tous droits réservés.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Mentions Légales
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Politique de Confidentialité
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookies
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Conditions d&apos;Utilisation
              </a>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Optix Royal est une plateforme de trading d&apos;élite. Régulé par FCA (UK), CySEC (Chypre), ACPR (France).
          </p>
        </div>
      </div>
    </footer>
  );
};
