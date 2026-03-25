from app.core.database import Base, engine
# Importing all models to ensure they are registered with Base.metadata before creating tables
from app.models import (
    User, UserRole, DentistProfile, Patient, Detection, CariesFinding, DetectionHistory, 
    Appointment, Notification, HealthScore, TreatmentPlan, TreatmentPlanItem, Resource, 
    Conversation, Message, ChatMessage
)

def init_db():
    print("Connecting to local database and creating tables...")
    try:
        # Create all tables found in the models directory
        Base.metadata.create_all(bind=engine)
        print("Success! All tables have been successfully created in the local database.")
    except Exception as e:
        print(f"Error creating tables: {e}")

if __name__ == "__main__":
    init_db()
