from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from database import get_database
from utils.auth import get_current_user_email
import os

router = APIRouter(prefix="/api/admin", tags=["Admin CRM"])

# ============== Pydantic Models ==============

class LeadCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    country: Optional[str] = None
    source: Optional[str] = "website"

class LeadUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None

class NoteCreate(BaseModel):
    note_text: str

class Lead(BaseModel):
    id: Optional[str] = None
    full_name: str
    email: str
    phone: Optional[str] = None
    country: Optional[str] = None
    status: str = "new"
    source: str = "website"
    assigned_to: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

class DashboardStats(BaseModel):
    total_clients: int
    active_clients: int
    new_leads: int
    total_demo_balance: float
    total_trades: int
    pending_kyc: int

# ============== Helper Functions ==============

async def check_admin(email: str):
    """Check if user is admin"""
    db = get_database()
    user = await db.users.find_one({"email": email})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ============== Dashboard ==============

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(email: str = Depends(get_current_user_email)):
    """Get CRM dashboard statistics"""
    await check_admin(email)
    db = get_database()
    
    # Get counts
    total_clients = await db.users.count_documents({"role": {"$ne": "admin"}})
    active_clients = await db.users.count_documents({"role": {"$ne": "admin"}, "is_active": True})
    new_leads = await db.leads.count_documents({"status": "new"})
    pending_kyc = await db.users.count_documents({"kyc_status": "pending"})
    
    # Calculate totals
    pipeline = [
        {"$match": {"role": {"$ne": "admin"}}},
        {"$group": {"_id": None, "total": {"$sum": "$demo_balance"}}}
    ]
    balance_result = await db.users.aggregate(pipeline).to_list(1)
    total_demo_balance = balance_result[0]["total"] if balance_result else 0
    
    total_trades = await db.orders.count_documents({})
    
    return DashboardStats(
        total_clients=total_clients,
        active_clients=active_clients,
        new_leads=new_leads,
        total_demo_balance=total_demo_balance,
        total_trades=total_trades,
        pending_kyc=pending_kyc
    )

# ============== Clients Management ==============

