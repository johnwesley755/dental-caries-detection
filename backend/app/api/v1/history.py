from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from datetime import datetime
from ...core.database import get_db
from ...models.caries import DetectionHistory
from ...dependencies.auth import get_current_active_dentist
from ...models.user import User
from pydantic import BaseModel

router = APIRouter()

class HistoryResponse(BaseModel):
    id: UUID
    patient_id: UUID
    detection_id: UUID
    action: str
    performed_by: UUID
    timestamp: datetime
    changes: dict
    
    class Config:
        from_attributes = True

@router.get("/patient/{patient_id}", response_model=List[HistoryResponse])
async def get_patient_history(
    patient_id: UUID,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_dentist)
):
    """Get detection history for a patient"""
    history = db.query(DetectionHistory).filter(
        DetectionHistory.patient_id == patient_id
    ).order_by(DetectionHistory.timestamp.desc()).offset(skip).limit(limit).all()
    
    return history

@router.get("/detection/{detection_id}", response_model=List[HistoryResponse])
async def get_detection_history(
    detection_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_dentist)
):
    """Get history for a specific detection"""
    history = db.query(DetectionHistory).filter(
        DetectionHistory.detection_id == detection_id
    ).order_by(DetectionHistory.timestamp.desc()).all()
    
    return history