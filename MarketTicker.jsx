import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { marketService } from '@/services/marketService';

export const MarketTicker = () => {
  const [markets, setMarkets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch initial market data
    const fetchMarkets = async () => {
      try {
        const data = await marketService.getMarkets();
        // Flatten all markets from different categories
        const allMarkets = [
          ...(data.forex || []),
          ...(data.crypto || []),
          ...(data.indices || []),
          ...(data.commodities || []),
        ];
        setMarkets(allMarkets.slice(0, 10)); // Take first 10 for ticker
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching markets:', error);
        setIsLoading(false);
      }
    };

    fetchMarkets();

    // Update market data every 3 seconds
    const interval = setInterval(fetchMarkets, 3000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading || markets.length === 0) {
    return (
      <div className="bg-card border-y border-border py-3">
        <div className="text-center text-muted-foreground text-sm">Chargement des marchés...</div>
      </div>
    );
  }

  // Duplicate markets for seamless scroll
  const duplicatedMarkets = [...markets, ...markets];

  return (
    <div className="bg-card border-y border-border py-3 overflow-hidden">
      <div className="flex animate-ticker hover:pause" style={{ width: 'fit-content' }}>
        {duplicatedMarkets.map((market, index) => (
          <div
            key={`${market.symbol}-${index}`}
            className="flex items-center space-x-3 px-6 border-r border-border whitespace-nowrap"
          >
            <span className="text-sm font-semibold text-foreground">{market.symbol}</span>
            <span className="text-base font-bold text-foreground">
              {market.price.toLocaleString(undefined, {
                minimumFractionDigits: market.price < 1 ? 4 : 2,
                maximumFractionDigits: market.price < 1 ? 4 : 2,
              })}
            </span>
            <div
              className={`flex items-center space-x-1 ${
                market.change_percent >= 0 ? 'text-success' : 'text-destructive'
              }`}
            >
              {market.change_percent >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="text-sm font-medium">
                {market.change_percent >= 0 ? '+' : ''}
                {market.change_percent.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