@router.get("/clients")
async def get_all_clients(
    status: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    skip: int = 0,
    email: str = Depends(get_current_user_email)
):
    """Get all clients with optional filtering"""
    await check_admin(email)
    db = get_database()
    
    # Build query
    query = {"role": {"$ne": "admin"}}
    if status:
        query["status"] = status
    if search:
        query["$or"] = [
            {"email": {"$regex": search, "$options": "i"}},
            {"full_name": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}}
        ]
    
    # Get clients
    clients = await db.users.find(
        query, 
        {"password_hash": 0}
    ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    # Convert ObjectId to string
    for client in clients:
        client["_id"] = str(client["_id"])
    
    # Get total count
    total = await db.users.count_documents(query)
    
    return {"clients": clients, "total": total}

@router.get("/clients/{client_id}")
async def get_client_detail(client_id: str, email: str = Depends(get_current_user_email)):
    """Get detailed client information"""
    await check_admin(email)
    db = get_database()
    
    from bson import ObjectId
    
    client = await db.users.find_one({"_id": ObjectId(client_id)}, {"password_hash": 0})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    client["_id"] = str(client["_id"])
    
    # Get client's positions
    positions = await db.positions.find({"user_id": client_id}).to_list(100)
    for pos in positions:
        pos["_id"] = str(pos["_id"])
    
    # Get client's orders
    orders = await db.orders.find({"user_id": client_id}).sort("created_at", -1).limit(20).to_list(20)
    for order in orders:
        order["_id"] = str(order["_id"])
    
    # Get notes about client
    notes = await db.client_notes.find({"client_id": client_id}).sort("created_at", -1).to_list(50)
    for note in notes:
        note["_id"] = str(note["_id"])
    
    return {
        "client": client,
        "positions": positions,
        "orders": orders,
        "notes": notes
    }

@router.put("/clients/{client_id}/status")
async def update_client_status(
    client_id: str, 
    status: str,
    email: str = Depends(get_current_user_email)
):
    """Update client status"""
    await check_admin(email)
    db = get_database()
    
    from bson import ObjectId
    
    valid_statuses = ["active", "inactive", "suspended", "pending_kyc", "verified"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    result = await db.users.update_one(
        {"_id": ObjectId(client_id)},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    
    return {"message": "Status updated successfully"}

@router.post("/clients/{client_id}/notes")
async def add_client_note(
    client_id: str, 
    note: NoteCreate,
    email: str = Depends(get_current_user_email)
):
    """Add a note to a client"""
    admin = await check_admin(email)
    db = get_database()
    
    note_doc = {
        "client_id": client_id,
        "admin_id": str(admin["_id"]),
        "admin_name": admin.get("full_name", email),
        "note_text": note.note_text,
        "created_at": datetime.utcnow()
    }
    
    result = await db.client_notes.insert_one(note_doc)
    note_doc["_id"] = str(result.inserted_id)
    
    return note_doc

@router.put("/clients/{client_id}/balance")
async def adjust_client_balance(
    client_id: str,
    amount: float,
    balance_type: str = "demo",
    email: str = Depends(get_current_user_email)
):
    """Adjust client balance (add or subtract)"""
    await check_admin(email)
    db = get_database()
    
    from bson import ObjectId
    
    if balance_type not in ["demo", "real"]:
        raise HTTPException(status_code=400, detail="balance_type must be 'demo' or 'real'")
    
    field = f"{balance_type}_balance"
    
    result = await db.users.update_one(
        {"_id": ObjectId(client_id)},
        {"$inc": {field: amount}, "$set": {"updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    
    return {"message": f"Balance adjusted by {amount}"}

# ============== Leads Management ==============

@router.get("/leads")
async def get_all_leads(
    status: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    skip: int = 0,
    email: str = Depends(get_current_user_email)
):
    """Get all leads with optional filtering"""
    await check_admin(email)
    db = get_database()
    
    query = {}
    if status:
        query["status"] = status
    if search:
        query["$or"] = [
            {"email": {"$regex": search, "$options": "i"}},
            {"full_name": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}}
        ]
    
    leads = await db.leads.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    for lead in leads:
        lead["_id"] = str(lead["_id"])
    
    total = await db.leads.count_documents(query)
    
    return {"leads": leads, "total": total}

@router.post("/leads")
async def create_lead(lead: LeadCreate, email: str = Depends(get_current_user_email)):
    """Create a new lead"""
    await check_admin(email)
    db = get_database()
    
    # Check if lead already exists
    existing = await db.leads.find_one({"email": lead.email})
    if existing:
        raise HTTPException(status_code=400, detail="Lead with this email already exists")
    
    lead_doc = {
        **lead.dict(),
        "status": "new",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.leads.insert_one(lead_doc)
    lead_doc["_id"] = str(result.inserted_id)
    
    return lead_doc

@router.put("/leads/{lead_id}")
async def update_lead(
    lead_id: str,
    update: LeadUpdate,
    email: str = Depends(get_current_user_email)
):
    """Update lead information"""
    await check_admin(email)
    db = get_database()
    
    from bson import ObjectId
    
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.leads.update_one(
        {"_id": ObjectId(lead_id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    return {"message": "Lead updated successfully"}

@router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str, email: str = Depends(get_current_user_email)):
    """Delete a lead"""
    await check_admin(email)
    db = get_database()
    
    from bson import ObjectId
    
    result = await db.leads.delete_one({"_id": ObjectId(lead_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    return {"message": "Lead deleted successfully"}

@router.post("/leads/{lead_id}/convert")
async def convert_lead_to_client(lead_id: str, email: str = Depends(get_current_user_email)):
    """Convert a lead to a client account"""
    await check_admin(email)
    db = get_database()
    
    from bson import ObjectId
    import secrets
    from utils.auth import get_password_hash
    
    lead = await db.leads.find_one({"_id": ObjectId(lead_id)})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    # Check if user already exists
    existing = await db.users.find_one({"email": lead["email"]})
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    # Generate temporary password
    temp_password = secrets.token_urlsafe(8)
    
    # Create user account
    user_doc = {
        "email": lead["email"],
        "full_name": lead["full_name"],
        "phone": lead.get("phone"),
        "country": lead.get("country"),
        "password_hash": get_password_hash(temp_password),
        "role": "user",
        "status": "active",
        "demo_balance": 10000.0,
        "real_balance": 0.0,
        "is_active": True,
        "kyc_status": "pending",
        "created_at": datetime.utcnow(),
        "converted_from_lead": True,
        "lead_source": lead.get("source")
    }
    
    result = await db.users.insert_one(user_doc)
    
    # Update lead status
    await db.leads.update_one(
        {"_id": ObjectId(lead_id)},
        {"$set": {"status": "converted", "converted_at": datetime.utcnow()}}
    )
    
    return {
        "message": "Lead converted to client successfully",
        "client_id": str(result.inserted_id),
        "temp_password": temp_password,
        "email": lead["email"]
    }

# ============== Transactions History ==============

@router.get("/transactions")
async def get_all_transactions(
    limit: int = 100,
    skip: int = 0,
    email: str = Depends(get_current_user_email)
):
    """Get all platform transactions"""
    await check_admin(email)
    db = get_database()
    
    from bson import ObjectId
    
    orders = await db.orders.find({}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    # Collect unique user_ids for batch lookup
    user_ids = set()
    for order in orders:
        uid = order.get("user_id")
        if uid:
            user_ids.add(uid)
    
    # Batch fetch users
    user_map = {}
    if user_ids:
        object_ids = []
        for uid in user_ids:
            try:
                object_ids.append(ObjectId(uid))
            except Exception:
                pass
        if object_ids:
            users = await db.users.find(
                {"_id": {"$in": object_ids}},
                {"email": 1, "full_name": 1}
            ).to_list(len(object_ids))
            for u in users:
                user_map[str(u["_id"])] = u
    
    # Enrich with user info
    for order in orders:
        order["_id"] = str(order["_id"])
        user = user_map.get(order.get("user_id"))
        if user:
            order["user_email"] = user.get("email")
            order["user_name"] = user.get("full_name")
    
    total = await db.orders.count_documents({})
    
    return {"transactions": orders, "total": total}
