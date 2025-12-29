from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum
from ..core.database import Base

class CariesType(str, enum.Enum):
    enamel = "enamel"
    dentin = "dentin"
    pulp = "pulp"

class Severity(str, enum.Enum):
    mild = "mild"
    moderate = "moderate"
    severe = "severe"

class CariesFinding(Base):
    __tablename__ = "caries_findings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    detection_id = Column(UUID(as_uuid=True), ForeignKey("detections.id"), nullable=False)
    tooth_number = Column(Integer)
    caries_type = Column(Enum(CariesType))
    severity = Column(Enum(Severity))
    confidence_score = Column(Float)
    bounding_box = Column(JSONB)
    segmentation_mask = Column(JSONB)
    area_mm2 = Column(Float)
    location = Column(String)
    treatment_recommendation = Column(Text)
    
    detection = relationship("Detection", back_populates="caries_findings")

class DetectionHistory(Base):
    __tablename__ = "detection_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    detection_id = Column(UUID(as_uuid=True), ForeignKey("detections.id"), nullable=False)
    action = Column(String, nullable=False)
    performed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    changes = Column(JSONB)
