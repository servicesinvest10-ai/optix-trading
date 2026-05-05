import { Button } from '@/components/ui/button';
import { CheckCircle2, UserPlus, CreditCard, TrendingUp } from 'lucide-react';

export const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Choisissez Votre Compte',
      description: 'Compte Elite ou Compte Forex & CFDs, selon vos objectifs financiers et votre style de trading.',
      image: '/api/placeholder/400/300',
    },
    {
      number: '02',
      icon: CheckCircle2,
      title: 'Vérification Instantanée',
      description: 'Document d\'identité (passeport, carte d\'identité) et justificatif de domicile de moins de 6 mois.',
      image: '/api/placeholder/400/300',
    },
    {
      number: '03',
      icon: CreditCard,
      title: 'Ajoutez des Fonds',
      description: 'Transférez le montant de votre choix vers votre nouveau compte et commencez votre voyage financier amélioré.',
      image: '/api/placeholder/400/300',
    },
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
            3 Étapes Suffisent
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rejoignez l'élite du trading en quelques minutes
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative group"
              >
                {/* Connecting line (not on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
                )}

                <div className="bg-card border border-border rounded-lg p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-elevated relative z-10">
                  {/* Step number */}
                  <div className="absolute -top-6 left-8">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg glow-gold">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mt-8 mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3 text-center" style={{ fontFamily: 'Cinzel, serif' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-10 glow-gold">
            <TrendingUp className="mr-2 h-5 w-5" />
            Ouvrir Votre Compte Elite
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Aucun dépôt minimum • Compte démo gratuit • Support 24/7
          </p>
        </div>
      </div>
    </section>
  );
};
