# backend/app/core/config.py
from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    DB_SSL_MODE: str = "prefer"  # 'require' for Neon, 'prefer' or 'disable' for local Postgres
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 300  # 5 hours
    
    # AI Model (Computer Vision)
    MODEL_PATH: str = "models/best.pt"
    CONFIDENCE_THRESHOLD: float = 0.25
    IOU_THRESHOLD: float = 0.45
    
    # Email Configuration (Brevo v3 SMTP API)
    BREVO_API_KEY: str = ""
    BREVO_SENDER_EMAIL: str = "noreply@dentoai.com"
    BREVO_SENDER_NAME: str = "DentoAI Diagnostics"
    
    # AI Configuration (Google Gemini)
    GOOGLE_API_KEY: str = ""
    GOOGLE_MODEL: str = "gemini-1.5-flash"
    
    # Cloudinary (Media Storage)
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    
    # Hospital Information
    HOSPITAL_NAME: str = "Dental Care Hospital"
    HOSPITAL_ADDRESS: str = ""
    HOSPITAL_PHONE: str = ""
    HOSPITAL_EMAIL: str = ""
    HOSPITAL_LOGO_URL: str = ""
    
    # Frontend URLs
    FRONTEND_URL: str = "http://localhost:5173"
    PATIENT_PORTAL_URL: str = "http://localhost:5174"
    PORTAL_URL: str = "http://localhost"  # Legacy support
    
    # Paths
    UPLOAD_DIR: str = os.path.abspath("uploads")
    RESULTS_DIR: str = os.path.abspath("results")
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    ALLOWED_ORIGINS: str = "*"

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore" # Ignore deprecated keys

settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.RESULTS_DIR, exist_ok=True)
