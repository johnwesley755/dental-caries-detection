from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class DentistProfileBase(BaseModel):
    license_number: str
    specialization: Optional[str] = None
    clinic_name: Optional[str] = None
    clinic_address: Optional[str] = None
    profile_image_url: Optional[str] = None

class DentistProfileCreate(DentistProfileBase):
    pass

class DentistProfileResponse(DentistProfileBase):
    id: UUID
    
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "DENTIST"

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    detection_id: Optional[UUID] = None
    profile: Optional[DentistProfileCreate] = None

class UserResponse(UserBase):
    id: UUID
    is_active: bool
    is_verified: bool
    is_email_verified: bool
    created_at: datetime
    profile: Optional[DentistProfileResponse] = None

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    role: str # PATIENT or DENTIST

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)