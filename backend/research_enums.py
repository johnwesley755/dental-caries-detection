import asyncio
import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load env vars
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("DATABASE_URL not found")
    sys.exit(1)

# Ensure DATABASE_URL uses postgresql:// instead of postgres:// if needed
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

def research_enums():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        # Get all enums
        query = text("""
            SELECT t.typname, e.enumlabel 
            FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid 
            JOIN pg_namespace n ON n.oid = t.typnamespace 
            WHERE n.nspname = 'public' 
            ORDER BY t.typname, e.enumsortorder;
        """)
        result = connection.execute(query)
        
        enums = {}
        for row in result:
            typname, label = row
            if typname not in enums:
                enums[typname] = []
            enums[typname].append(label)
        
        for typname, labels in enums.items():
            print(f"Enum: {typname}")
            for label in labels:
                print(f"  - {label}")
            print()

if __name__ == "__main__":
    research_enums()
