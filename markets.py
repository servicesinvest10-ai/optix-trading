from fastapi import APIRouter
from models.market import MarketData
from utils.market_simulator import market_simulator

router = APIRouter(prefix="/api/markets", tags=["Markets"])

@router.get("/", response_model=MarketData)
async def get_markets():
    """Get all market data organized by category"""
    return market_simulator.get_market_data()

@router.get("/price/{symbol}")
async def get_price(symbol: str):
    """Get current price for a specific symbol"""
    price = market_simulator.get_price(symbol)
    if price == 0.0:
        return {"error": "Symbol not found"}
    return {"symbol": symbol, "price": price}
