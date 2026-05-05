from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Literal, List
from database import get_database
from utils.auth import get_current_user_email

router = APIRouter(prefix="/api/wallet", tags=["Wallet"])


class WalletTransaction(BaseModel):
    amount: float
    transaction_type: Literal["deposit", "withdraw"]
    method: Optional[str] = "bank_transfer"


@router.get("/balance")
async def get_wallet_balance(email: str = Depends(get_current_user_email)):
    db = get_database()
    user = await db.users.find_one({"email": email}, {"_id": 0, "demo_balance": 1, "real_balance": 1})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "demo_balance": user.get("demo_balance", 10000.0),
        "real_balance": user.get("real_balance", 0.0)
    }


@router.post("/deposit")
async def deposit(data: WalletTransaction, email: str = Depends(get_current_user_email)):
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    if data.amount > 100000:
        raise HTTPException(status_code=400, detail="Maximum deposit is $100,000")

    db = get_database()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_balance = user.get("demo_balance", 0) + data.amount
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"demo_balance": new_balance}}
    )

    txn = {
        "user_id": str(user["_id"]),
        "type": "deposit",
        "amount": data.amount,
        "method": data.method or "bank_transfer",
        "balance_after": new_balance,
        "status": "completed",
        "created_at": datetime.utcnow()
    }
    await db.wallet_transactions.insert_one(txn)

    return {
        "success": True,
        "message": f"Deposit of ${data.amount:.2f} completed",
        "new_balance": round(new_balance, 2)
    }


@router.post("/withdraw")
async def withdraw(data: WalletTransaction, email: str = Depends(get_current_user_email)):
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")

    db = get_database()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    current_balance = user.get("demo_balance", 0)
    if data.amount > current_balance:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    new_balance = current_balance - data.amount
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"demo_balance": new_balance}}
    )

    txn = {
        "user_id": str(user["_id"]),
        "type": "withdraw",
        "amount": data.amount,
        "method": data.method or "bank_transfer",
        "balance_after": new_balance,
        "status": "completed",
        "created_at": datetime.utcnow()
    }
    await db.wallet_transactions.insert_one(txn)

    return {
        "success": True,
        "message": f"Withdrawal of ${data.amount:.2f} completed",
        "new_balance": round(new_balance, 2)
    }


@router.get("/transactions")
async def get_transactions(
    limit: int = 50,
    email: str = Depends(get_current_user_email)
):
    db = get_database()
    user = await db.users.find_one({"email": email}, {"_id": 1})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    txns = await db.wallet_transactions.find(
        {"user_id": str(user["_id"])}
    ).sort("created_at", -1).limit(limit).to_list(limit)

    for txn in txns:
        txn["_id"] = str(txn["_id"])

    return {"transactions": txns}
