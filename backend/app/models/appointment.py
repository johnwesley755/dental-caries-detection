# backend/app/models/appointment.py
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..core.database import Base
import uuid
from datetime import datetime
import enum

class AppointmentStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    dentist_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    appointment_date = Column(DateTime, nullable=False)
    duration_minutes = Column(String, default="30")  # Default 30 minutes
    
    status = Column(SQLEnum(AppointmentStatus), default=AppointmentStatus.SCHEDULED)
    appointment_type = Column(String, default="checkup")  # checkup, cleaning, treatment, etc.
    
    notes = Column(Text, nullable=True)
    reminder_sent = Column(String, default="false")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    patient = relationship("Patient", back_populates="appointments")
    dentist = relationship("User", foreign_keys=[dentist_id])
