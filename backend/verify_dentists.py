
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

def verify():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        print("Checking for dentists...")
        cur.execute("SELECT id, email, full_name, is_verified, is_active FROM users WHERE role = 'DENTIST'")
        dentists = cur.fetchall()
        
        if not dentists:
            print("No dentists found in the database.")
            return

        print(f"Found {len(dentists)} dentists.")
        for d in dentists:
            print(f"Dentist: {d[1]} (Verified: {d[3]}, Active: {d[4]})")

        # Verify all dentists for testing purposes
        print("Verifying all dentists...")
        cur.execute("UPDATE users SET is_verified = TRUE, is_active = TRUE WHERE role = 'DENTIST'")
        conn.commit()
        print("All dentists have been verified and activated.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify()
