import time
from typing import List, Dict, Any
from .model_loader import model_loader
from ..core.config import settings

class CariesDetector:
    def __init__(self):
        self.model = model_loader.get_model()
        self.conf_threshold = settings.CONFIDENCE_THRESHOLD
        self.iou_threshold = settings.IOU_THRESHOLD
    
    def detect(self, image_path: str, save_dir: str) -> Dict[str, Any]:
        """Perform caries detection"""
        start_time = time.time()
        
        # Run inference
        results = self.model.predict(
            source=image_path,
            conf=self.conf_threshold,
            iou=self.iou_threshold,
            save=True,
            project=save_dir,
            name="detection",
            exist_ok=True
        )
        
        processing_time = (time.time() - start_time) * 1000  # Convert to ms
        
        return {
            "results": results,
            "processing_time_ms": processing_time
        }