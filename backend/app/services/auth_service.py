from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas.user import UserCreate
from ..core.security import get_password_hash, verify_password, create_access_token
from fastapi import HTTPException, status
from datetime import datetime, timedelta, timezone
from typing import Optional
from ..core.config import settings
from .email_service import EmailService
from .image_service import ImageService
from fastapi import UploadFile
from ..models.user import UserRole
from ..utils.notifications import notify_user, NotificationType
import logging
import random
import string

logger = logging.getLogger(__name__)

class AuthService:
    @staticmethod
    def generate_otp(length: int = 6) -> str:
        """Generate a random 6-digit OTP"""
        return ''.join(random.choices(string.digits, k=length))

    @staticmethod
    async def create_user(
        db: Session, 
        user: UserCreate, 
        license_file: Optional[UploadFile] = None,
        profile_image: Optional[UploadFile] = None
    ) -> User:
        """Create new user"""
        # Check if user exists
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Generate OTP for email verification
        otp = AuthService.generate_otp()
        otp_expiry = datetime.now(timezone.utc) + timedelta(minutes=10)

        # Create user
        db_user = User(
            email=user.email,
            password_hash=get_password_hash(user.password),
            full_name=user.full_name,
            role=user.role,
            is_active=True,
            is_verified=False if user.role == UserRole.DENTIST else True,
            is_email_verified=False,
            verification_otp=otp,
            otp_expiry=otp_expiry
        )
        db.add(db_user)
        db.flush() # Get ID

        # If user is a patient, create a patient record
        if db_user.role == UserRole.PATIENT:
            from .patient_service import PatientService
            from ..schemas.patient import PatientCreate
            from .detection_service import DetectionService
            
            patient_data = PatientCreate(
                full_name=db_user.full_name,
                email=db_user.email
            )
            # For self-registration, creator_id is the user's own id
            patient = PatientService.create_patient(db, patient_data, user_id=db_user.id, creator_id=db_user.id)
            
            # If there's an anonymous detection to link
            if user.detection_id:
                DetectionService.link_detection_to_patient(db, user.detection_id, patient.id)
        
        # If user is a dentist, create a dentist profile
        elif db_user.role == UserRole.DENTIST:
            from ..models.dentist_profile import DentistProfile
            
            # Handle license file upload
            document_url = None
            if license_file:
                image_service = ImageService()
                upload_res = await image_service.save_upload_file(
                    license_file, 
                    folder="dentoai/verification",
                    upload_to_cloudinary=True
                )
                document_url = upload_res.get("cloudinary_url") or upload_res.get("local_url")

            # Handle profile image upload
            profile_pic_url = None
            if profile_image:
                image_service = ImageService()
                upload_res = await image_service.save_upload_file(
                    profile_image,
                    folder="dentoai/profiles",
                    upload_to_cloudinary=True
                )
                profile_pic_url = upload_res.get("cloudinary_url") or upload_res.get("local_url")

            profile_data = user.profile or {}
            db_profile = DentistProfile(
                user_id=db_user.id,
                license_number=getattr(profile_data, 'license_number', 'PENDING'),
                specialization=getattr(profile_data, 'specialization', None),
                clinic_name=getattr(profile_data, 'clinic_name', None),
                clinic_address=getattr(profile_data, 'clinic_address', None),
                phone_number=getattr(profile_data, 'phone_number', None),
                years_of_experience=getattr(profile_data, 'years_of_experience', None),
                verification_documents_url=document_url,
                profile_image_url=profile_pic_url,
                verification_status="PENDING"
            )
            db.add(db_profile)
            
            # Notify Admins about new registration
            admins = db.query(User).filter(User.role == UserRole.ADMIN).all()
            verification_url = f"{settings.FRONTEND_URL}/admin/verification"
            
            for admin in admins:
                # 1. Bell Notification
                notify_user(
                    db=db,
                    user_id=str(admin.id),
                    title="New Dentist Registration",
                    message=f"{db_user.full_name} has registered and requires credential verification.",
                    notification_type=NotificationType.SYSTEM,
                    related_id=str(db_user.id),
                    related_type="dentist_verification"
                )
                
                # 2. Email Notification
                EmailService.send_admin_verification_request(
                    admin_email=admin.email,
                    dentist_name=db_user.full_name,
                    dentist_email=db_user.email,
                    license_number=db_profile.license_number,
                    verification_url=verification_url
                )

        db.commit()
        db.refresh(db_user)

        # Post-commit tasks: Wrap in try-except to ensure registration success even if email/notification fails
        try:
            # Send verification email with OTP code instead of token link
            EmailService.send_verification_email(
                email=db_user.email,
                full_name=db_user.full_name,
                otp=otp,
                role=db_user.role
            )
        except Exception as e:
            # Log the error but don't fail the registration
            logger.warning(f"Registration successful for {db_user.email} but failed to send verification email: {str(e)}")
            print(f"⚠️ Warning: Registration successful for {db_user.email} but failed to send verification email: {str(e)}")

        return db_user
    
    @staticmethod
    def verify_otp(db: Session, email: str, otp: str) -> bool:
        """Verify user's email using OTP code"""
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        if not user.verification_otp or user.verification_otp != otp:
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification code"
            )

        # Check expiry
        now = datetime.now(timezone.utc)
        if user.otp_expiry and user.otp_expiry.replace(tzinfo=timezone.utc) < now:
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Verification code has expired"
            )

        # Successful verification
        user.is_email_verified = True
        user.verification_otp = None # Clear OTP
        user.otp_expiry = None
        db.commit()
        return True

    @staticmethod
    def verify_email(db: Session, token: str) -> bool:
        """Verify user's email using a token/code (Legacy/URL support)"""
        user = db.query(User).filter(User.verification_otp == token).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired verification token"
            )

        # Check expiry
        now = datetime.now(timezone.utc)
        if user.otp_expiry and user.otp_expiry.replace(tzinfo=timezone.utc) < now:
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Verification token has expired"
            )

        # Successful verification
        user.is_email_verified = True
        user.verification_otp = None
        user.otp_expiry = None
        db.commit()
        return True

    @staticmethod
    def resend_otp(db: Session, email: str) -> bool:
        """Resend verification OTP to user"""
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Generate new OTP
        otp = AuthService.generate_otp()
        otp_expiry = datetime.now(timezone.utc) + timedelta(minutes=10)

        user.verification_otp = otp
        user.otp_expiry = otp_expiry
        db.commit()

        # Send email
        try:
            EmailService.send_verification_email(
                email=user.email,
                full_name=user.full_name,
                otp=otp,
                role=user.role
            )
            return True
        except Exception as e:
            logger.error(f"Failed to resend OTP to {email}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send verification email. Please try again later."
            )

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User:
        """Authenticate user and enforce email verification"""
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Enforce email verification (Mandatory for all users)
        if not user.is_email_verified:
            # Automatically trigger a fresh OTP on a failed login due to verification
            try:
                AuthService.resend_otp(db, email)
                logger.info(f"Unverified login attempt for {email}. Fresh OTP triggered.")
            except Exception as e:
                logger.error(f"Failed to auto-resend OTP for {email}: {str(e)}")
            
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Email not verified"
            )
            
        # --- SELF-HEALING PROFILE RECOVERY ---
        # Ensure every user has their required specialized profile
        if user.role == UserRole.PATIENT:
            from .patient_service import PatientService
            from ..models.patient import Patient
            from ..schemas.patient import PatientCreate
            
            patient_exists = db.query(Patient).filter(Patient.user_id == user.id).first()
            if not patient_exists:
                logger.warning(f"Auto-recovering missing Patient profile for user {user.email}")
                patient_data = PatientCreate(
                    full_name=user.full_name,
                    email=user.email
                )
                PatientService.create_patient(db, patient_data, user_id=user.id, creator_id=user.id)
                db.commit()

        elif user.role == UserRole.DENTIST:
            from ..models.dentist_profile import DentistProfile
            
            profile_exists = db.query(DentistProfile).filter(DentistProfile.user_id == user.id).first()
            if not profile_exists:
                logger.warning(f"Auto-recovering missing DentistProfile for user {user.email}")
                db_profile = DentistProfile(
                    user_id=user.id,
                    license_number=f"PENDING-AUTH-RECOVERY-{user.id.hex[:8].upper()}",
                    verification_status="PENDING"
                )
                db.add(db_profile)
                db.commit()

        return user
    
    @staticmethod
    def create_access_token_for_user(user: User, expires_delta: Optional[timedelta] = None) -> str:
        """Create access token"""
        if not expires_delta:
            expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        access_token = create_access_token(
            data={"sub": user.email},
            expires_delta=expires_delta
        )
        return access_token

    @staticmethod
    def initiate_password_reset(db: Session, email: str, role: str) -> bool:
        """Initiate password reset process"""
        user = db.query(User).filter(User.email == email, User.role == role).first()
        if not user:
            # We return True even if user not found for security (prevent email enumeration)
            return True
            
        reset_token = AuthService.create_access_token_for_user(user, expires_delta=timedelta(hours=1))
        EmailService.send_password_reset_email(
            email=user.email,
            full_name=user.full_name,
            token=reset_token,
            role=user.role
        )
        return True

    @staticmethod
    def complete_password_reset(db: Session, token: str, new_password: str) -> bool:
        """Complete password reset using token"""
        from ..core.security import decode_access_token, get_password_hash
        
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )
            
        email = payload.get("sub")
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
            
        user.password_hash = get_password_hash(new_password)
        db.commit()
        return True
