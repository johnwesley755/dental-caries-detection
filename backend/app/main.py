from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .core.config import settings
from .core.database import Base, engine
from .api.v1 import api_router
from .ml.model_loader import model_loader
import os

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Dental Caries Detection API",
    description="AI-powered dental caries detection using YOLOv8",
    version="1.0.0"
)

# Configure CORS - Support both local and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),  # Split comma-separated string
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")
if os.path.exists(settings.RESULTS_DIR):
    app.mount("/results", StaticFiles(directory=settings.RESULTS_DIR), name="results")

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    """Load ML model on startup"""
    print("Loading YOLOv8 model...")
    model_loader.load_model()
    print("Model loaded successfully!")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Dental Caries Detection API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
