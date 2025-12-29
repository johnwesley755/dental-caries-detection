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
        detection_data: DetectionCreate
    ) -> Detection:
        """Process dental caries detection"""
        # Preprocess image
        preprocessed = self.preprocessor.preprocess(image_path)
        
        # Perform detection
        results_dir = os.path.join(settings.RESULTS_DIR, str(uuid4()))
        os.makedirs(results_dir, exist_ok=True)
        
        detection_results = self.detector.detect(image_path, results_dir)
        
        # Get annotated image path
        annotated_path = os.path.join(results_dir, "detection", os.path.basename(image_path))
        
        # Process results
        detections = self.postprocessor.process_results(
            detection_results["results"],
            preprocessed.shape
        )
        
        # Create detection record
        db_detection = Detection(
            detection_id=self.generate_detection_id(),
            patient_id=patient_id,
            dentist_id=dentist_id,
            original_image_path=image_path,
            annotated_image_path=annotated_path if os.path.exists(annotated_path) else None,
            image_type=detection_data.image_type,
            total_caries_detected=len(detections),
            processing_time_ms=detection_results["processing_time_ms"],
            confidence_threshold=settings.CONFIDENCE_THRESHOLD,
            status=DetectionStatus.completed,
            notes=detection_data.notes
        )
        
        db.add(db_detection)
        db.flush()
        
        # Create caries findings
        for det in detections:
            caries = CariesFinding(
                detection_id=db_detection.id,
                caries_type=det["caries_type"],
                severity=det["severity"],
                confidence_score=det["confidence"],
                bounding_box=det["bbox"],
                area_mm2=det["area_mm2"],
                location=det["location"],
                treatment_recommendation=det["treatment_recommendation"]
            )
            db.add(caries)
        
        # Create history entry
        history = DetectionHistory(
            patient_id=patient_id,
            detection_id=db_detection.id,
            action="created",
            performed_by=dentist_id,
            changes={"status": DetectionStatus.completed.value}
        )
        db.add(history)
        
        db.commit()
        db.refresh(db_detection)
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
