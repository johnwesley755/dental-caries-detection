from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Model
    MODEL_PATH: str = "models/best.pt"
    CONFIDENCE_THRESHOLD: float = 0.25
    IOU_THRESHOLD: float = 0.45
    
    # Email Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = "noreply@dentalcare.com"
    SMTP_FROM_NAME: str = "Dental Care System"
    PORTAL_URL: str = "http://localhost"
    
    # Paths
    UPLOAD_DIR: str = "uploads"
    RESULTS_DIR: str = "results"
    
    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    
    # Hospital Information
    HOSPITAL_NAME: str = "Dental Care Hospital"
    HOSPITAL_ADDRESS: str = ""
    HOSPITAL_PHONE: str = ""
    HOSPITAL_EMAIL: str = ""
    HOSPITAL_LOGO_URL: str = ""
    
    # Groq API (for chatbot) - Free tier with API key
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.1-8b-instant"  # LLaMA 3.1 8B Instant
    GROQ_API_URL: str = "https://api.groq.com/openai/v1/chat/completions"
    
    # Frontend URLs (for email links, redirects, etc.)
    FRONTEND_URL: str = "http://localhost:5173"
    PATIENT_PORTAL_URL: str = "http://localhost:5174"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS - Support both local and production URLs
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://localhost:5174"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# Create directories if they don't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.RESULTS_DIR, exist_ok=True)
