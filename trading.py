from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from typing import List
import os
from database import get_database
from models.order import OrderCreate, Order, Position
from models.account import AccountBalance
from utils.auth import get_current_user_email
from utils.market_simulator import market_simulator

router = APIRouter(prefix="/api/trading", tags=["Trading"])

@router.get("/balance", response_model=AccountBalance)
async def get_balance(email: str = Depends(get_current_user_email)):
    """Get user account balances"""
    db = get_database()
    
    user = await db.users.find_one({"email": email}, {"_id": 1, "demo_balance": 1, "real_balance": 1})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate total P&L from open positions with limit
    positions = await db.positions.find(
        {"user_id": str(user["_id"])},
        {"profit_loss": 1}
    ).limit(100).to_list(length=100)
    total_pl = sum(pos.get("profit_loss", 0) for pos in positions)
    
    return AccountBalance(
        demo_balance=user.get("demo_balance", 10000.0),
        real_balance=user.get("real_balance", 0.0),
        total_profit_loss=total_pl
    )

@router.post("/order", response_model=Order, status_code=status.HTTP_201_CREATED)
async def place_order(order_data: OrderCreate, email: str = Depends(get_current_user_email)):
    """Place a buy or sell order"""
    db = get_database()
    
    # Get user
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get current price
    current_price = market_simulator.get_price(order_data.symbol)
    if current_price == 0.0:
        raise HTTPException(status_code=400, detail="Invalid symbol")
    
    # Calculate order cost
    order_cost = current_price * order_data.quantity
    
    # Check balance
    balance_field = f"{order_data.account_type}_balance"
    current_balance = user.get(balance_field, 0.0)
    
    if order_data.order_type == "buy" and current_balance < order_cost:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient {order_data.account_type} balance"
        )
    
    # Create order
    order_dict = {
        "user_id": str(user["_id"]),
        "symbol": order_data.symbol,
        "order_type": order_data.order_type,
        "quantity": order_data.quantity,
        "price": current_price,
        "account_type": order_data.account_type,
        "status": "executed",
        "created_at": datetime.utcnow(),
        "executed_at": datetime.utcnow()
    }
    
    result = await db.orders.insert_one(order_dict)
    order_dict["_id"] = str(result.inserted_id)
    
    # Update user balance
    if order_data.order_type == "buy":
        new_balance = current_balance - order_cost
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {balance_field: new_balance}}
        )
        
        # Create or update position
        position = await db.positions.find_one({
            "user_id": str(user["_id"]),
            "symbol": order_data.symbol,
            "account_type": order_data.account_type
        })
        
        if position:
            # Update existing position
            new_quantity = position["quantity"] + order_data.quantity
            new_entry_price = (
                (position["entry_price"] * position["quantity"]) + 
                (current_price * order_data.quantity)
            ) / new_quantity
            
            await db.positions.update_one(
                {"_id": position["_id"]},
                {"$set": {
                    "quantity": new_quantity,
                    "entry_price": new_entry_price,
                    "current_price": current_price
                }}
            )
        else:
            # Create new position
            position_dict = {
                "user_id": str(user["_id"]),
                "symbol": order_data.symbol,
                "position_type": "long",
                "quantity": order_data.quantity,
                "entry_price": current_price,
                "current_price": current_price,
                "profit_loss": 0.0,
                "account_type": order_data.account_type,
                "opened_at": datetime.utcnow()
            }
            await db.positions.insert_one(position_dict)
    
    elif order_data.order_type == "sell":
        # Check for existing LONG position first
        position = await db.positions.find_one({
            "user_id": str(user["_id"]),
            "symbol": order_data.symbol,
            "account_type": order_data.account_type,
            "position_type": "long"
        })
        
        if position:
            # Close or reduce existing LONG position
            if position["quantity"] < order_data.quantity:
                raise HTTPException(status_code=400, detail="Insufficient quantity to sell from long position")
            
            # Calculate profit/loss
            profit = (current_price - position["entry_price"]) * order_data.quantity
            new_balance = current_balance + (current_price * order_data.quantity)
            
            await db.users.update_one(
                {"_id": user["_id"]},
                {"$set": {balance_field: new_balance}}
            )
            
            # Update or close position
            if position["quantity"] == order_data.quantity:
                # Close position completely
                await db.positions.delete_one({"_id": position["_id"]})
            else:
                # Reduce quantity
                new_quantity = position["quantity"] - order_data.quantity
                await db.positions.update_one(
                    {"_id": position["_id"]},
                    {"$set": {"quantity": new_quantity, "current_price": current_price}}
                )
        else:
            # Open a new SHORT position
            # Check if there's already a short position for this symbol
            existing_short = await db.positions.find_one({
                "user_id": str(user["_id"]),
                "symbol": order_data.symbol,
                "account_type": order_data.account_type,
                "position_type": "short"
            })
            
            # Deduct margin from balance (same as buy)
            new_balance = current_balance - order_cost
            await db.users.update_one(
                {"_id": user["_id"]},
                {"$set": {balance_field: new_balance}}
            )
            
            if existing_short:
                # Add to existing short position
                new_quantity = existing_short["quantity"] + order_data.quantity
                new_entry_price = (
                    (existing_short["entry_price"] * existing_short["quantity"]) + 
                    (current_price * order_data.quantity)
                ) / new_quantity
                
                await db.positions.update_one(
                    {"_id": existing_short["_id"]},
                    {"$set": {
                        "quantity": new_quantity,
                        "entry_price": new_entry_price,
                        "current_price": current_price
                    }}
                )
            else:
                # Create new SHORT position
                position_dict = {
                    "user_id": str(user["_id"]),
                    "symbol": order_data.symbol,
                    "position_type": "short",
                    "quantity": order_data.quantity,
                    "entry_price": current_price,
                    "current_price": current_price,
                    "profit_loss": 0.0,
                    "account_type": order_data.account_type,
                    "opened_at": datetime.utcnow()
                }
                await db.positions.insert_one(position_dict)
    
    return order_dict

