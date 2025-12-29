import cv2
import numpy as np
from PIL import Image

class ImagePreprocessor:
    @staticmethod
    def preprocess(image_path: str, target_size: tuple = (640, 640)):
        """Preprocess image for YOLOv8"""
        # Read image
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not read image from {image_path}")
        
        # Resize
        image = cv2.resize(image, target_size)
        
        # Enhance contrast (CLAHE)
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l = clahe.apply(l)
        enhanced = cv2.merge([l, a, b])
        enhanced = cv2.cvtColor(enhanced, cv2.COLOR_LAB2BGR)
        
        return enhanced
    
    @staticmethod
    def save_preprocessed(image: np.ndarray, output_path: str):
        """Save preprocessed image"""
        cv2.imwrite(output_path, image)