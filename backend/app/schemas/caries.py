from pydantic import BaseModel
from typing import Optional, Dict, Any
from uuid import UUID

class CariesFindingResponse(BaseModel):
    id: UUID
    detection_id: UUID
    tooth_number: Optional[int]
    caries_type: Optional[str]
    severity: Optional[str]
    confidence_score: float
    bounding_box: Dict[str, Any]
    segmentation_mask: Optional[Dict[str, Any]]
    area_mm2: Optional[float]
    location: Optional[str]
    treatment_recommendation: Optional[str]
    
    class Config:
        from_attributes = True
