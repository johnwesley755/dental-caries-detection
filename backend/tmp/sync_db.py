# backend/tmp/sync_db.py
import os
import sys
from sqlalchemy import text

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import engine

def sync_database():
    """Manual synchronization of the users table with the User model"""
    print("🔄 Starting database schema synchronization...")
    
    commands = [
        # 1. Add missing columns
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_otp VARCHAR(6);",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expiry TIMESTAMP WITH TIME ZONE;",
        
        # 2. Reset verification status for ALL users (Mandatory Enforcement)
        "UPDATE users SET is_email_verified = FALSE;",
        
        # 3. Ensure results directory exists (unrelated to DB but good for general health)
        "UPDATE users SET is_active = TRUE WHERE is_active IS NULL;"
    ]
    
    try:
        with engine.connect() as connection:
            for cmd in commands:
                print(f"Executing: {cmd}")
                connection.execute(text(cmd))
                connection.commit()
        print("✅ Database synchronization complete!")
    except Exception as e:
        print(f"❌ Error during sync: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    sync_database()
