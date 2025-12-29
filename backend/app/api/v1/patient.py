# backend/app/api/v1/patient.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...core.database import get_db
from ...dependencies.auth import get_current_user
from ...models.user import User, UserRole
from ...models.patient import Patient
from ...models.detection import Detection
from ...schemas.patient import PatientResponse
from ...schemas.detection import DetectionResponse

router = APIRouter()

@router.get("/me", response_model=PatientResponse)
async def get_my_patient_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current patient's information"""
    if current_user.role != UserRole.PATIENT:
        raise HTTPException(status_code=403, detail="Only patients can access this endpoint")
    
    # Find patient record linked to this user
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient record not found")
    
    return patient

@router.get("/detections", response_model=List[DetectionResponse])
async def get_my_detections(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all detections for current patient"""
    if current_user.role != UserRole.PATIENT:
        raise HTTPException(status_code=403, detail="Only patients can access this endpoint")
    
    # Find patient record
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient record not found")
    
    # Get all detections for this patient
    detections = db.query(Detection).filter(Detection.patient_id == patient.id).all()
    
    return detections

@router.get("/detection/{detection_id}", response_model=DetectionResponse)
async def get_my_detection(
    detection_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific detection for current patient"""
    if current_user.role != UserRole.PATIENT:
        raise HTTPException(status_code=403, detail="Only patients can access this endpoint")
    
    # Find patient record
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient record not found")
    
    # Get detection
    detection = db.query(Detection).filter(
        Detection.detection_id == detection_id,
        Detection.patient_id == patient.id
    ).first()
    
    if not detection:
        raise HTTPException(status_code=404, detail="Detection not found or access denied")
    
    return detection
