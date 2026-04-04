from app.core.database import engine
from sqlalchemy import text

def run_migration():
    with engine.connect() as conn:
        try:
            # Try to add to enum 'appointmentstatus'
            conn.execute(text("ALTER TYPE appointmentstatus ADD VALUE IF NOT EXISTS 'pending_approval'"))
            conn.commit()
            print("Successfully added pending_approval to appointmentstatus form")
        except Exception as e:
            conn.rollback() # Rollback on error
            print(f"Could not update appointmentstatus enum: {e}")
            
        try:
            # Try to add the new column
            conn.execute(text("ALTER TABLE appointments ADD COLUMN IF NOT EXISTS detection_id UUID REFERENCES detections(id)"))
            conn.commit()
            print("Successfully added detection_id to appointments")
        except Exception as e:
            conn.rollback()
            print(f"Could not add detection_id column: {e}")

if __name__ == "__main__":
    run_migration()
