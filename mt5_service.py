"""
MetaApi MT5 Integration Service
Provides connection to MT5 demo trading through MetaApi cloud service.

Configuration required in .env:
- METAAPI_TOKEN: Your MetaApi authentication token
- METAAPI_ACCOUNT_ID: Your connected MT5 account ID
"""
import os
import asyncio
import logging
from typing import Optional, Dict, List, Any
from datetime import datetime

logger = logging.getLogger(__name__)

# Check if MetaApi SDK is available
try:
    from metaapi_cloud_sdk import MetaApi
    METAAPI_AVAILABLE = True
except ImportError:
    METAAPI_AVAILABLE = False
    logger.warning("MetaApi SDK not installed. MT5 features will use simulation mode.")


class MT5Service:
    """Service for MT5 trading operations via MetaApi"""
    
    def __init__(self):
        self._api: Optional[Any] = None
        self._account: Optional[Any] = None
        self._connection: Optional[Any] = None
        self._connected = False
        self._simulation_mode = False
        
        # Configuration from environment
        self.token = os.environ.get('METAAPI_TOKEN', '')
        self.account_id = os.environ.get('METAAPI_ACCOUNT_ID', '')
        
    @property
    def is_configured(self) -> bool:
        """Check if MetaApi credentials are configured"""
        return bool(self.token and self.account_id and METAAPI_AVAILABLE)
    
    @property
    def is_connected(self) -> bool:
        """Check if connected to MT5"""
        return self._connected
    
    async def connect(self) -> Dict[str, Any]:
        """Connect to MT5 via MetaApi"""
        if not METAAPI_AVAILABLE:
            self._simulation_mode = True
            logger.info("MetaApi SDK not available - Using simulation mode")
            return {"status": "simulation", "message": "Running in simulation mode"}
        
        if not self.token or not self.account_id:
            self._simulation_mode = True
            logger.warning("MetaApi credentials not configured - Using simulation mode")
            return {
                "status": "not_configured", 
                "message": "METAAPI_TOKEN and METAAPI_ACCOUNT_ID required in .env"
            }
        
        try:
            logger.info("Connecting to MetaApi...")
            self._api = MetaApi(self.token)
            
            # Get the account
            self._account = await self._api.metatrader_account_api.get_account(self.account_id)
            
            # Wait for deployment if needed
            if self._account.state != 'DEPLOYED':
                logger.info(f"Account state: {self._account.state}. Waiting for deployment...")
                await self._account.deploy()
                await self._account.wait_deployed()
            
            # Connect to streaming API
            self._connection = self._account.get_streaming_connection()
            await self._connection.connect()
            
            # Wait for synchronization
            await self._connection.wait_synchronized()
            
            self._connected = True
            self._simulation_mode = False
            
            logger.info(f"Connected to MT5 account: {self._account.login}")
            
            return {
                "status": "connected",
                "account_id": self.account_id,
                "login": self._account.login,
                "broker": self._account.broker,
                "server": self._account.server
            }
            
        except Exception as e:
            logger.error(f"Failed to connect to MetaApi: {e}")
            self._simulation_mode = True
            return {"status": "error", "message": str(e), "simulation_mode": True}
    
    async def disconnect(self):
        """Disconnect from MT5"""
        try:
            if self._connection:
                await self._connection.close()
            if self._api:
                await self._api.close()
            self._connected = False
            logger.info("Disconnected from MetaApi")
        except Exception as e:
            logger.error(f"Error disconnecting: {e}")
    
    async def get_account_info(self) -> Dict[str, Any]:
        """Get MT5 account information"""
        if self._simulation_mode or not self._connected:
            # Return simulated account info
            return {
                "login": 12345678,
                "broker": "IC Markets (Demo)",
                "server": "ICMarketsSC-Demo",
                "currency": "USD",
                "balance": 10000.00,
                "equity": 10000.00,
                "margin": 0.00,
                "free_margin": 10000.00,
                "leverage": 500,
                "margin_level": 0.00,
                "trade_allowed": True,
                "simulation_mode": True
            }
        
        try:
            account_info = self._connection.terminal_state.account_information
            return {
                "login": account_info.get('login'),
                "broker": account_info.get('broker', 'Unknown'),
                "server": account_info.get('server', 'Unknown'),
                "currency": account_info.get('currency', 'USD'),
                "balance": account_info.get('balance', 0),
                "equity": account_info.get('equity', 0),
                "margin": account_info.get('margin', 0),
                "free_margin": account_info.get('freeMargin', 0),
                "leverage": account_info.get('leverage', 1),
                "margin_level": account_info.get('marginLevel', 0),
                "trade_allowed": account_info.get('tradeAllowed', False),
                "simulation_mode": False
            }
        except Exception as e:
            logger.error(f"Error getting account info: {e}")
            raise
    
    async def get_positions(self) -> List[Dict[str, Any]]:
        """Get open positions"""
        if self._simulation_mode or not self._connected:
            return []
        
        try:
            positions = self._connection.terminal_state.positions
            return [
                {
                    "id": pos.get('id'),
                    "symbol": pos.get('symbol'),
                    "type": pos.get('type'),  # POSITION_TYPE_BUY or POSITION_TYPE_SELL
                    "volume": pos.get('volume'),
                    "open_price": pos.get('openPrice'),
                    "current_price": pos.get('currentPrice'),
                    "profit": pos.get('profit', 0),
                    "swap": pos.get('swap', 0),
                    "commission": pos.get('commission', 0),
                    "stop_loss": pos.get('stopLoss'),
                    "take_profit": pos.get('takeProfit'),
                    "open_time": pos.get('time'),
                    "magic": pos.get('magic'),
                    "comment": pos.get('comment')
                }
                for pos in positions
            ]
        except Exception as e:
            logger.error(f"Error getting positions: {e}")
            raise
    
    async def get_orders(self) -> List[Dict[str, Any]]:
        """Get pending orders"""
        if self._simulation_mode or not self._connected:
            return []
        
        try:
            orders = self._connection.terminal_state.orders
            return [
                {
                    "id": order.get('id'),
                    "symbol": order.get('symbol'),
                    "type": order.get('type'),
                    "volume": order.get('volume'),
                    "open_price": order.get('openPrice'),
                    "current_price": order.get('currentPrice'),
                    "state": order.get('state'),
                    "stop_loss": order.get('stopLoss'),
                    "take_profit": order.get('takeProfit'),
                    "time": order.get('time'),
                    "comment": order.get('comment')
                }
                for order in orders
            ]
        except Exception as e:
            logger.error(f"Error getting orders: {e}")
            raise
    
    async def get_symbols(self) -> List[str]:
        """Get available trading symbols"""
        if self._simulation_mode or not self._connected:
            return [
                "EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD",
                "XAUUSD", "XAGUSD", "BTCUSD", "ETHUSD",
                "US30", "US500", "GER40", "UK100"
            ]
        
        try:
            symbols = self._connection.terminal_state.symbols
            return [s.get('symbol') for s in symbols if s.get('symbol')]
        except Exception as e:
            logger.error(f"Error getting symbols: {e}")
            raise
    
    async def get_symbol_price(self, symbol: str) -> Dict[str, Any]:
        """Get current price for a symbol"""
        if self._simulation_mode or not self._connected:
            # Return simulated prices
            import random
            base_prices = {
                "EURUSD": 1.0850, "GBPUSD": 1.2650, "USDJPY": 149.50,
                "AUDUSD": 0.6550, "USDCAD": 1.3550, "XAUUSD": 2650.00,
                "BTCUSD": 65000.00, "ETHUSD": 3500.00, "US30": 42500.00
            }
            base = base_prices.get(symbol, 1.0)
            spread = base * 0.0001
            bid = base + random.uniform(-spread, spread)
            ask = bid + spread
            return {
                "symbol": symbol,
                "bid": round(bid, 5),
                "ask": round(ask, 5),
                "time": datetime.utcnow().isoformat(),
                "simulation_mode": True
            }
        
        try:
            price = await self._connection.get_symbol_price(symbol)
            return {
                "symbol": symbol,
                "bid": price.get('bid'),
                "ask": price.get('ask'),
                "time": price.get('time'),
                "simulation_mode": False
            }
        except Exception as e:
            logger.error(f"Error getting price for {symbol}: {e}")
            raise
    
    async def get_symbol_specification(self, symbol: str) -> Dict[str, Any]:
        """Get symbol specification"""
        if self._simulation_mode or not self._connected:
            return {
                "symbol": symbol,
                "description": f"{symbol} Contract",
                "digits": 5 if "JPY" not in symbol else 3,
                "contract_size": 100000,
                "min_volume": 0.01,
                "max_volume": 100.0,
                "volume_step": 0.01,
                "simulation_mode": True
            }
        
        try:
            spec = await self._connection.get_symbol_specification(symbol)
            return {
                "symbol": spec.get('symbol'),
                "description": spec.get('description'),
                "digits": spec.get('digits'),
                "contract_size": spec.get('contractSize'),
                "min_volume": spec.get('minVolume'),
                "max_volume": spec.get('maxVolume'),
                "volume_step": spec.get('volumeStep'),
                "simulation_mode": False
            }
        except Exception as e:
            logger.error(f"Error getting specification for {symbol}: {e}")
            raise
    
    async def execute_trade(
        self,
        symbol: str,
        order_type: str,  # ORDER_TYPE_BUY, ORDER_TYPE_SELL
        volume: float,
        price: Optional[float] = None,
        stop_loss: Optional[float] = None,
        take_profit: Optional[float] = None,
        comment: Optional[str] = None
    ) -> Dict[str, Any]:
        """Execute a trade"""
        if self._simulation_mode or not self._connected:
            # Simulate trade execution
            import uuid
            return {
                "success": True,
                "order_id": str(uuid.uuid4())[:8],
                "position_id": str(uuid.uuid4())[:8],
                "symbol": symbol,
                "type": order_type,
                "volume": volume,
                "price": price or 0,
                "message": "Trade executed (simulation mode)",
                "simulation_mode": True
            }
        
        try:
            # Prepare trade request
            trade_request = {
                "actionType": order_type,
                "symbol": symbol,
                "volume": volume
            }
            
            if price:
                trade_request["openPrice"] = price
            if stop_loss:
                trade_request["stopLoss"] = stop_loss
            if take_profit:
                trade_request["takeProfit"] = take_profit
            if comment:
                trade_request["comment"] = comment
            
            # Execute trade
            result = await self._connection.create_market_buy_order(
                symbol, volume, stop_loss, take_profit
            ) if order_type == "ORDER_TYPE_BUY" else await self._connection.create_market_sell_order(
                symbol, volume, stop_loss, take_profit
            )
            
            return {
                "success": True,
                "order_id": result.get('orderId'),
                "position_id": result.get('positionId'),
                "symbol": symbol,
                "type": order_type,
                "volume": volume,
                "message": "Trade executed successfully",
                "simulation_mode": False
            }
            
        except Exception as e:
            logger.error(f"Error executing trade: {e}")
            return {
                "success": False,
                "error": str(e),
                "simulation_mode": self._simulation_mode
            }
    
    async def close_position(self, position_id: str) -> Dict[str, Any]:
        """Close a position"""
        if self._simulation_mode or not self._connected:
            return {
                "success": True,
                "position_id": position_id,
                "message": "Position closed (simulation mode)",
                "simulation_mode": True
            }
        
        try:
            result = await self._connection.close_position(position_id)
            return {
                "success": True,
                "position_id": position_id,
                "message": "Position closed successfully",
                "simulation_mode": False
            }
        except Exception as e:
            logger.error(f"Error closing position: {e}")
            return {"success": False, "error": str(e)}
    
    async def modify_position(
        self,
        position_id: str,
        stop_loss: Optional[float] = None,
        take_profit: Optional[float] = None
    ) -> Dict[str, Any]:
        """Modify position SL/TP"""
        if self._simulation_mode or not self._connected:
            return {
                "success": True,
                "position_id": position_id,
                "stop_loss": stop_loss,
                "take_profit": take_profit,
                "message": "Position modified (simulation mode)",
                "simulation_mode": True
            }
        
        try:
            result = await self._connection.modify_position(
                position_id, stop_loss, take_profit
            )
            return {
                "success": True,
                "position_id": position_id,
                "message": "Position modified successfully",
                "simulation_mode": False
            }
        except Exception as e:
            logger.error(f"Error modifying position: {e}")
            return {"success": False, "error": str(e)}


# Global MT5 service instance
mt5_service = MT5Service()
