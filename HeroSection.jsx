import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, Globe, ChevronRight, Eye } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Premium background with subtle gold accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background"></div>
      
      {/* Carbon fiber texture overlay */}
      <div className="absolute inset-0 carbon-texture opacity-30"></div>
      
      {/* Radial gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"></div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Sécurité & Prestige</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
              Vision Elite du
              <span className="block mt-2 gold-shimmer bg-clip-text text-transparent">
                Trading Mondial
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              Accédez aux marchés financiers avec une précision absolue. Plus de 5 000 instruments premium : Actions, Forex, Indices, Crypto et Matières Premières.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-base px-8 glow-gold group">
                Commencer l&apos;Expérience
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10 text-foreground font-semibold text-base px-8">
                <Eye className="mr-2 h-5 w-5" />
                Essayer en Démo
              </Button>
            </div>

            {/* Premium Trust Indicators */}
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 mb-1">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-primary" style={{ fontFamily: 'Cinzel, serif' }}>5000+</span>
                </div>
                <span className="text-sm text-muted-foreground">Instruments Elite</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-primary" style={{ fontFamily: 'Cinzel, serif' }}>18+</span>
                </div>
                <span className="text-sm text-muted-foreground">Ans d&apos;Excellence</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 mb-1">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-primary" style={{ fontFamily: 'Cinzel, serif' }}>100%</span>
                </div>
                <span className="text-sm text-muted-foreground">Sécurisé</span>
              </div>
            </div>
          </div>

          {/* Right Content - Premium Platform Preview */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative bg-card border border-primary/20 rounded-lg overflow-hidden shadow-elevated">
              {/* Mock Trading Interface */}
              <div className="bg-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-primary" style={{ fontFamily: 'Cinzel, serif' }}>Plateforme Optix Royal</span>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFB700]"></div>
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                  </div>
                </div>
                
                {/* Chart placeholder with gold accent */}
                <div className="bg-background rounded-lg p-4 mb-4 border border-primary/10">
                  <div className="flex items-end justify-between h-48 space-x-2">
                    {[40, 60, 45, 70, 55, 80, 65, 90, 75, 85, 70, 95].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-primary/30 to-primary rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                    <span>09:00</span>
                    <span>12:00</span>
                    <span>15:00</span>
                    <span>18:00</span>
                  </div>
                </div>

                {/* Quick stats with gold theme */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background rounded-lg p-3 border border-success/30">
                    <div className="text-xs text-muted-foreground mb-1">EUR/USD</div>
                    <div className="text-lg font-bold text-success">1.0952</div>
                    <div className="text-xs text-success">+0.24%</div>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-destructive/30">
                    <div className="text-xs text-muted-foreground mb-1">BTC/USD</div>
                    <div className="text-lg font-bold text-destructive">64,258</div>
                    <div className="text-xs text-destructive">-1.52%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge with gold glow */}
            <div className="absolute -top-4 -right-4 bg-primary rounded-full p-4 shadow-elevated glow-gold">
              <Eye className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
