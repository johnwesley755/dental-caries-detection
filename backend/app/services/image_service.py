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
    
    async def save_upload_file(self, upload_file: UploadFile, upload_to_cloudinary: bool = True, folder: str = "dental-caries/general", delete_local: bool = False) -> Dict[str, str]:
        """
        Save uploaded file locally and optionally to Cloudinary
        
        Returns:
            Dictionary with 'local_path' and optionally 'cloudinary_url', 'public_id'
        """
        # Generate unique filename
        file_ext = os.path.splitext(upload_file.filename)[1]
        filename = f"{uuid4()}{file_ext}"
        
        # Ensure subdirectory exists if provided in folder
        sub_dir = folder.split('/')[-1] if '/' in folder else "general"
        upload_dir = os.path.join(settings.UPLOAD_DIR, sub_dir)
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = os.path.join(upload_dir, filename)
        
        # Save file locally
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        
        # Calculate a relative local URL for fallback access
        # settings.UPLOAD_DIR is mounted at /uploads/ in main.py
        local_url = f"/uploads/{sub_dir}/{filename}"
        
        result = {
            "local_path": file_path,
            "local_url": local_url
        }
        
        # Upload to Cloudinary if enabled
        if upload_to_cloudinary and settings.CLOUDINARY_CLOUD_NAME:
            try:
                # Use generic upload_image for arbitrary folders/files
                cloudinary_result = self.cloudinary_service.upload_image(file_path, folder=folder)
                result.update({
                    "cloudinary_url": cloudinary_result["url"],
                    "public_id": cloudinary_result["public_id"]
                })
                
                # Delete local file after successful Cloudinary upload if requested
                if delete_local:
                    self.delete_file(file_path)
                    result["local_path"] = None  # Indicate local file is gone
            except Exception as e:
                print(f"Warning: Failed to upload to Cloudinary: {str(e)}")
                # Continue with local URL fallback in result
        
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
