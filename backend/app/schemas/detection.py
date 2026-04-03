from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class DetectionCreate(BaseModel):
    patient_id: UUID
    image_type: Optional[str] = None
    notes: Optional[str] = None

class CariesFindingInResponse(BaseModel):
    id: UUID
    caries_type: Optional[str]
    severity: Optional[str]
    confidence_score: Optional[float] = None
    bounding_box: Optional[dict] = None
    location: Optional[str]
    treatment_recommendation: Optional[str]
    
    class Config:
        from_attributes = True

class DetectionResponse(BaseModel):
    id: UUID
    detection_id: str
    patient_id: Optional[UUID] = None
    dentist_id: Optional[UUID] = None
    original_image_url: Optional[str] = None
    annotated_image_url: Optional[str] = None
    original_image_public_id: Optional[str] = None
    annotated_image_public_id: Optional[str] = None
    image_type: Optional[str] = None
    detection_date: Optional[datetime] = None
    total_teeth_detected: Optional[int] = 0
    total_caries_detected: Optional[int] = 0
    processing_time_ms: Optional[float] = 0.0
    confidence_threshold: Optional[float] = 0.0
    status: Optional[str] = "PENDING"
    notes: Optional[str] = None
    caries_findings: List[CariesFindingInResponse] = []
    
    class Config:
        from_attributes = True