@router.get("/orders", response_model=List[Order])
async def get_orders(email: str = Depends(get_current_user_email)):
    """Get user's order history"""
    db = get_database()
    
    user = await db.users.find_one({"email": email}, {"_id": 1})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    orders = await db.orders.find(
        {"user_id": str(user["_id"])}
    ).sort("created_at", -1).limit(50).to_list(length=50)
    
    # Convert ObjectId to string for serialization
    for order in orders:
        if "_id" in order:
            order["_id"] = str(order["_id"])
    
    return orders

@router.get("/positions", response_model=List[Position])
async def get_positions(email: str = Depends(get_current_user_email)):
    """Get user's open positions"""
    db = get_database()
    
    user = await db.users.find_one({"email": email}, {"_id": 1})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    positions = await db.positions.find({"user_id": str(user["_id"])}).limit(100).to_list(length=100)
    
    # Batch update: collect all updates and apply them
    bulk_updates = []
    for position in positions:
        current_price = market_simulator.get_price(position["symbol"])
        position["current_price"] = current_price
        
        # Calculate P&L based on position type
        if position.get("position_type") == "short":
            # SHORT: profit when price goes DOWN
            position["profit_loss"] = (position["entry_price"] - current_price) * position["quantity"]
        else:
            # LONG: profit when price goes UP
            position["profit_loss"] = (current_price - position["entry_price"]) * position["quantity"]
        
        bulk_updates.append({
            "filter": {"_id": position["_id"]},
            "update": {"$set": {
                "current_price": current_price,
                "profit_loss": position["profit_loss"]
            }}
        })
    
    # Perform bulk update if there are positions
    if bulk_updates:
        from pymongo import UpdateOne
        operations = [UpdateOne(u["filter"], u["update"]) for u in bulk_updates]
        await db.positions.bulk_write(operations)
    
    # Convert ObjectId to string for serialization
    for position in positions:
        if "_id" in position:
            position["_id"] = str(position["_id"])
    
    return positions


