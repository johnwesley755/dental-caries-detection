# backend/app/api/v1/patient.py
import os
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from ...core.database import get_db
from ...dependencies.auth import get_current_user
from ...models.user import User, UserRole
from ...models.patient import Patient
from ...models.detection import Detection
from ...schemas.patient import PatientResponse
from ...schemas.detection import DetectionResponse, DetectionCreate
from ...services.detection_service import DetectionService
from ...services.image_service import ImageService
from ...utils.validation import validate_file_extension

router = APIRouter()
detection_service = DetectionService()
image_service = ImageService()

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
    
    # Get all detections for this patient with findings eagerly loaded
    detections = db.query(Detection).options(joinedload(Detection.caries_findings)).filter(Detection.patient_id == patient.id).all()
    
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

@router.post("/detections", response_model=DetectionResponse, status_code=status.HTTP_201_CREATED)
async def create_patient_detection(
    file: UploadFile = File(...),
    image_type: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Allow patient to upload their own dental image for detection"""
    if current_user.role != UserRole.PATIENT:
        raise HTTPException(status_code=403, detail="Only patients can access this endpoint")
    
    # Find patient record
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient record not found")
    
    # Validate file
    if not validate_file_extension(file.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only JPG, PNG, and BMP are allowed."
        )
    
    # Save uploaded file
    upload_result = await image_service.save_upload_file(file)
    file_path = upload_result.get("local_path")
    
    try:
        # Create detection data
        detection_data = DetectionCreate(
            patient_id=patient.id,
            image_type=image_type,
            notes=notes
        )
        
        # Determine dentist (either who created the patient, or none)
        # Use the dentist who created the patient record as the assigned dentist
        dentist_id = patient.created_by
        
        # Process detection
        detection = detection_service.process_detection(
            db=db,
            image_path=file_path,
            patient_id=patient.id,
            dentist_id=dentist_id,
            detection_data=detection_data,
            original_image_cloudinary=upload_result
        )
        
        # Cleanup local original image after successful processing if it was uploaded to Cloudinary
        if upload_result.get("cloudinary_url") and file_path and os.path.exists(file_path):
            image_service.delete_file(file_path)
            # Update detection record to reflect it's no longer local
            detection.original_image_path = None
            db.commit()

        return detection
    
    except Exception as e:
        # Clean up uploaded file on error
        if file_path:
            image_service.delete_file(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Detection processing failed: {str(e)}"
        )
