import os
import shutil
from fastapi import UploadFile
from uuid import uuid4
from ..core.config import settings

class ImageService:
    @staticmethod
    async def save_upload_file(upload_file: UploadFile) -> str:
        """Save uploaded file"""
        # Generate unique filename
        file_ext = os.path.splitext(upload_file.filename)[1]
        filename = f"{uuid4()}{file_ext}"
        file_path = os.path.join(settings.UPLOAD_DIR, filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        
        return file_path
    
    @staticmethod
    def delete_file(file_path: str) -> bool:
        """Delete file"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
        except Exception:
            pass
        return False
