from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum
from ..core.database import Base

class Gender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(String, unique=True, nullable=False, index=True)
    full_name = Column(String, nullable=False)
    age = Column(Integer)
    gender = Column(String)  # Changed from Enum to String to match database
    contact_number = Column(String)
    email = Column(String)
    address = Column(Text)
    medical_history = Column(JSONB)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)  # Link to user account for patient portal
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    detections = relationship("Detection", back_populates="patient")
    appointments = relationship("Appointment", back_populates="patient")