import { useState } from 'react';
import { TrendingUp, PieChart, Wallet, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ProductTabsSection = () => {
  const [activeTab, setActiveTab] = useState('trade');

  const tabs = [
    { id: 'trade', label: 'Trade', icon: TrendingUp },
    { id: 'invest', label: 'Invest', icon: PieChart },
    { id: 'bank', label: 'Bank', icon: Wallet },
  ];

  const products = {
    trade: [
      {
        title: 'Actions',
        description: 'Performance historique supérieure à la plupart des autres investissements, les actions constituent la pierre angulaire de la plupart des portefeuilles.',
        link: '#',
      },
      {
        title: 'Cryptomonnaies',
        description: 'Connues pour leur volatilité extrême, mais aussi pour leurs rendements élevés. Découvrez 50+ devises sur notre plateforme.',
        link: '#',
      },
      {
        title: 'ETFs',
        description: 'Les fonds négociés en bourse (ETF) contiennent plusieurs titres et visent à reproduire la performance d\'un indice boursier spécifique.',
        link: '#',
      },
      {
        title: 'Forex',
        description: 'Le marché des changes est un marché décentralisé 24 heures sur 24 pour les devises et les métaux précieux.',
        link: '#',
      },
      {
        title: 'CFDs',
        description: 'Profitez des mouvements ascendants et descendants de divers actifs sous-jacents, sans avoir à les posséder réellement.',
        link: '#',
      },
    ],
    invest: [
      {
        title: 'Invest Easy',
        description: 'Une solution d\'investissement pour les amateurs de simplicité, offrant des stratégies prédéfinies professionnellement.',
        link: '#',
      },
      {
        title: 'Plans d\'Épargne',
        description: 'Construisez votre portefeuille pièce par pièce. Investissez dans des fractions d\'actions, d\'ETF et de cryptos.',
        link: '#',
      },
      {
        title: 'Investissement ESG',
        description: 'Accédez aux scores ESG par entreprise, sélectionnez les thèmes qui vous attirent et évitez les secteurs qui ne vous intéressent pas.',
        link: '#',
      },
      {
        title: 'Impact Investing',
        description: 'Investissez dans des entreprises à fort potentiel et partagez la moitié de vos dividendes pour financer des projets durables.',
        link: '#',
      },
    ],
    bank: [
      {
        title: 'Cartes de Débit',
        description: 'Que vous privilégiez la simplicité ou recherchiez des avantages exclusifs, nous avons une carte conçue pour vous.',
        link: '#',
      },
      {
        title: 'Save Easy',
        description: 'Simplifiez votre épargne avec un compte multi-devises. Gagnez jusqu\'à 5% d\'intérêts sans frais et sans tracas.',
        link: '#',
      },
      {
        title: 'Prêt Hypothécaire',
        description: 'Votre nouvelle maison de rêve vous attend. Notre prêt hypothécaire vous rapproche d\'un pas avec des taux d\'intérêt à partir de 0,66%.',
        link: '#',
      },
      {
        title: 'Comptes Multi-Devises',
        description: 'Détenez CHF, EUR, USD, GBP, AED et ZAR tout en gagnant des intérêts. Aucun dépôt minimum requis.',
        link: '#',
      },
    ],
  };

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex justify-center space-x-2 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground glow-gold'
                    : 'bg-background text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products[activeTab].slice(0, 6).map((product, index) => (
            <div
              key={index}
              className="group bg-background border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-elevated transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors" style={{ fontFamily: 'Cinzel, serif' }}>
                {product.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {product.description}
              </p>
              <Button
                variant="ghost"
                className="p-0 h-auto text-primary hover:text-primary-hover group"
              >
                Explorer
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-primary/50 hover:bg-primary/10 text-foreground">
            Voir Tous les Produits
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
