
import os
from dotenv import load_dotenv
from sqlalchemy import text
from app.core.database import SessionLocal, engine

def verify():
    print("Starting verification process...")
    try:
        db = SessionLocal()
        print("Database session created.")
        
        # Check for dentists
        query = text("SELECT id, email, full_name, is_verified, is_active FROM users WHERE role = 'DENTIST'")
        result = db.execute(query)
        dentists = result.fetchall()
        
        print(f"Found {len(dentists)} dentists.")
        for d in dentists:
            print(f"Dentist: {d.email} (Verified: {d.is_verified}, Active: {d.is_active})")
            
        if dentists:
            print("Verifying all dentists...")
            update_query = text("UPDATE users SET is_verified = TRUE, is_active = TRUE WHERE role = 'DENTIST'")
            db.execute(update_query)
            db.commit()
            print("Verification successful.")
        else:
            print("No dentists found to verify.")
            
        db.close()
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    verify()
