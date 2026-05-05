export const marketService = {
  getMarkets: async () => {
    return {
      forex: [
        { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0952, change_percent: 0.24, spread: '0.1' },
        { symbol: 'GBP/USD', name: 'Pound / US Dollar', price: 1.2645, change_percent: -0.12, spread: '0.2' }
      ],
      crypto: [
        { symbol: 'BTC/USD', name: 'Bitcoin', price: 64258.50, change_percent: 1.52, spread: '12.0' },
        { symbol: 'ETH/USD', name: 'Ethereum', price: 3452.10, change_percent: -0.85, spread: '2.5' }
      ],
      indices: [
        { symbol: 'S&P 500', name: 'US 500 Index', price: 5123.40, change_percent: 0.45, spread: '0.5' }
      ],
      commodities: [
        { symbol: 'GOLD', name: 'Or (Spot)', price: 2165.40, change_percent: 0.15, spread: '0.3' }
      ]
    };
  }
};