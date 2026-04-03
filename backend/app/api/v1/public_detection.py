import os
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID, uuid4
from ...core.database import get_db
from ...schemas.detection import DetectionCreate, DetectionResponse
from ...services.detection_service import DetectionService
from ...services.image_service import ImageService
from ...utils.validation import validate_file_extension

router = APIRouter()
detection_service = DetectionService()
image_service = ImageService()

@router.post("/detect", response_model=DetectionResponse)
async def public_detection(
    file: UploadFile = File(...),
    image_type: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """Perform dental caries detection for public/anonymous users"""
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
        # For public detection, we don't have a patient_id or dentist_id
        # We'll use a placeholder or None if the service supports it
        # Actually, let's create a "public" detection record
        # We might need to adjust the service to handle None patient_id if it doesn't already
        
        detection_data = DetectionCreate(
            patient_id=None, # Public/Anonymous
            image_type=image_type.upper() if image_type else "INTRAORAL",
            notes=notes or "Public AI Quick-Scan"
        )
        
        # Process detection (passing None for patient/dentist if service allows)
        detection = detection_service.process_detection(
            db=db,
            image_path=file_path,
            patient_id=None,
            dentist_id=None,
            detection_data=detection_data,
            original_image_cloudinary=upload_result
        )
        
        # Cleanup local file 
        if upload_result.get("cloudinary_url") and file_path and os.path.exists(file_path):
            image_service.delete_file(file_path)
            db.commit()

        return detection
    
    except Exception as e:
        if file_path:
            image_service.delete_file(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Public detection failed: {str(e)}"
        )
