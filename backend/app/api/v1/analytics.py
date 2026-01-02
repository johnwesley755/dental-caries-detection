# backend/app/api/v1/analytics.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.services.analytics_service import AnalyticsService
from app.models import User

router = APIRouter(prefix="/analytics", tags=["analytics"])

# ============================================
# DENTIST ENDPOINTS
# ============================================

@router.get("/detection-trends")
async def get_detection_trends(
    days: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get detection trends over time
    Returns: [{"date": "2024-01-01", "count": 5}, ...]
    """
    if current_user.role not in ['DENTIST', 'ADMIN']:
        raise HTTPException(status_code=403, detail="Access denied")
    
    trends = AnalyticsService.get_detection_trends(db, days)
    return trends

@router.get("/caries-distribution")
async def get_caries_distribution(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get caries distribution by severity
    Returns: [{"severity": "mild", "count": 10}, ...]
    """
    if current_user.role not in ['dentist', 'admin']:
        raise HTTPException(status_code=403, detail="Access denied")
    
    distribution = AnalyticsService.get_caries_distribution(db)
    return distribution

@router.get("/patient-growth")
async def get_patient_growth(
    days: int = 90,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get patient registration growth
    Returns: [{"date": "2024-01-01", "count": 3}, ...]
    """
    if current_user.role not in ['dentist', 'admin']:
        raise HTTPException(status_code=403, detail="Access denied")
    
    growth = AnalyticsService.get_patient_growth(db, days)
    return growth

@router.get("/appointment-stats")
async def get_appointment_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get appointment statistics by status
    Returns: {"scheduled": 10, "completed": 50, "cancelled": 5}
    """
    if current_user.role not in ['dentist', 'admin']:
        raise HTTPException(status_code=403, detail="Access denied")
    
    stats = AnalyticsService.get_appointment_stats(db)
    return stats

# ============================================
# PATIENT ENDPOINTS
# ============================================

@router.get("/my-health-score")
async def get_my_health_score(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get patient's current health score
    Returns: {"score": 85, "trend": "improving"}
    """
    if current_user.role != 'PATIENT':
        raise HTTPException(status_code=403, detail="Patients only")
    
    # Calculate current score
    score = AnalyticsService.calculate_health_score(db, str(current_user.id))
    
    # Save to history
    AnalyticsService.save_health_score(db, str(current_user.id), score)
    
    # Get trend
    trend = AnalyticsService.get_health_score_trend(db, str(current_user.id))
    
    return {"score": score, "trend": trend}

@router.get("/my-health-history")
async def get_my_health_history(
    days: int = 180,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get patient's health score history
    Returns: [{"date": "2024-01-01", "score": 85}, ...]
    """
    if current_user.role != 'patient':
        raise HTTPException(status_code=403, detail="Patients only")
    
    history = AnalyticsService.get_health_history(db, str(current_user.id), days)
    return history

@router.get("/my-detection-history")
async def get_my_detection_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get patient's detection history for charts
    Returns: [{"date": "2024-01-01", "caries_count": 2}, ...]
    """
    if current_user.role != 'patient':
        raise HTTPException(status_code=403, detail="Patients only")
    
    history = AnalyticsService.get_detection_history(db, str(current_user.id))
    return history
