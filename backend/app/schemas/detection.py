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
    tooth_number: Optional[int]
    caries_type: Optional[str]
    severity: Optional[str]
    confidence_score: float
    bounding_box: dict
    location: Optional[str]
    treatment_recommendation: Optional[str]
    
    class Config:
        from_attributes = True

class DetectionResponse(BaseModel):
    id: UUID
    detection_id: str
    patient_id: UUID
    dentist_id: UUID
    original_image_path: str
    annotated_image_path: Optional[str]
    image_type: Optional[str]
    detection_date: datetime
    total_teeth_detected: int
    total_caries_detected: int
    processing_time_ms: float
    confidence_threshold: float
    status: str
    notes: Optional[str]
    caries_findings: List[CariesFindingInResponse] = []
    
    class Config:
        from_attributes = True