# backend/run_migration.py
"""
Run database migration for analytics tables
"""
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in environment variables")
    exit(1)

# Read migration file
with open('migrations/add_analytics_tables.sql', 'r') as f:
    migration_sql = f.read()

# Create engine and run migration
engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        # Execute migration
        conn.execute(text(migration_sql))
        conn.commit()
        print("✅ Migration completed successfully!")
        print("Created tables:")
        print("  - health_scores")
        print("  - treatment_plans")
        print("  - treatment_plan_items")
except Exception as e:
    print(f"❌ Migration failed: {e}")
    exit(1)
