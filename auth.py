from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
from database import get_database
from models.user import UserCreate, UserLogin, User, Token
from utils.auth import get_password_hash, verify_password, create_access_token, get_current_user_email

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user"""
    db = get_database()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user_dict = {
        "email": user_data.email,
        "full_name": user_data.full_name,
        "phone": user_data.phone,
        "password_hash": get_password_hash(user_data.password),
        "created_at": datetime.utcnow(),
        "is_active": True,
        "demo_balance": 10000.0,
        "real_balance": 0.0
    }
    
    result = await db.users.insert_one(user_dict)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_data.email})
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login user and return access token"""
    db = get_database()
    
    # Find user
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": credentials.email})
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def get_current_user(email: str = Depends(get_current_user_email)):
    """Get current user profile"""
    db = get_database()
    
    user = await db.users.find_one({"email": email}, {"password_hash": 0})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Convert ObjectId to string for serialization
    if "_id" in user:
        user["_id"] = str(user["_id"])
    
    return user
