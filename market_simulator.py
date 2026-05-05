import random
from datetime import datetime
from typing import Dict, List
from models.market import MarketPrice

class MarketSimulator:
    def __init__(self):
        self.base_prices = {
            # Forex
            "EUR/USD": {"price": 1.0952, "name": "Euro / Dollar US", "spread": 0.2, "category": "forex"},
            "GBP/USD": {"price": 1.2634, "name": "Livre Sterling / Dollar US", "spread": 0.3, "category": "forex"},
            "USD/JPY": {"price": 149.82, "name": "Dollar US / Yen Japonais", "spread": 0.2, "category": "forex"},
            "AUD/USD": {"price": 0.6589, "name": "Dollar Australien / Dollar US", "spread": 0.4, "category": "forex"},
            
            # Indices
            "CAC 40": {"price": 7524.30, "name": "France 40", "spread": 1.0, "category": "indices"},
            "DAX": {"price": 16845.20, "name": "Allemagne 40", "spread": 1.2, "category": "indices"},
            "S&P 500": {"price": 4783.45, "name": "US 500", "spread": 0.4, "category": "indices"},
            "FTSE 100": {"price": 7658.20, "name": "UK 100", "spread": 1.5, "category": "indices"},
            
            # Crypto
            "BTC/USD": {"price": 64258.0, "name": "Bitcoin", "spread": 25.0, "category": "crypto"},
            "ETH/USD": {"price": 3456.0, "name": "Ethereum", "spread": 5.0, "category": "crypto"},
            "XRP/USD": {"price": 0.5834, "name": "Ripple", "spread": 0.001, "category": "crypto"},
            "SOL/USD": {"price": 112.34, "name": "Solana", "spread": 0.5, "category": "crypto"},
            
            # Commodities
            "GOLD": {"price": 2042.50, "name": "Or", "spread": 0.3, "category": "commodities"},
            "SILVER": {"price": 23.85, "name": "Argent", "spread": 0.02, "category": "commodities"},
            "OIL": {"price": 78.45, "name": "Pétrole Brut", "spread": 0.03, "category": "commodities"},
            "GAS": {"price": 2.89, "name": "Gaz Naturel", "spread": 0.01, "category": "commodities"},
        }
        
        self.current_prices = {k: v["price"] for k, v in self.base_prices.items()}
        self.previous_prices = self.current_prices.copy()
    
    def update_prices(self):
        """Simulate realistic market price movements"""
        for symbol in self.current_prices.keys():
            base_price = self.base_prices[symbol]["price"]
            
            # Different volatility for different asset types
            if self.base_prices[symbol]["category"] == "crypto":
                volatility = 0.02  # 2% max change
            elif self.base_prices[symbol]["category"] == "forex":
                volatility = 0.001  # 0.1% max change
            elif self.base_prices[symbol]["category"] == "indices":
                volatility = 0.005  # 0.5% max change
            else:  # commodities
                volatility = 0.01  # 1% max change
            
            # Random walk with slight tendency to revert to base price
            change = random.uniform(-volatility, volatility)
            reversion = (base_price - self.current_prices[symbol]) * 0.01
            
            self.previous_prices[symbol] = self.current_prices[symbol]
            self.current_prices[symbol] = self.current_prices[symbol] * (1 + change) + reversion
    
    def get_market_data(self) -> Dict[str, List[MarketPrice]]:
        """Get current market data organized by category"""
        self.update_prices()
        
        result = {
            "forex": [],
            "indices": [],
            "crypto": [],
            "commodities": []
        }
        
        for symbol, data in self.base_prices.items():
            current_price = self.current_prices[symbol]
            previous_price = self.previous_prices[symbol]
            
            change = current_price - previous_price
            change_percent = (change / previous_price) * 100 if previous_price != 0 else 0
            
            market_price = MarketPrice(
                symbol=symbol,
                name=data["name"],
                price=round(current_price, 4 if current_price < 10 else 2),
                change=round(change, 4),
                change_percent=round(change_percent, 2),
                spread=data["spread"],
                category=data["category"],
                last_updated=datetime.utcnow()
            )
            
            result[data["category"]].append(market_price)
        
        return result
    
    def get_price(self, symbol: str) -> float:
        """Get current price for a specific symbol"""
        return self.current_prices.get(symbol, 0.0)

# Global market simulator instance
market_simulator = MarketSimulator()
