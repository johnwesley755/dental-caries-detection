from ultralytics import YOLO
import torch
from ..core.config import settings

class ModelLoader:
    _instance = None
    _model = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
        return cls._instance
    
    def load_model(self):
        """Load YOLOv8 model"""
        if self._model is None:
            device = 'cuda' if torch.cuda.is_available() else 'cpu'
            print(f"Loading model on device: {device}")
            self._model = YOLO(settings.MODEL_PATH)
            self._model.to(device)
        return self._model
    
    def get_model(self):
        """Get loaded model"""
        if self._model is None:
            return self.load_model()
        return self._model

model_loader = ModelLoader()