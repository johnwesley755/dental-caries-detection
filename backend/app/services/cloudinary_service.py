from cloudinary import config as cloudinary_config
from cloudinary.uploader import upload, destroy
from cloudinary.utils import cloudinary_url
from typing import Optional, Dict
import os
from ..core.config import settings

class CloudinaryService:
    """Service for managing image uploads to Cloudinary"""
    
    def __init__(self):
        """Initialize Cloudinary configuration"""
        cloudinary_config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True
        )
    
    def upload_image(self, file_path: str, folder: str = "dental-caries") -> Dict[str, str]:
        """
        Upload an image to Cloudinary
        
        Args:
            file_path: Local path to the image file
            folder: Cloudinary folder to store the image
            
        Returns:
            Dictionary containing url, public_id, and secure_url
        """
        try:
            result = upload(
                file_path,
                folder=folder,
                resource_type="image",
                overwrite=False,
                format="jpg",
                transformation=[
                    {'quality': "auto:good"},
                    {'fetch_format': "auto"}
                ]
            )
            
            return {
                "url": result.get("secure_url"),
                "public_id": result.get("public_id"),
                "secure_url": result.get("secure_url"),
                "width": result.get("width"),
                "height": result.get("height")
            }
        except Exception as e:
            raise Exception(f"Failed to upload image to Cloudinary: {str(e)}")
    
    def upload_original_image(self, file_path: str) -> Dict[str, str]:
        """Upload original dental image"""
        return self.upload_image(file_path, folder="dental-caries/original")
    
    def upload_annotated_image(self, file_path: str) -> Dict[str, str]:
        """Upload AI-annotated dental image"""
        return self.upload_image(file_path, folder="dental-caries/annotated")
    
    def delete_image(self, public_id: str) -> bool:
        """
        Delete an image from Cloudinary
        
        Args:
            public_id: The public ID of the image to delete
            
        Returns:
            True if deletion was successful, False otherwise
        """
        try:
            result = destroy(public_id)
            return result.get("result") == "ok"
        except Exception as e:
            print(f"Failed to delete image from Cloudinary: {str(e)}")
            return False
    
    def get_optimized_url(
        self, 
        public_id: str, 
        width: Optional[int] = 800,
        height: Optional[int] = None,
        crop: str = "limit"
    ) -> str:
        """
        Get an optimized URL for an image
        
        Args:
            public_id: The public ID of the image
            width: Target width in pixels
            height: Target height in pixels (optional)
            crop: Crop mode (limit, fill, scale, etc.)
            
        Returns:
            Optimized image URL
        """
        transformation = {
            "width": width,
            "crop": crop,
            "quality": "auto:good",
            "fetch_format": "auto"
        }
        
        if height:
            transformation["height"] = height
        
        url, _ = cloudinary_url(
            public_id,
            transformation=transformation,
            secure=True
        )
        
        return url
    
    def get_thumbnail_url(self, public_id: str, size: int = 200) -> str:
        """Get a thumbnail URL for an image"""
        return self.get_optimized_url(
            public_id,
            width=size,
            height=size,
            crop="fill"
        )
