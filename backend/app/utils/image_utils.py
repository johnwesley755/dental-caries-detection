from PIL import Image
import io

def validate_image(file_content: bytes) -> bool:
    """Validate if file is a valid image"""
    try:
        img = Image.open(io.BytesIO(file_content))
        img.verify()
        return True
    except Exception:
        return False

def get_image_dimensions(file_path: str) -> tuple:
    """Get image dimensions"""
    img = Image.open(file_path)
    return img.size