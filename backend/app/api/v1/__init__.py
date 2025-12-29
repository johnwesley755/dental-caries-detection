from fastapi import APIRouter
from .auth import router as auth_router
from .patients import router as patients_router
from .detection import router as detection_router
from .history import router as history_router
from .patient import router as patient_router
from .admin import router as admin_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
api_router.include_router(patients_router, prefix="/patients", tags=["patients"])
api_router.include_router(detection_router, prefix="/detections", tags=["detections"])
api_router.include_router(history_router, prefix="/history", tags=["history"])
api_router.include_router(patient_router, prefix="/patient", tags=["patient"])
api_router.include_router(admin_router, prefix="/admin", tags=["admin"])