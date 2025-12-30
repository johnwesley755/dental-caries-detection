import os
import shutil
from fastapi import UploadFile
from uuid import uuid4
from typing import Dict
from ..core.config import settings
from .cloudinary_service import CloudinaryService

class ImageService:
    def __init__(self):
        self.cloudinary_service = CloudinaryService()
    
    async def save_upload_file(self, upload_file: UploadFile, upload_to_cloudinary: bool = True) -> Dict[str, str]:
        """
        Save uploaded file locally and optionally to Cloudinary
        
        Returns:
            Dictionary with 'local_path' and optionally 'cloudinary_url', 'public_id'
        """
        # Generate unique filename
        file_ext = os.path.splitext(upload_file.filename)[1]
        filename = f"{uuid4()}{file_ext}"
        file_path = os.path.join(settings.UPLOAD_DIR, filename)
        
        # Save file locally
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        
        result = {"local_path": file_path}
        
        # Upload to Cloudinary if enabled
        if upload_to_cloudinary and settings.CLOUDINARY_CLOUD_NAME:
            try:
                cloudinary_result = self.cloudinary_service.upload_original_image(file_path)
                result.update({
                    "cloudinary_url": cloudinary_result["url"],
                    "public_id": cloudinary_result["public_id"]
                })
            except Exception as e:
                print(f"Warning: Failed to upload to Cloudinary: {str(e)}")
                # Continue with local path only
        
        return result
    
    @staticmethod
    def delete_file(file_path: str) -> bool:
        """Delete local file"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
        except Exception:
            pass
        return False
