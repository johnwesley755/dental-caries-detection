from typing import List, Dict, Any
import numpy as np

class ResultProcessor:
    @staticmethod
    def classify_severity(confidence: float, area: float = None) -> str:
        """Classify severity based on confidence and area"""
        if confidence >= 0.8:
            return "severe"
        elif confidence >= 0.6:
            return "moderate"
        else:
            return "mild"
    
    @staticmethod
    def determine_location(bbox: List[float], image_shape: tuple) -> str:
        """Determine caries location based on position"""
        # Simplified location determination
        x_center = (bbox[0] + bbox[2]) / 2
        y_center = (bbox[1] + bbox[3]) / 2
        
        # Basic quadrant-based location
        if y_center < image_shape[0] / 3:
            return "occlusal"
        elif y_center > 2 * image_shape[0] / 3:
            return "apical"
        else:
            return "interproximal"
    
    @staticmethod
    def generate_treatment_recommendation(severity: str, caries_type: str) -> str:
        """Generate treatment recommendations"""
        recommendations = {
            ("mild", "enamel"): "Fluoride treatment and regular monitoring",
            ("moderate", "enamel"): "Composite filling recommended",
            ("severe", "enamel"): "Immediate restoration required",
            ("mild", "dentin"): "Composite filling recommended",
            ("moderate", "dentin"): "Large restoration or crown may be needed",
            ("severe", "dentin"): "Root canal treatment may be necessary",
            ("mild", "pulp"): "Endodontic consultation required",
            ("moderate", "pulp"): "Root canal treatment recommended",
            ("severe", "pulp"): "Urgent endodontic treatment or extraction",
        }
        return recommendations.get((severity, caries_type), "Dental consultation recommended")
    
    def process_results(self, results, image_shape: tuple) -> List[Dict[str, Any]]:
        """Process YOLOv8 results"""
        detections = []
        
        for result in results:
            boxes = result.boxes
            
            for box in boxes:
                bbox = box.xyxy[0].tolist()
                confidence = float(box.conf[0])
                class_id = int(box.cls[0])
                
                # Calculate area
                width = bbox[2] - bbox[0]
                height = bbox[3] - bbox[1]
                area = width * height
                
                # Determine severity and location
                severity = self.classify_severity(confidence, area)
                location = self.determine_location(bbox, image_shape)
                
                # Simplified caries type based on class_id
                caries_types = {0: "enamel", 1: "dentin", 2: "pulp"}
                caries_type = caries_types.get(class_id, "enamel")
                
                detection = {
                    "class_id": class_id,
                    "confidence": confidence,
                    "bbox": {
                        "x": bbox[0],
                        "y": bbox[1],
                        "width": width,
                        "height": height
                    },
                    "severity": severity,
                    "caries_type": caries_type,
                    "location": location,
                    "area_mm2": area,  # This should be calibrated in production
                    "treatment_recommendation": self.generate_treatment_recommendation(severity, caries_type)
                }
                
                detections.append(detection)
        
        return detections
