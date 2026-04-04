from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from ..core.database import Base

class DentistProfile(Base):
    __tablename__ = "dentist_profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    license_number = Column(String, unique=True, nullable=False, index=True)
    specialization = Column(String)
    clinic_name = Column(String)
    clinic_address = Column(String)
    verification_documents_url = Column(String) # For proof upload
    
    # Verification Lifecycle
    verification_status = Column(String, default="PENDING") # PENDING, APPROVED, REJECTED, RESUBMITTED
    rejection_reason = Column(String, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    verified_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    # Additional Profile Details
    phone_number = Column(String, nullable=True)
    years_of_experience = Column(String, nullable=True)
    profile_image_url = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="profile", foreign_keys=[user_id])
    verified_by = relationship("User", foreign_keys=[verified_by_id])
