import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { marketService } from '@/services/marketService';
import { tradingService } from '@/services/tradingService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const MarketsSection = () => {
  const [activeTab, setActiveTab] = useState('forex');
  const [marketData, setMarketData] = useState({
    forex: [],
    indices: [],
    crypto: [],
    commodities: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [accountType, setAccountType] = useState('demo');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const data = await marketService.getMarkets();
        setMarketData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching markets:', error);
        toast.error('Erreur lors du chargement des marchés');
        setIsLoading(false);
      }
    };

    fetchMarkets();

    // Update every 5 seconds
    const interval = setInterval(fetchMarkets, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTrade = async (symbol, orderType) => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour trader');
      return;
    }

    try {
      await tradingService.placeOrder({
        symbol,
        order_type: orderType,
        quantity: 1.0,
        account_type: accountType,
      });

      const orderLabel = orderType === 'buy' ? 'achat' : 'vente';
      const actionLabel = orderType === 'buy' ? 'Acheté' : 'Vendu';
      
      toast.success(
        `Ordre d${orderLabel === 'achat' ? "'" : 'e '}${orderLabel} placé avec succès !`,
        {
          description: `${symbol} - ${actionLabel} 1 unité`,
        }
      );
    } catch (error) {
      console.error('Trading error:', error);
      toast.error(error.response?.data?.detail || 'Erreur lors de la transaction');
    }
  };

  const tabs = [
    { id: 'forex', label: 'Forex', count: marketData.forex.length },
    { id: 'indices', label: 'Indices', count: marketData.indices.length },
    { id: 'crypto', label: 'Crypto', count: marketData.crypto.length },
    { id: 'commodities', label: 'Matières Premières', count: marketData.commodities.length },
  ];

  if (isLoading) {
    return (
      <section id="markets" className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-muted-foreground">Chargement des marchés...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="markets" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Explorez les
            <span className="block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Marchés Financiers
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Accédez à plus de 5 000 instruments avec des spreads ultra-compétitifs et une exécution instantanée
          </p>
          
          {/* Account Type Selector for Trading */}
          {isAuthenticated && (
            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center bg-muted rounded-lg p-1">
                <button
                  onClick={() => setAccountType('demo')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    accountType === 'demo'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Trader en Démo
                </button>
                <button
                  onClick={() => setAccountType('real')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    accountType === 'real'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Trader en Réel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-background text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs opacity-70">({tab.count}+)</span>
            </button>
          ))}
        </div>

        {/* Market Table */}
        <div className="bg-background border border-border rounded-lg overflow-hidden shadow-elevated">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-6 gap-4 p-4 bg-muted border-b border-border text-sm font-semibold text-muted-foreground">
            <div className="col-span-2">Instrument</div>
            <div className="text-right">Prix</div>
            <div className="text-right">Variation</div>
            <div className="text-right">Spread</div>
            <div className="text-right">Action</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {marketData[activeTab].map((market, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 hover:bg-card-hover transition-colors duration-150"
              >
                {/* Symbol and Name */}
                <div className="col-span-1 md:col-span-2">
                  <div className="font-semibold text-foreground">{market.symbol}</div>
                  <div className="text-sm text-muted-foreground">{market.name}</div>
                </div>

                {/* Price */}
                <div className="flex md:justify-end items-center">
                  <span className="text-sm md:hidden text-muted-foreground mr-2">Prix:</span>
                  <span className="font-bold text-foreground">
                    {market.price.toLocaleString(undefined, {
                      minimumFractionDigits: market.price < 1 ? 4 : 2,
                      maximumFractionDigits: market.price < 1 ? 4 : 2,
                    })}
                  </span>
                </div>

                {/* Change */}
                <div className="flex md:justify-end items-center">
                  <span className="text-sm md:hidden text-muted-foreground mr-2">Variation:</span>
                  <div
                    className={`flex items-center space-x-1 font-semibold ${
                      market.change_percent >= 0 ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {market.change_percent >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>
                      {market.change_percent >= 0 ? '+' : ''}
                      {market.change_percent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Spread */}
                <div className="flex md:justify-end items-center">
                  <span className="text-sm md:hidden text-muted-foreground mr-2">Spread:</span>
                  <span className="text-sm text-muted-foreground">{market.spread}</span>
                </div>

                {/* Actions */}
                <div className="flex md:justify-end items-center space-x-2">
                  <Button
                    size="sm"
                    className="bg-success hover:bg-success/90 text-success-foreground flex-1 md:flex-none"
                    onClick={() => handleTrade(market.symbol, 'buy')}
                  >
                    Acheter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground flex-1 md:flex-none"
                    onClick={() => handleTrade(market.symbol, 'sell')}
                  >
                    Vendre
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold">
            Voir Tous les Marchés
          </Button>
        </div>
      </div>
    </section>
  );
};
