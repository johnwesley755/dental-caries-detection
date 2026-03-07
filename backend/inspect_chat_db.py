
import os
import uuid
from sqlalchemy import create_url
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, select
from dotenv import load_dotenv

# Import models
import sys
sys.path.append(os.getcwd())
from app.models.user import User
from app.models.conversation import Conversation
from app.models.message import Message

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def inspect_db():
    print("--- Users ---")
    users = db.query(User).all()
    for u in users:
        print(f"ID: {u.id}, Email: {u.email}, Role: {u.role.value}, Name: {u.full_name}")

    print("\n--- Conversations ---")
    convs = db.query(Conversation).all()
    for c in convs:
        print(f"ID: {c.id}, PatientID: {c.patient_id}, DentistID: {c.dentist_id}, LastMessageAt: {c.last_message_at}")

    print("\n--- Messages ---")
    msgs = db.query(Message).all()
    for m in msgs:
        print(f"ID: {m.id}, ConvID: {m.conversation_id}, Sender: {m.sender_id}, Recipient: {m.receiver_id}, Content: {m.content}")

if __name__ == "__main__":
    inspect_db()
