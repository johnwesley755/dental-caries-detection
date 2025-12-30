from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .core.config import settings
from .core.database import Base, engine
from .api.v1 import api_router
from .ml.model_loader import model_loader
import os

# ---------------------------------------------------------
# Create database tables
# ---------------------------------------------------------
Base.metadata.create_all(bind=engine)

# ---------------------------------------------------------
# Initialize FastAPI app
# ---------------------------------------------------------
app = FastAPI(
    title="Dental Caries Detection API",
    description="AI-powered dental caries detection using YOLOv8",
    version="1.0.0"
)

# ---------------------------------------------------------
# SAFE CORS CONFIGURATION (ENV-BASED)
# ---------------------------------------------------------
# ALLOWED_ORIGINS example:
# http://localhost:5173,https://your-vercel-app.vercel.app

origins = []

if settings.ALLOWED_ORIGINS:
    origins = [
        origin.strip()
        for origin in settings.ALLOWED_ORIGINS.split(",")
        if origin.strip()
    ]

# Fallback to allow all (prevents production crashes)
if not origins:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Static file serving
# ---------------------------------------------------------
if os.path.exists(settings.UPLOAD_DIR):
    app.mount(
        "/uploads",
        StaticFiles(directory=settings.UPLOAD_DIR),
        name="uploads"
    )

if os.path.exists(settings.RESULTS_DIR):
    app.mount(
        "/results",
        StaticFiles(directory=settings.RESULTS_DIR),
        name="results"
    )

# ---------------------------------------------------------
# API Routes
# ---------------------------------------------------------
app.include_router(api_router, prefix="/api/v1")

# ---------------------------------------------------------
# Startup Event
# ---------------------------------------------------------
@app.on_event("startup")
async def startup_event():
    print("Loading YOLOv8 model...")
    model_loader.load_model()
    print("Model loaded successfully!")

# ---------------------------------------------------------
# Health & Root Endpoints
# ---------------------------------------------------------
@app.get("/")
async def root():
    return {
        "message": "Dental Caries Detection API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# ---------------------------------------------------------
# Local development entry point
# ---------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
