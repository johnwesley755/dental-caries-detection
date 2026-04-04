import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from sqlalchemy import text
from app.core.database import SessionLocal

def apply_fixes():
    db = SessionLocal()
    try:
        print("Checking and applying database fixes for dentist_profiles...")
        
        # Add columns to dentist_profiles if they don't exist
        columns = [
            ("verification_status", "VARCHAR(20) DEFAULT 'PENDING'"),
            ("rejection_reason", "TEXT"),
            ("verified_at", "TIMESTAMP"),
            ("verified_by_id", "UUID REFERENCES users(id) ON DELETE SET NULL"),
            ("phone_number", "VARCHAR(50)"),
            ("years_of_experience", "VARCHAR(20)"),
            ("profile_image_url", "TEXT")
        ]
        
        for col_name, col_def in columns:
            try:
                # IF NOT EXISTS is supported in PostgreSQL ALTER TABLE ADD COLUMN
                db.execute(text(f"ALTER TABLE dentist_profiles ADD COLUMN IF NOT EXISTS {col_name} {col_def}"))
                print(f"  Processed column: {col_name}")
            except Exception as e:
                print(f"  Error adding {col_name}: {e}")
        
        db.commit()
        print("Database fixes applied successfully.")
    except Exception as e:
        print(f"Fatal error during DB fixes: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    apply_fixes()
