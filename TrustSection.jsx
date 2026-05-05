import { Shield, Award, Users, TrendingUp } from 'lucide-react';

export const TrustSection = () => {
  const trustIndicators = [
    {
      icon: Shield,
      title: 'Régulé et Autorisé',
      description: 'Licence FCA, CySEC et ACPR',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Award,
      title: 'Récompenses',
      description: 'Meilleur Broker 2024',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: Users,
      title: '500K+ Clients',
      description: 'Dans plus de 130 pays',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: TrendingUp,
      title: '18+ Ans',
      description: 'D\'expérience sur les marchés',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  const regulations = [
    { name: 'FCA', fullName: 'Financial Conduct Authority (UK)', number: 'FRN 509909' },
    { name: 'CySEC', fullName: 'Cyprus Securities and Exchange Commission', number: '169/12' },
    { name: 'ACPR', fullName: 'Autorité de Contrôle Prudentiel et de Résolution', number: '62506' },
    { name: 'KNF', fullName: 'Polish Financial Supervision Authority', number: 'DRB/001' },
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-success/10 border border-success/20 rounded-full px-4 py-2 mb-4">
            <Shield className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">Confiance et Sécurité</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Un Partenaire
            <span className="block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              de Confiance
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Régulé par les principales autorités financières mondiales. Vos fonds sont protégés et séparés.
          </p>
        </div>

        {/* Trust Indicators Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustIndicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${indicator.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 ${indicator.color}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{indicator.title}</h3>
                <p className="text-sm text-muted-foreground">{indicator.description}</p>
              </div>
            );
          })}
        </div>

        {/* Regulations */}
        <div className="bg-card border border-border rounded-lg p-8">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">Régulations et Licences</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {regulations.map((regulation, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-primary">{regulation.name}</span>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{regulation.fullName}</p>
                <p className="text-xs text-muted-foreground">{regulation.number}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Awards Section */}
        <div className="mt-12 bg-gradient-to-br from-card via-background to-card border border-border rounded-lg p-8">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">Récompenses et Distinctions</h3>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <Award className="w-12 h-12 text-primary mx-auto mb-3" />
              <h4 className="font-semibold text-foreground mb-1">Meilleur Broker 2024</h4>
              <p className="text-sm text-muted-foreground">ForexBrokers.com</p>
            </div>
            <div>
              <Award className="w-12 h-12 text-secondary mx-auto mb-3" />
              <h4 className="font-semibold text-foreground mb-1">Meilleure Plateforme</h4>
              <p className="text-sm text-muted-foreground">Investment Trends</p>
            </div>
            <div>
              <Award className="w-12 h-12 text-success mx-auto mb-3" />
              <h4 className="font-semibold text-foreground mb-1">Service Client #1</h4>
              <p className="text-sm text-muted-foreground">Trustpilot Excellence</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
