import os
import subprocess
from app.core.database import Base, engine
from app.models import (
    User, UserRole, DentistProfile, Patient, Detection, CariesFinding, DetectionHistory, 
    Appointment, Notification, HealthScore, TreatmentPlan, TreatmentPlanItem, Resource, 
    Conversation, Message, ChatMessage
)

local_db_url = "postgresql://postgres@localhost:5432/dental-caries"
neon_db_url = "postgresql://neondb_owner:npg_P0LSRcwUetV5@ep-orange-term-ah7lzul9-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

print("1. Creating native tables using SQLAlchemy (Bulletproof Schema Creation)...")
try:
    Base.metadata.create_all(bind=engine)
    print("Empty Schema created successfully!")
except Exception as e:
    print(f"Schema creation failed: {e}")
    exit(1)

print("\n2. Dumping DATA ONLY from Neon DB using individual INSERT statements...")
dump_command = [
    "pg_dump",
    neon_db_url,
    "--data-only",
    "--inserts",
    "--column-inserts",
    "--on-conflict-do-nothing",
    "-f",
    "neon_data_only.sql"
]

try:
    subprocess.run(dump_command, check=True)
    print("Data dump successful!")
except subprocess.CalledProcessError as e:
    print(f"Failed to dump database: {e}")
    exit(1)

print("\n3. Injecting data into local PostgreSQL...")
env = os.environ.copy()
# env["PGPASSWORD"] = "dental@123" # assuming local trust auth or no password

restore_command = [
    "psql",
    "-h", "localhost",
    "-p", "5432",
    "-U", "postgres",
    "-d", "dental-caries",
    "-f", "neon_data_only.sql"
]

try:
    subprocess.run(restore_command, check=True, env=env)
    print("\n✅ Restore completely successful! All tables and data are fully migrated.")
except subprocess.CalledProcessError as e:
    print(f"Failed to restore database: {e}")
    exit(1)
