import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, TrendingUp, BarChart3, Zap, Lock } from 'lucide-react';

export const PlatformShowcase = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Graphiques Avancés',
      description: 'Outils d&apos;analyse technique professionnels avec indicateurs personnalisables',
    },
    {
      icon: Zap,
      title: 'Exécution Rapide',
      description: 'Ordres exécutés en millisecondes avec zéro requote',
    },
    {
      icon: BarChart3,
      title: 'Analyse en Temps Réel',
      description: 'Données de marché en direct et actualités financières',
    },
    {
      icon: Lock,
      title: 'Sécurité Maximale',
      description: 'Protection des fonds et chiffrement de niveau bancaire',
    },
  ];

  return (
    <section id="platform" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
            <Monitor className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Notre Plateforme</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Technologie de Trading
            <span className="block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              de Nouvelle Génération
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Une plateforme propriétaire conçue pour les traders exigeants. Interface intuitive, outils professionnels.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Platform Preview */}
          <div className="order-2 lg:order-1">
            <div className="bg-card border border-border rounded-lg p-6 shadow-elevated">
              {/* Mock Trading Terminal */}
              <div className="bg-background rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="px-3 py-1 bg-primary/10 text-primary rounded text-xs font-medium">EUR/USD</div>
                    <div className="px-3 py-1 bg-muted text-muted-foreground rounded text-xs font-medium">GBP/USD</div>
                    <div className="px-3 py-1 bg-muted text-muted-foreground rounded text-xs font-medium">USD/JPY</div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 hover:bg-muted rounded transition-colors">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="relative h-64 bg-card rounded-lg mb-4 overflow-hidden">
                  {/* Grid lines */}
                  <div className="absolute inset-0 grid grid-rows-4 grid-cols-6">
                    {[...Array(24)].map((_, i) => (
                      <div key={i} className="border-r border-b border-border/30"></div>
                    ))}
                  </div>
                  {/* Mock candlesticks */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 256">
                    {/* Positive candle */}
                    <line x1="50" y1="80" x2="50" y2="120" stroke="hsl(var(--success))" strokeWidth="2" />
                    <rect x="45" y="90" width="10" height="20" fill="hsl(var(--success))" />
                    {/* Negative candle */}
                    <line x1="100" y1="100" x2="100" y2="150" stroke="hsl(var(--destructive))" strokeWidth="2" />
                    <rect x="95" y="110" width="10" height="30" fill="hsl(var(--destructive))" />
                    {/* More candles */}
                    <line x1="150" y1="90" x2="150" y2="130" stroke="hsl(var(--success))" strokeWidth="2" />
                    <rect x="145" y="100" width="10" height="20" fill="hsl(var(--success))" />
                    <line x1="200" y1="95" x2="200" y2="125" stroke="hsl(var(--success))" strokeWidth="2" />
                    <rect x="195" y="100" width="10" height="15" fill="hsl(var(--success))" />
                    <line x1="250" y1="110" x2="250" y2="145" stroke="hsl(var(--destructive))" strokeWidth="2" />
                    <rect x="245" y="115" width="10" height="25" fill="hsl(var(--destructive))" />
                    <line x1="300" y1="100" x2="300" y2="135" stroke="hsl(var(--success))" strokeWidth="2" />
                    <rect x="295" y="105" width="10" height="25" fill="hsl(var(--success))" />
                    <line x1="350" y1="85" x2="350" y2="115" stroke="hsl(var(--success))" strokeWidth="2" />
                    <rect x="345" y="90" width="10" height="20" fill="hsl(var(--success))" />
                    <line x1="400" y1="75" x2="400" y2="105" stroke="hsl(var(--success))" strokeWidth="2" />
                    <rect x="395" y="80" width="10" height="20" fill="hsl(var(--success))" />
                    <line x1="450" y1="70" x2="450" y2="95" stroke="hsl(var(--success))" strokeWidth="2" />
                    <rect x="445" y="75" width="10" height="15" fill="hsl(var(--success))" />
                    {/* Trend line */}
                    <path d="M 0 150 Q 150 140 300 110 T 600 60" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.6" />
                  </svg>
                </div>

                {/* Order Panel */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-success hover:bg-success/90 text-success-foreground font-semibold py-3 rounded-lg transition-colors glow-success">
                    ACHETER 1.0952
                  </button>
                  <button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold py-3 rounded-lg transition-colors glow-destructive">
                    VENDRE 1.0950
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background rounded p-3">
                  <div className="text-xs text-muted-foreground mb-1">Spread</div>
                  <div className="text-sm font-bold text-foreground">0.2 pips</div>
                </div>
                <div className="bg-background rounded p-3">
                  <div className="text-xs text-muted-foreground mb-1">Effet de Levier</div>
                  <div className="text-sm font-bold text-foreground">1:500</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="order-1 lg:order-2 space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-card transition-colors duration-200"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Availability */}
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Disponible sur Tous Vos Appareils</h3>
          <p className="text-muted-foreground mb-6">Tradez n\'importe où, n\'importe quand avec nos applications mobile et desktop</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Monitor className="mr-2 h-5 w-5" />
              Télécharger Desktop
            </Button>
            <Button variant="outline" className="border-border hover:bg-card-hover">
              <Smartphone className="mr-2 h-5 w-5" />
              Télécharger Mobile
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
