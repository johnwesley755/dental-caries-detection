
import os
from dotenv import load_dotenv
from sqlalchemy import text
from app.core.database import SessionLocal, engine

def migrate():
    print("Starting email verification column migration...")
    try:
        try:
            print("Adding 'is_email_verified' column to 'users' table...")
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE users ADD COLUMN is_email_verified BOOLEAN DEFAULT FALSE"))
            print("Column added successfully.")
        except Exception as e:
            if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
                print("Column 'is_email_verified' already exists.")
            else:
                raise e

        # Set is_email_verified to True for all existing users
        print("Setting is_email_verified=True for all existing users...")
        db = SessionLocal()
        db.execute(text("UPDATE users SET is_email_verified = TRUE"))
        db.commit()
        db.close()
        
        print("Migration completed successfully.")
    except Exception as e:
        print(f"An error occurred during migration: {e}")

if __name__ == "__main__":
    migrate()
