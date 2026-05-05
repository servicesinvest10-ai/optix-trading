import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp,
  Maximize2,
  Minimize2
} from 'lucide-react';
import TradingChart from './TradingChart';

// Symbol mappings for TradingView
const SYMBOLS = {
  // Crypto
  'BTC/USD': 'BINANCE:BTCUSDT',
  'ETH/USD': 'BINANCE:ETHUSDT',
  'XRP/USD': 'BINANCE:XRPUSDT',
  'SOL/USD': 'BINANCE:SOLUSDT',
  // Forex
  'EUR/USD': 'FX:EURUSD',
  'GBP/USD': 'FX:GBPUSD',
  'USD/JPY': 'FX:USDJPY',
  'AUD/USD': 'FX:AUDUSD',
  'USD/CAD': 'FX:USDCAD',
  'USD/CHF': 'FX:USDCHF',
  // Indices
  'US30': 'TVC:DJI',
  'US500': 'SP:SPX',
  'NASDAQ': 'NASDAQ:NDX',
  'DAX': 'XETR:DAX',
  // Commodities
  'XAU/USD': 'TVC:GOLD',
  'XAG/USD': 'TVC:SILVER',
  'CRUDE': 'TVC:USOIL',
};

// Timeframe options
const TIMEFRAMES = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  { label: '15m', value: '15' },
  { label: '1H', value: '60' },
  { label: '4H', value: '240' },
  { label: '1D', value: 'D' },
  { label: '1W', value: 'W' },
  { label: '1M', value: 'M' },
];

// Symbol categories
const SYMBOL_CATEGORIES = {
  crypto: [
    { symbol: 'BTC/USD', name: 'Bitcoin' },
    { symbol: 'ETH/USD', name: 'Ethereum' },
    { symbol: 'XRP/USD', name: 'Ripple' },
    { symbol: 'SOL/USD', name: 'Solana' },
  ],
  forex: [
    { symbol: 'EUR/USD', name: 'Euro/Dollar' },
    { symbol: 'GBP/USD', name: 'Livre/Dollar' },
    { symbol: 'USD/JPY', name: 'Dollar/Yen' },
    { symbol: 'AUD/USD', name: 'Aussie/Dollar' },
  ],
  indices: [
    { symbol: 'US30', name: 'Dow Jones' },
    { symbol: 'US500', name: 'S&P 500' },
    { symbol: 'NASDAQ', name: 'Nasdaq 100' },
    { symbol: 'DAX', name: 'DAX 40' },
  ],
  commodities: [
    { symbol: 'XAU/USD', name: 'Or' },
    { symbol: 'XAG/USD', name: 'Argent' },
    { symbol: 'CRUDE', name: 'Pétrole' },
  ],
};

export const ChartSection = ({ 
  selectedSymbol = 'BTC/USD', 
  onSymbolChange,
  height = 500,
  showSymbolSelector = true,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const [activeSymbol, setActiveSymbol] = useState(selectedSymbol);
  const [activeTimeframe, setActiveTimeframe] = useState('D');
  const [activeCategory, setActiveCategory] = useState('crypto');

  const handleSymbolChange = (symbol) => {
    setActiveSymbol(symbol);
    if (onSymbolChange) {
      onSymbolChange(symbol);
    }
  };

  const tradingViewSymbol = SYMBOLS[activeSymbol] || 'BINANCE:BTCUSDT';

  return (
    <Card className={`bg-[#111] border-[#1a1a1a] ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <CardHeader className="border-b border-[#1a1a1a] pb-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">{activeSymbol}</CardTitle>
              <p className="text-xs text-gray-400">Graphique TradingView</p>
            </div>
          </div>

          {/* Timeframe Selection */}
          <div className="flex items-center gap-1 bg-[#0a0a0a] rounded-lg p-1">
            {TIMEFRAMES.map((tf) => (
              <Button
                key={tf.value}
                size="sm"
                variant="ghost"
                onClick={() => setActiveTimeframe(tf.value)}
                className={`h-7 px-2 text-xs ${
                  activeTimeframe === tf.value
                    ? 'bg-[#d4af37] text-black hover:bg-[#aa8a2e]'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                {tf.label}
              </Button>
            ))}
          </div>

          {/* Fullscreen Toggle */}
          {onToggleFullscreen && (
            <Button
              size="sm"
              variant="outline"
              onClick={onToggleFullscreen}
              className="border-[#333] hover:bg-[#1a1a1a] hover:border-[#d4af37]"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        {/* Symbol Quick Selection */}
        {showSymbolSelector && (
          <div className="mt-4 space-y-3">
            {/* Category Tabs */}
            <div className="flex gap-2 flex-wrap">
              {Object.keys(SYMBOL_CATEGORIES).map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  variant="ghost"
                  onClick={() => setActiveCategory(cat)}
                  className={`h-7 px-3 text-xs capitalize ${
                    activeCategory === cat
                      ? 'bg-[#1a1a1a] text-[#d4af37] border border-[#d4af37]/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {cat === 'crypto' ? 'Crypto' : 
                   cat === 'forex' ? 'Forex' : 
                   cat === 'indices' ? 'Indices' : 'Matières'}
                </Button>
              ))}
            </div>

            {/* Symbols in Category */}
            <div className="flex gap-2 flex-wrap">
              {SYMBOL_CATEGORIES[activeCategory].map((item) => (
                <Button
                  key={item.symbol}
                  size="sm"
                  variant="outline"
                  onClick={() => handleSymbolChange(item.symbol)}
                  className={`h-8 px-3 text-xs ${
                    activeSymbol === item.symbol
                      ? 'bg-[#d4af37] text-black border-[#d4af37] hover:bg-[#aa8a2e]'
                      : 'border-[#333] text-gray-300 hover:border-[#d4af37]/50 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {item.symbol}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div style={{ height: isFullscreen ? 'calc(100vh - 200px)' : `${height}px` }}>
          <TradingChart
            symbol={tradingViewSymbol}
            interval={activeTimeframe}
            theme="dark"
            height={height}
            autosize={true}
            showToolbar={true}
            showDrawingToolbar={true}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartSection;
