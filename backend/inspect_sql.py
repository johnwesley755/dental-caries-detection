
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

def inspect():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    print("--- USERS ---")
    cur.execute("SELECT id, email, role, full_name FROM users")
    for row in cur.fetchall():
        print(row)
        
    print("\n--- CONVERSATIONS ---")
    cur.execute("SELECT id, patient_id, dentist_id, last_message_at FROM conversations")
    for row in cur.fetchall():
        print(row)
        
    print("\n--- MESSAGES ---")
    cur.execute("SELECT id, conversation_id, sender_id, receiver_id, content FROM messages")
    for row in cur.fetchall():
        print(row)
        
    cur.close()
    conn.close()

if __name__ == "__main__":
    inspect()
