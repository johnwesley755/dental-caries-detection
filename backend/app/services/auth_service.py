from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas.user import UserCreate
from ..core.security import get_password_hash, verify_password, create_access_token
from fastapi import HTTPException, status
from datetime import timedelta
from ..core.config import settings

class AuthService:
    @staticmethod
    def create_user(db: Session, user: UserCreate) -> User:
        """Create new user"""
        # Check if user exists
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user
        db_user = User(
            email=user.email,
            password_hash=get_password_hash(user.password),
            full_name=user.full_name,
            role=user.role
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        # If user is a patient, create a patient record
        if db_user.role == "PATIENT":
            from .patient_service import PatientService
            from ..schemas.patient import PatientCreate
            from .detection_service import DetectionService
            
            patient_data = PatientCreate(
                full_name=db_user.full_name,
                email=db_user.email
            )
            patient = PatientService.create_patient(db, patient_data, user_id=db_user.id)
            
            # If there's an anonymous detection to link
            if user.detection_id:
                DetectionService.link_detection_to_patient(db, user.detection_id, patient.id)
        
        # If user is a dentist, create a dentist profile
        elif db_user.role == "DENTIST" and user.profile:
            from ..models.dentist_profile import DentistProfile
            
            db_profile = DentistProfile(
                user_id=db_user.id,
                license_number=user.profile.license_number,
                specialization=user.profile.specialization,
                clinic_name=user.profile.clinic_name,
                clinic_address=user.profile.clinic_address
            )
            db.add(db_profile)
            db.commit()

        return db_user
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User:
        """Authenticate user"""
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user
    
    @staticmethod
    def create_access_token_for_user(user: User) -> str:
        """Create access token"""
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email},
            expires_delta=access_token_expires
        )
        return access_token
