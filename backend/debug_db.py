
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def check():
    conn = psycopg2.connect("postgresql://postgres:G2q2hxzc$27@localhost:5432/dental-caries")
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    # Check for duplicate conversations
    cur.execute("SELECT patient_id, dentist_id, COUNT(*) FROM conversations GROUP BY patient_id, dentist_id HAVING COUNT(*) > 1;")
    dups = cur.fetchall()
    print(f"Duplicate conversations: {dups}")
    
    # Check for messages without conversation or with wrong IDs
    cur.execute("SELECT id, conversation_id, sender_id, receiver_id FROM messages LIMIT 10;")
    msgs = cur.fetchall()
    print(f"Sample messages: {msgs}")
    
    # Check conversation count for Revathi
    cur.execute("SELECT id, patient_id, dentist_id FROM conversations WHERE patient_id = '9ed7ce07-6fcc-43c3-8e12-c218cee68cb5' OR dentist_id = '9ed7ce07-6fcc-43c3-8e12-c218cee68cb5';")
    revathi_convs = cur.fetchall()
    print(f"Revathi (Patient) conversations: {revathi_convs}")

    cur.close()
    conn.close()

if __name__ == "__main__":
    check()
