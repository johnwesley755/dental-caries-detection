from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum
from ..core.database import Base

class ImageType(str, enum.Enum):
    intraoral = "intraoral"
    bitewing = "bitewing"
    periapical = "periapical"
    panoramic = "panoramic"

class DetectionStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    reviewed = "reviewed"

class Detection(Base):
    __tablename__ = "detections"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    detection_id = Column(String, unique=True, nullable=False, index=True)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    dentist_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    original_image_path = Column(String, nullable=False)
    annotated_image_path = Column(String)
    original_image_url = Column(String)  # Cloudinary URL
    annotated_image_url = Column(String)  # Cloudinary URL
    original_image_public_id = Column(String)  # For Cloudinary deletion
    annotated_image_public_id = Column(String)  # For Cloudinary deletion
    image_type = Column(Enum(ImageType))
    detection_date = Column(DateTime(timezone=True), server_default=func.now())
    total_teeth_detected = Column(Integer, default=0)
    total_caries_detected = Column(Integer, default=0)
    processing_time_ms = Column(Float)
    confidence_threshold = Column(Float)
    status = Column(Enum(DetectionStatus), default=DetectionStatus.pending)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    patient = relationship("Patient", back_populates="detections")
    dentist = relationship("User")
    caries_findings = relationship("CariesFinding", back_populates="detection", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="detection")