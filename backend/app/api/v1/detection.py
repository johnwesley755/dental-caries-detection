from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from ...core.database import get_db
from ...schemas.detection import DetectionCreate, DetectionResponse
from ...services.detection_service import DetectionService
from ...services.image_service import ImageService
from ...dependencies.auth import get_current_active_dentist
from ...models.user import User
from ...utils.validation import validate_file_extension, validate_file_size

router = APIRouter()
detection_service = DetectionService()
image_service = ImageService()

@router.post("/", response_model=DetectionResponse, status_code=status.HTTP_201_CREATED)
async def create_detection(
    file: UploadFile = File(...),
    patient_id: str = Form(...),
    image_type: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_dentist)
):
    """Perform dental caries detection"""
    # Validate file
    if not validate_file_extension(file.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only JPG, PNG, and BMP are allowed."
        )
    
    # Save uploaded file (now returns dict with local_path and cloudinary info)
    upload_result = await image_service.save_upload_file(file)
    file_path = upload_result.get("local_path")
    
    try:
        # Create detection data
        detection_data = DetectionCreate(
            patient_id=UUID(patient_id),
            image_type=image_type,
            notes=notes
        )
        
        # Process detection with Cloudinary data
        detection = detection_service.process_detection(
            db=db,
            image_path=file_path,
            patient_id=UUID(patient_id),
            dentist_id=current_user.id,
            detection_data=detection_data,
            original_image_cloudinary=upload_result
        )
        
        return detection
    
    except Exception as e:
        # Clean up uploaded file on error
        image_service.delete_file(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Detection processing failed: {str(e)}"
        )

@router.get("/{detection_id}", response_model=DetectionResponse)
async def get_detection(
    detection_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_dentist)
):
    """Get detection by ID"""
    return DetectionService.get_detection(db, detection_id)

@router.get("/patient/{patient_id}", response_model=List[DetectionResponse])
async def get_patient_detections(
    patient_id: UUID,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_dentist)
):
    """Get all detections for a patient"""
    return DetectionService.get_patient_detections(db, patient_id, skip, limit)
