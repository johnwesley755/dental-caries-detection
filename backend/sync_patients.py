from app.core.database import SessionLocal
from app.models.user import User, UserRole
from app.models.patient import Patient
from app.services.patient_service import PatientService
from uuid import UUID

def sync_patients():
    db = SessionLocal()
    try:
        # Get admin user as default creator
        admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
        creator_id = admin.id if admin else None
        
        if not creator_id:
            # Fallback to first dentist
            dentist = db.query(User).filter(User.role == UserRole.DENTIST).first()
            creator_id = dentist.id if dentist else None

        # Get all users with PATIENT role
        patient_users = db.query(User).filter(User.role == UserRole.PATIENT).all()
        print(f"Found {len(patient_users)} patient users in 'users' table.")

        for user in patient_users:
            # Check if they already have an entry in patients table
            exists = db.query(Patient).filter(Patient.user_id == user.id).first()
            if not exists:
                class MockPatientCreate:
                    def __init__(self, full_name, email):
                        self.full_name = full_name
                        self.email = email
                        self.age = 0
                        self.gender = "other"
                        self.contact_number = ""
                        self.address = ""
                        self.medical_history = {}

                patient_data = MockPatientCreate(user.full_name, user.email)
                
                PatientService.create_patient(
                    db, 
                    patient=patient_data,
                    user_id=user.id,
                    creator_id=creator_id
                )
                print(f"✅ Sync: Created clinical record for {user.full_name}")
            else:
                # Update existing records that might have null created_by from previous run
                if exists.created_by is None and creator_id:
                    exists.created_by = creator_id
                    print(f"🔧 Update: Fixed missing creator for {user.full_name}")
                else:
                    print(f"ℹ️ {user.full_name} already exists in patients table.")

        db.commit()
    except Exception as e:
        print(f"❌ Error during sync: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    sync_patients()
