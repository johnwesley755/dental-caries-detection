from sqlalchemy.orm import Session
from ..models.detection import Detection, DetectionStatus
from ..models.caries import CariesFinding, DetectionHistory
from ..schemas.detection import DetectionCreate
from ..ml.predictor import CariesDetector
from ..ml.preprocessor import ImagePreprocessor
from ..ml.postprocessor import ResultProcessor
from typing import List
from uuid import UUID, uuid4
from datetime import datetime
import os
from ..core.config import settings

class DetectionService:
    def __init__(self):
        self.detector = CariesDetector()
        self.preprocessor = ImagePreprocessor()
        self.postprocessor = ResultProcessor()
    
    @staticmethod
    def generate_detection_id() -> str:
        """Generate unique detection ID"""
        return f"DET-{datetime.now().strftime('%Y%m%d')}-{str(uuid4())[:8].upper()}"
    
    def process_detection(
        self,
        db: Session,
        image_path: str,
        patient_id: UUID,
        dentist_id: UUID,
        detection_data: DetectionCreate,
        original_image_cloudinary: dict = None
    ) -> Detection:
        """Process dental caries detection"""
        # Preprocess image
        preprocessed = self.preprocessor.preprocess(image_path)
        
        # Perform detection
        results_dir = os.path.abspath(os.path.join(settings.RESULTS_DIR, str(uuid4())))
        os.makedirs(results_dir, exist_ok=True)
        
        print(f"Starting detection. Results will be saved to: {results_dir}")
        detection_results = self.detector.detect(image_path, results_dir)
        
        # Get annotated image path from YOLO results
        base_filename = os.path.basename(image_path)
        filename_no_ext = os.path.splitext(base_filename)[0]
        
        # YOLO results[0].save_dir is the most reliable source
        yolo_save_dir = detection_results["results"][0].save_dir
        print(f"YOLO reports results saved to: {yolo_save_dir}")
        
        annotated_path = None
        # Try different extensions because YOLO might convert them
        for ext in [os.path.splitext(base_filename)[1], ".jpg", ".jpeg", ".png"]:
            test_path = os.path.join(yolo_save_dir, f"{filename_no_ext}{ext}")
            if os.path.exists(test_path):
                annotated_path = test_path
                break
        
        if not annotated_path:
            # Last resort fallback to our previous discovery logic if save_dir fails
            print("Warning: save_dir path not found, falling back to manual search.")
            search_dirs = [
                os.path.join(results_dir, "detection"),
                os.path.join(os.getcwd(), "runs", "detect", os.path.basename(results_dir), "detection"),
            ]
            for s_dir in search_dirs:
                for ext in [os.path.splitext(base_filename)[1], ".jpg", ".jpeg", ".png"]:
                    test_path = os.path.join(s_dir, f"{filename_no_ext}{ext}")
                    if os.path.exists(test_path):
                        annotated_path = test_path
                        break
                if annotated_path: break
        
        print(f"Annotated path found: {annotated_path}")

        # Upload annotated image to Cloudinary if it exists
        annotated_cloudinary = None
        if annotated_path and settings.CLOUDINARY_CLOUD_NAME:
            try:
                from .cloudinary_service import CloudinaryService
                cloudinary_service = CloudinaryService()
                print(f"Uploading annotated image to Cloudinary: {annotated_path}")
                annotated_cloudinary = cloudinary_service.upload_annotated_image(annotated_path)
                print(f"Annotated upload successful: {annotated_cloudinary.get('url')}")
            except Exception as e:
                print(f"Warning: Failed to upload annotated image to Cloudinary: {str(e)}")
        else:
            if not annotated_path:
                print("Warning: Annotated image not found locally after detection.")
            if not settings.CLOUDINARY_CLOUD_NAME:
                print("Warning: Cloudinary not configured, skipping upload.")
        
        # Process results
        results = self.postprocessor.process_results(
            detection_results["results"],
            preprocessed.shape
        )
        findings = results["findings"]
        teeth_count = results["teeth_count"]
        
        # Create detection record
        db_detection = Detection(
            detection_id=self.generate_detection_id(),
            patient_id=patient_id,
            dentist_id=dentist_id,
            original_image_url=original_image_cloudinary.get("cloudinary_url") if original_image_cloudinary else None,
            annotated_image_url=annotated_cloudinary.get("url") if annotated_cloudinary else None,
            original_image_public_id=original_image_cloudinary.get("public_id") if original_image_cloudinary else None,
            annotated_image_public_id=annotated_cloudinary.get("public_id") if annotated_cloudinary else None,
            image_type=detection_data.image_type.upper() if detection_data.image_type else "INTRAORAL",
            total_teeth_detected=teeth_count,
            total_caries_detected=len(findings),
            processing_time_ms=detection_results["processing_time_ms"],
            confidence_threshold=settings.CONFIDENCE_THRESHOLD,
            status=DetectionStatus.COMPLETED,
            notes=detection_data.notes
        )
        
        db.add(db_detection)
        db.flush()
        
        # Create caries findings
        for det in findings:
            # Map casing to match specific database enum requirements
            raw_caries_type = det["caries_type"].upper() if "caries_type" in det and det["caries_type"] else None
            # If it's enamel/dentin/pulp it must be UPPER, else lower for 'caries', 'cavity', 'crack'
            if raw_caries_type in ["ENAMEL", "DENTIN", "PULP"]:
                final_caries_type = raw_caries_type
            elif raw_caries_type:
                final_caries_type = raw_caries_type.lower()
            else:
                final_caries_type = None

            caries = CariesFinding(
                detection_id=db_detection.id,
                caries_type=final_caries_type,
                severity=det["severity"].upper() if "severity" in det and det["severity"] else None,
                confidence_score=det["confidence"],
                bounding_box=det["bbox"],
                area_mm2=det["area_mm2"],
                location=det["location"].upper() if "location" in det and det["location"] else None,
                treatment_recommendation=det["treatment_recommendation"]
            )
            db.add(caries)
        
        # Create history entry
        history = DetectionHistory(
            patient_id=patient_id,
            detection_id=db_detection.id,
            action="created",
            performed_by=dentist_id,
            changes={"status": DetectionStatus.COMPLETED.value}
        )
        db.add(history)
        
        db.commit()
        db.refresh(db_detection)

        # Cleanup: Delete the local annotated results directory after successful upload
        if annotated_cloudinary and os.path.exists(results_dir):
            try:
                import shutil
                shutil.rmtree(results_dir)
            except Exception as e:
                print(f"Warning: Failed to cleanup results directory: {str(e)}")

        return db_detection
    
    @staticmethod
    def get_detection(db: Session, detection_id: UUID) -> Detection:
        """Get detection by ID"""
        detection = db.query(Detection).filter(Detection.id == detection_id).first()
        if not detection:
            raise HTTPException(status_code=404, detail="Detection not found")
        return detection
    
    @staticmethod
    def get_patient_detections(
        db: Session,
        patient_id: UUID,
        skip: int = 0,
        limit: int = 100
    ) -> List[Detection]:
        """Get all detections for a patient"""
        return db.query(Detection).filter(
            Detection.patient_id == patient_id
        ).offset(skip).limit(limit).all()
    @staticmethod
    def link_detection_to_patient(db: Session, detection_id: UUID, patient_id: UUID) -> Detection:
        """Link an anonymous detection to a patient record"""
        detection = db.query(Detection).filter(Detection.id == detection_id).first()
        if not detection:
            raise HTTPException(status_code=404, detail="Detection not found")
        
        # Already linked check
        if detection.patient_id is not None:
             return detection
             
        detection.patient_id = patient_id
        
        # Update history
        history = DetectionHistory(
            patient_id=patient_id,
            detection_id=detection.id,
            action="linked",
            changes={"patient_id": str(patient_id)}
        )
        db.add(history)
        
        db.commit()
        db.refresh(detection)
        return detection
