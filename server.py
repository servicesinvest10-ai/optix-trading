from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import routes
from routes import auth, markets, trading, admin, mt5, wallet

app = FastAPI(
    title="Optix Royal API",
    description="API for Optix Royal Elite Trading Platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(markets.router)
app.include_router(trading.router)
app.include_router(admin.router)
app.include_router(mt5.router)
app.include_router(wallet.router)

@app.get("/api/")
async def root():
    return {"message": "Welcome to Optix Royal API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "optixroyal-api"}

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)
