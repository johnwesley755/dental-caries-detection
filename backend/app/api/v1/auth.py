from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from fastapi.security import OAuth2PasswordRequestForm
from typing import Optional
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...schemas.user import UserCreate, UserLogin, UserResponse, Token, ForgotPasswordRequest, ResetPasswordRequest
from ...services.auth_service import AuthService
from ...dependencies.auth import get_current_user
from ...models.user import User
from pydantic import BaseModel
import json

router = APIRouter()

class OTPVerifyRequest(BaseModel):
    email: str
    otp: str

class OTPResendRequest(BaseModel):
    email: str

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: str = Form(...),
    license_file: Optional[UploadFile] = File(None),
    profile_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """Register new user with optional document upload"""
    try:
        data = json.loads(user_data)
        user_create = UserCreate(**data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid user data format: {str(e)}"
        )
        
    return await AuthService.create_user(db, user_create, license_file, profile_image)

@router.post("/verify-otp")
async def verify_otp(request: OTPVerifyRequest, db: Session = Depends(get_db)):
    """Verify user's email using 6-digit OTP"""
    AuthService.verify_otp(db, request.email, request.otp)
    return {"message": "Email verified successfully"}

@router.post("/resend-otp")
async def resend_otp(request: OTPResendRequest, db: Session = Depends(get_db)):
    """Resend verification OTP to user"""
    AuthService.resend_otp(db, request.email)
    return {"message": "Verification code resent successfully"}

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login user"""
    user = AuthService.authenticate_user(db, form_data.username, form_data.password)
    access_token = AuthService.create_access_token_for_user(user)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login/json", response_model=Token)
async def login_json(user_login: UserLogin, db: Session = Depends(get_db)):
    """Login with JSON body"""
    user = AuthService.authenticate_user(db, user_login.email, user_login.password)
    access_token = AuthService.create_access_token_for_user(user)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current user information"""
    return current_user

@router.get("/dentists", response_model=list[UserResponse])
async def get_dentists(db: Session = Depends(get_db)):
    """Get all available dentists"""
    from ...models.user import UserRole
    dentists = db.query(User).filter(User.role == UserRole.DENTIST).all()
    return dentists

@router.get("/verify-email")
async def verify_email(token: str, db: Session = Depends(get_db)):
    """Verify user's email using token-based link (LEGACY support)"""
    AuthService.verify_email(db, token)
    return {"message": "Email verified successfully"}

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Initiate password reset"""
    AuthService.initiate_password_reset(db, request.email, request.role)
    return {"message": "If the email is registered, a reset link has been sent"}

@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Complete password reset"""
    AuthService.complete_password_reset(db, request.token, request.new_password)
    return {"message": "Password reset successfully"}