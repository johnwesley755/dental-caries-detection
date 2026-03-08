from app.core.database import SessionLocal
from app.models.user import User, UserRole
from app.models.chat import ChatMessage
from app.models.dentist_profile import DentistProfile

def test():
    db = SessionLocal()
    admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
    if admin:
        print(f"Admin found: {admin.email}")
        print(f"Admin profile: {admin.profile}")
        print(f"Admin type of profile: {type(admin.profile)}")
    else:
        print("No admin found")

if __name__ == "__main__":
    test()
