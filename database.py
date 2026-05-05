"""
Centralized MongoDB connection module.
Properly handles both local MongoDB and Atlas connections.
"""
from motor.motor_asyncio import AsyncIOMotorClient
from urllib.parse import urlparse
import os

# Global database client
_client = None
_db = None

def get_database():
    """
    Get database connection.
    - Extracts database name from MONGO_URL path (for Atlas connections)
    - Falls back to DB_NAME env variable if not in URL
    - Creates a single client instance for connection pooling
    """
    global _client, _db
    
    if _db is not None:
        return _db
    
    mongo_url = os.environ.get('MONGO_URL')
    if not mongo_url:
        raise ValueError("MONGO_URL environment variable is not set")
    
    # Parse the MONGO_URL to extract database name
    parsed = urlparse(mongo_url)
    
    # Extract database name from URL path (e.g., /optixroyal_db or /mydb?options)
    url_db_name = None
    if parsed.path and parsed.path != '/':
        url_db_name = parsed.path.lstrip('/').split('?')[0]
        if url_db_name:
            url_db_name = url_db_name.strip()
    
    # Priority: URL path > DB_NAME env > default
    db_name = url_db_name or os.environ.get('DB_NAME') or 'optixroyal_db'
    
    # Create client with proper settings for both local and Atlas
    _client = AsyncIOMotorClient(
        mongo_url,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=10000,
    )
    _db = _client[db_name]
    
    return _db

def close_database():
    """Close database connection"""
    global _client, _db
    if _client:
        _client.close()
        _client = None
        _db = None
