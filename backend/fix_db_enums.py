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

def fix_enums():
    # Use isolation level AUTOCOMMIT for ALTER TYPE ADD VALUE
    engine = create_engine(DATABASE_URL, isolation_level="AUTOCOMMIT")
    
    # Map of enums and the values we want to ensure exist
    enum_updates = {
        "imagetype": ["INTRAORAL", "BITEWING", "PERIAPICAL", "PANORAMIC", "intraoral", "bitewing", "periapical", "panoramic"],
        "severity": ["MILD", "MODERATE", "SEVERE", "mild", "moderate", "severe"],
        "detectionstatus": ["PENDING", "COMPLETED", "REVIEWED", "pending", "completed", "reviewed"],
        "cariestype": ["ENAMEL", "DENTIN", "PULP", "CARIES", "CAVITY", "CRACK", "enamel", "dentin", "pulp", "caries", "cavity", "crack"],
        "appointmentstatus": ["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW", "scheduled", "confirmed", "completed", "cancelled", "no_show"],
        "notificationtype": ["DETECTION", "APPOINTMENT", "REPORT", "SYSTEM", "REMINDER", "detection", "appointment", "report", "system", "reminder"],
        "userrole": ["DENTIST", "ADMIN", "ASSISTANT", "PATIENT", "dentist", "admin", "assistant", "patient"]
    }
    
    with engine.connect() as connection:
        for enum_name, values in enum_updates.items():
            print(f"Checking enum: {enum_name}")
            for val in values:
                try:
                    # Postgres 12+ supports IF NOT EXISTS for ADD VALUE
                    connection.execute(text(f"ALTER TYPE {enum_name} ADD VALUE IF NOT EXISTS '{val}'"))
                    print(f"  Ensured '{val}' in {enum_name}")
                except Exception as e:
                    if "already exists" in str(e).lower():
                        print(f"  '{val}' already exists in {enum_name}")
                    else:
                        print(f"  Error adding '{val}' to {enum_name}: {e}")

if __name__ == "__main__":
    fix_enums()
