from typing import Optional

ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def validate_file_extension(filename: str) -> bool:
    """Validate file extension"""
    ext = filename.lower().split('.')[-1]
    return f'.{ext}' in ALLOWED_EXTENSIONS

def validate_file_size(file_size: int) -> bool:
    """Validate file size"""
    return file_size <= MAX_FILE_SIZE