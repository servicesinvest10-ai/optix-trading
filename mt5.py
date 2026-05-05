"""
MT5 Trading Routes
API endpoints for MetaTrader 5 integration via MetaApi
"""
from fastapi import APIRouter, HTTPException, status, Depends, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from database import get_database
from utils.auth import get_current_user_email
from services.mt5_service import mt5_service
import logging

router = APIRouter(prefix="/api/mt5", tags=["MT5 Trading"])
logger = logging.getLogger(__name__)


# ============== Pydantic Models ==============

class MT5TradeRequest(BaseModel):
    symbol: str = Field(..., description="Trading symbol (e.g., EURUSD)")
    order_type: str = Field(..., description="ORDER_TYPE_BUY or ORDER_TYPE_SELL")
    volume: float = Field(..., gt=0, description="Trade volume in lots")
    price: Optional[float] = Field(None, description="Price for pending orders")
    stop_loss: Optional[float] = Field(None, description="Stop loss price")
    take_profit: Optional[float] = Field(None, description="Take profit price")
    comment: Optional[str] = Field(None, description="Trade comment")

class MT5ModifyRequest(BaseModel):
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None

class MT5ConnectionStatus(BaseModel):
    status: str
    is_configured: bool
    is_connected: bool
    simulation_mode: bool
    message: Optional[str] = None


# ============== Connection Endpoints ==============

@router.get("/status", response_model=MT5ConnectionStatus)
async def get_mt5_status():
    """Get MT5 connection status"""
    return MT5ConnectionStatus(
        status="connected" if mt5_service.is_connected else "disconnected",
        is_configured=mt5_service.is_configured,
        is_connected=mt5_service.is_connected,
        simulation_mode=not mt5_service.is_configured or not mt5_service.is_connected,
        message="MetaApi credentials not configured" if not mt5_service.is_configured else None
    )

@router.post("/connect")
async def connect_to_mt5(email: str = Depends(get_current_user_email)):
    """Connect to MT5 server"""
    try:
        result = await mt5_service.connect()
        return result
    except Exception as e:
        logger.error(f"Connection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/disconnect")
async def disconnect_from_mt5(email: str = Depends(get_current_user_email)):
    """Disconnect from MT5 server"""
    try:
        await mt5_service.disconnect()
        return {"status": "disconnected", "message": "Successfully disconnected from MT5"}
    except Exception as e:
        logger.error(f"Disconnect error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============== Account Endpoints ==============

@router.get("/account")
async def get_mt5_account_info(email: str = Depends(get_current_user_email)):
    """Get MT5 account information"""
    try:
        account_info = await mt5_service.get_account_info()
        return account_info
    except Exception as e:
        logger.error(f"Account info error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/positions")
async def get_mt5_positions(email: str = Depends(get_current_user_email)):
    """Get open MT5 positions"""
    try:
        positions = await mt5_service.get_positions()
        return {"count": len(positions), "positions": positions}
    except Exception as e:
        logger.error(f"Positions error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/orders")
async def get_mt5_orders(email: str = Depends(get_current_user_email)):
    """Get pending MT5 orders"""
    try:
        orders = await mt5_service.get_orders()
        return {"count": len(orders), "orders": orders}
    except Exception as e:
        logger.error(f"Orders error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============== Market Data Endpoints ==============

@router.get("/symbols")
async def get_mt5_symbols(email: str = Depends(get_current_user_email)):
    """Get available trading symbols"""
    try:
        symbols = await mt5_service.get_symbols()
        return {"count": len(symbols), "symbols": symbols}
    except Exception as e:
        logger.error(f"Symbols error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/price/{symbol}")
async def get_symbol_price(symbol: str, email: str = Depends(get_current_user_email)):
    """Get current price for a symbol"""
    try:
        price = await mt5_service.get_symbol_price(symbol)
        return price
    except Exception as e:
        logger.error(f"Price error for {symbol}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/specification/{symbol}")
async def get_symbol_specification(symbol: str, email: str = Depends(get_current_user_email)):
    """Get symbol specification"""
    try:
        spec = await mt5_service.get_symbol_specification(symbol)
        return spec
    except Exception as e:
        logger.error(f"Specification error for {symbol}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============== Trading Endpoints ==============

@router.post("/trade")
async def execute_mt5_trade(
    trade: MT5TradeRequest,
    background_tasks: BackgroundTasks,
    email: str = Depends(get_current_user_email)
):
    """Execute a MT5 trade"""
    try:
        # Validate order type
        valid_types = ["ORDER_TYPE_BUY", "ORDER_TYPE_SELL"]
        if trade.order_type not in valid_types:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid order type. Must be one of: {valid_types}"
            )
        
        # Execute trade
        result = await mt5_service.execute_trade(
            symbol=trade.symbol,
            order_type=trade.order_type,
            volume=trade.volume,
            price=trade.price,
            stop_loss=trade.stop_loss,
            take_profit=trade.take_profit,
            comment=trade.comment
        )
        
        # Store trade in database (background task)
        background_tasks.add_task(
            store_mt5_trade,
            email=email,
            trade_data=trade.dict(),
            result=result
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Trade execution error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/close/{position_id}")
async def close_mt5_position(
    position_id: str,
    email: str = Depends(get_current_user_email)
):
    """Close a MT5 position"""
    try:
        result = await mt5_service.close_position(position_id)
        return result
    except Exception as e:
        logger.error(f"Close position error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/modify/{position_id}")
async def modify_mt5_position(
    position_id: str,
    modify: MT5ModifyRequest,
    email: str = Depends(get_current_user_email)
):
    """Modify MT5 position SL/TP"""
    try:
        result = await mt5_service.modify_position(
            position_id=position_id,
            stop_loss=modify.stop_loss,
            take_profit=modify.take_profit
        )
        return result
    except Exception as e:
        logger.error(f"Modify position error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============== Helper Functions ==============

async def store_mt5_trade(email: str, trade_data: dict, result: dict):
    """Store MT5 trade in database for history"""
    try:
        db = get_database()
        await db.mt5_trades.insert_one({
            "user_email": email,
            "trade_data": trade_data,
            "result": result,
            "timestamp": datetime.utcnow()
        })
    except Exception as e:
        logger.error(f"Error storing MT5 trade: {e}")


# ============== History Endpoints ==============

@router.get("/history")
async def get_mt5_trade_history(
    limit: int = 50,
    email: str = Depends(get_current_user_email)
):
    """Get MT5 trade history from database"""
    try:
        db = get_database()
        trades = await db.mt5_trades.find(
            {"user_email": email}
        ).sort("timestamp", -1).limit(limit).to_list(limit)
        
        for trade in trades:
            trade["_id"] = str(trade["_id"])
        
        return {"count": len(trades), "trades": trades}
    except Exception as e:
        logger.error(f"History error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