@router.post("/positions/{position_id}/close")
async def close_position(position_id: str, email: str = Depends(get_current_user_email)):
    """Close a position completely"""
    db = get_database()
    from bson import ObjectId
    
    # Get user
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get position
    try:
        position = await db.positions.find_one({
            "_id": ObjectId(position_id),
            "user_id": str(user["_id"])
        })
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid position ID")
    
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")
    
    # Get current market price
    current_price = market_simulator.get_price(position["symbol"])
    
    # Calculate final P&L
    entry_price = position["entry_price"]
    quantity = position["quantity"]
    
    if position["position_type"] == "long":
        profit_loss = (current_price - entry_price) * quantity
    else:  # short position
        profit_loss = (entry_price - current_price) * quantity
    
    # Calculate total value to return to balance
    position_value = current_price * quantity
    
    # Update user balance
    balance_field = f"{position.get('account_type', 'demo')}_balance"
    current_balance = user.get(balance_field, 0.0)
    new_balance = current_balance + position_value
    
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {balance_field: new_balance}}
    )
    
    # Create a close order record
    close_order = {
        "user_id": str(user["_id"]),
        "symbol": position["symbol"],
        "order_type": "sell" if position["position_type"] == "long" else "buy",
        "quantity": quantity,
        "price": current_price,
        "account_type": position.get("account_type", "demo"),
        "status": "executed",
        "profit_loss": profit_loss,
        "close_reason": "manual_close",
        "created_at": datetime.utcnow(),
        "executed_at": datetime.utcnow()
    }
    await db.orders.insert_one(close_order)
    
    # Delete the position
    await db.positions.delete_one({"_id": ObjectId(position_id)})
    
    return {
        "success": True,
        "message": "Position closed successfully",
        "position_id": position_id,
        "symbol": position["symbol"],
        "quantity": quantity,
        "entry_price": entry_price,
        "close_price": current_price,
        "profit_loss": round(profit_loss, 2),
        "new_balance": round(new_balance, 2)
    }


@router.post("/positions/close-all")
async def close_all_positions(email: str = Depends(get_current_user_email)):
    """Close all open positions"""
    db = get_database()
    from bson import ObjectId
    
    # Get user
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get all positions
    positions = await db.positions.find({"user_id": str(user["_id"])}).to_list(length=100)
    
    if not positions:
        return {"success": True, "message": "No positions to close", "closed_count": 0}
    
    total_profit_loss = 0
    total_value_returned = 0
    closed_positions = []
    
    for position in positions:
        current_price = market_simulator.get_price(position["symbol"])
        entry_price = position["entry_price"]
        quantity = position["quantity"]
        
        if position["position_type"] == "long":
            profit_loss = (current_price - entry_price) * quantity
        else:
            profit_loss = (entry_price - current_price) * quantity
        
        position_value = current_price * quantity
        total_profit_loss += profit_loss
        total_value_returned += position_value
        
        # Create close order
        close_order = {
            "user_id": str(user["_id"]),
            "symbol": position["symbol"],
            "order_type": "sell" if position["position_type"] == "long" else "buy",
            "quantity": quantity,
            "price": current_price,
            "account_type": position.get("account_type", "demo"),
            "status": "executed",
            "profit_loss": profit_loss,
            "close_reason": "close_all",
            "created_at": datetime.utcnow(),
            "executed_at": datetime.utcnow()
        }
        await db.orders.insert_one(close_order)
        
        closed_positions.append({
            "symbol": position["symbol"],
            "quantity": quantity,
            "profit_loss": round(profit_loss, 2)
        })
    
    # Update user balance
    balance_field = "demo_balance"  # Default to demo
    current_balance = user.get(balance_field, 0.0)
    new_balance = current_balance + total_value_returned
    
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {balance_field: new_balance}}
    )
    
    # Delete all positions
    await db.positions.delete_many({"user_id": str(user["_id"])})
    
    return {
        "success": True,
        "message": f"Closed {len(positions)} positions",
        "closed_count": len(positions),
        "total_profit_loss": round(total_profit_loss, 2),
        "new_balance": round(new_balance, 2),
        "closed_positions": closed_positions
    }

