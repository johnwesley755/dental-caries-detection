# Admin API endpoints for user management
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ...core.database import get_db
from ...dependencies.auth import get_current_user
from ...models.user import User, UserRole
from ...models.patient import Patient
from ...core.security import get_password_hash
from ...services.email_service import EmailService
from ...schemas.user import UserResponse, UserCreate
from ...schemas.patient import PatientCreate, PatientResponse
from pydantic import BaseModel, EmailStr

router = APIRouter(tags=["admin"])

# Schemas
class CreateUserRequest(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole
    send_email: bool = True

class CreatePatientWithAccountRequest(BaseModel):
    # Patient info
    full_name: str
    age: int | None = None
    gender: str | None = None
    contact_number: str | None = None
    email: EmailStr
    address: str | None = None
    medical_history: str | None = None
    # Account options
    create_account: bool = True
    send_email: bool = True

class UserWithPasswordResponse(BaseModel):
    user: UserResponse
    password: str | None = None

def require_admin(current_user: User = Depends(get_current_user)):
    """Dependency to require admin role"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

@router.post("/users", response_model=UserWithPasswordResponse)
async def create_user(
    request: CreateUserRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a new user (dentist/patient) - Admin only"""
    
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Generate password
    password = EmailService.generate_password()
    password_hash = get_password_hash(password)
    
    # Create user
    new_user = User(
        email=request.email,
        password_hash=password_hash,
        full_name=request.full_name,
        role=request.role,
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Send email with credentials
    if request.send_email:
        from ...core.config import settings
        EmailService.send_user_credentials(
            email=request.email,
            password=password,
            full_name=request.full_name,
            role=request.role.value,
            portal_url=settings.PORTAL_URL
        )
    
    return {
        "user": new_user,
        "password": password if not request.send_email else None
    }

@router.post("/patients", response_model=dict)
async def create_patient_with_account(
    request: CreatePatientWithAccountRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a patient record and optionally a user account - Admin only"""
    
    user_id = None
    password = None
    
    # Create user account if requested
    if request.create_account:
        # Check if email already exists
        existing_user = db.query(User).filter(User.email == request.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Generate password
        password = EmailService.generate_password()
        password_hash = get_password_hash(password)
        
        # Create user
        new_user = User(
            email=request.email,
            password_hash=password_hash,
            full_name=request.full_name,
            role=UserRole.PATIENT,
            is_active=True
        )
        
        db.add(new_user)
        db.flush()  # Get user ID without committing
        user_id = new_user.id
    
    # Generate patient ID
    last_patient = db.query(Patient).order_by(Patient.created_at.desc()).first()
    if last_patient and last_patient.patient_id:
        last_num = int(last_patient.patient_id[1:])
        patient_id = f"P{last_num + 1:03d}"
    else:
        patient_id = "P001"
    
    # Create patient record
    # Convert medical_history to JSONB format
    medical_history_json = {"notes": request.medical_history} if request.medical_history else None
    
    print(f"DEBUG: medical_history input: {request.medical_history}")
    print(f"DEBUG: medical_history_json: {medical_history_json}")
    
    new_patient = Patient(
        patient_id=patient_id,
        full_name=request.full_name,
        age=request.age,
        gender=request.gender.lower() if request.gender else None,  # Convert to lowercase
        contact_number=request.contact_number,
        email=request.email,
        address=request.address,
        medical_history=medical_history_json,
        user_id=user_id,
        created_by=current_user.id
    )
    
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    
    # Email sending is now handled by frontend using EmailJS
    # Backend no longer sends emails to avoid Render SMTP restrictions
    # if request.create_account and request.send_email:
    #     from ...core.config import settings
    #     EmailService.send_user_credentials(
    #         email=request.email,
    #         password=password,
    #         full_name=request.full_name,
    #         role=UserRole.PATIENT.value,
    #         portal_url=settings.PORTAL_URL
    #     )
    
    # Convert patient to dict for serialization
    patient_dict = {
        "id": str(new_patient.id),
        "patient_id": new_patient.patient_id,
        "full_name": new_patient.full_name,
        "age": new_patient.age,
        "gender": new_patient.gender,
        "contact_number": new_patient.contact_number,
        "email": new_patient.email,
        "address": new_patient.address,
        "medical_history": new_patient.medical_history,
        "created_at": new_patient.created_at.isoformat() if new_patient.created_at else None,
    }
    
    return {
        "patient": patient_dict,
        "account_created": request.create_account,
        "password": password if (request.create_account and not request.send_email) else None
    }

@router.get("/users")
async def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """List all users - Admin only"""
    users = db.query(User).all()
    
    # Explicitly serialize to avoid Pydantic/SQLAlchemy validation issues during list return
    serialized_users = []
    for u in users:
        serialized_users.append({
            "id": str(u.id),
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role.value if hasattr(u.role, 'value') else str(u.role),
            "is_active": u.is_active,
            "created_at": u.created_at.isoformat() if u.created_at else None
        })
        
    return serialized_users

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete a user - Admin only"""
    
    # Prevent deleting yourself
    if str(current_user.id) == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}
