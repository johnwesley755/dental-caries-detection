# backend/app/services/analytics_service.py

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from app.models import Detection, HealthScore, User, Appointment

class AnalyticsService:
    
    @staticmethod
    def calculate_health_score(db: Session, patient_id: str) -> int:
        """
        Calculate patient health score (0-100)
        Higher score = better oral health
        
        Algorithm:
        - Base score: 100
        - -5 points per caries detected
        - -2 points per detection (more frequent = more issues)
        - Bonus: +10 if no detections in last 6 months
        """
        # Get detections from last 6 months
        six_months_ago = datetime.now() - timedelta(days=180)
        
        detections = db.query(Detection).filter(
            Detection.patient_id == patient_id,
            Detection.detection_date >= six_months_ago
        ).all()
        
        if not detections:
            return 100  # No detections = perfect score
        
        total_caries = sum(d.total_caries_detected for d in detections)
        detection_count = len(detections)
        
        # Score calculation
        score = 100 - (total_caries * 5) - (detection_count * 2)
        
        # Ensure score is between 0-100
        return max(0, min(100, score))
    
    @staticmethod
    def get_detection_trends(db: Session, days: int = 30) -> List[Dict[str, Any]]:
        """Get detection counts grouped by date"""
        start_date = datetime.now() - timedelta(days=days)
        
        results = db.query(
            func.date(Detection.detection_date).label('date'),
            func.count(Detection.id).label('count')
        ).filter(
            Detection.detection_date >= start_date
        ).group_by(
            func.date(Detection.detection_date)
        ).order_by('date').all()
        
        return [{"date": str(r.date), "count": r.count} for r in results]
    
    @staticmethod
    def get_caries_distribution(db: Session) -> List[Dict[str, Any]]:
        """
        Get caries count by severity
        Note: This is a simplified version. Adjust based on your actual schema.
        """
        # Get all detections
        detections = db.query(Detection).all()
        
        # Categorize by caries count
        mild = sum(1 for d in detections if 0 < d.total_caries_detected <= 2)
        moderate = sum(1 for d in detections if 2 < d.total_caries_detected <= 5)
        severe = sum(1 for d in detections if d.total_caries_detected > 5)
        
        return [
            {"severity": "mild", "count": mild},
            {"severity": "moderate", "count": moderate},
            {"severity": "severe", "count": severe}
        ]
    
    @staticmethod
    def get_patient_growth(db: Session, days: int = 90) -> List[Dict[str, Any]]:
        """Get new patient registrations over time"""
        start_date = datetime.now() - timedelta(days=days)
        
        results = db.query(
            func.date(User.created_at).label('date'),
            func.count(User.id).label('count')
        ).filter(
            User.role == 'PATIENT',
            User.created_at >= start_date
        ).group_by(
            func.date(User.created_at)
        ).order_by('date').all()
        
        return [{"date": str(r.date), "count": r.count} for r in results]
    
    @staticmethod
    def get_appointment_stats(db: Session) -> Dict[str, int]:
        """Get appointment statistics by status"""
        stats = db.query(
            Appointment.status,
            func.count(Appointment.id).label('count')
        ).group_by(Appointment.status).all()
        
        result = {
            'scheduled': 0,
            'confirmed': 0,
            'completed': 0,
            'cancelled': 0,
            'no_show': 0
        }
        
        for stat in stats:
            if stat.status in result:
                result[stat.status] = stat.count
        
        return result
    
    @staticmethod
    def save_health_score(db: Session, patient_id: str, score: int) -> HealthScore:
        """Save health score to history"""
        # Get total stats
        total_detections = db.query(func.count(Detection.id)).filter(
            Detection.patient_id == patient_id
        ).scalar() or 0
        
        total_caries = db.query(func.sum(Detection.total_caries_detected)).filter(
            Detection.patient_id == patient_id
        ).scalar() or 0
        
        # Get last checkup date
        last_detection = db.query(Detection).filter(
            Detection.patient_id == patient_id
        ).order_by(Detection.detection_date.desc()).first()
        
        last_checkup = last_detection.detection_date if last_detection else None
        
        # Create health score record
        health_score = HealthScore(
            patient_id=patient_id,
            score=score,
            total_detections=total_detections,
            total_caries=total_caries,
            last_checkup_date=last_checkup
        )
        
        db.add(health_score)
        db.commit()
        db.refresh(health_score)
        
        return health_score
    
    @staticmethod
    def get_health_score_trend(db: Session, patient_id: str) -> str:
        """Determine if health score is improving, declining, or stable"""
        scores = db.query(HealthScore).filter(
            HealthScore.patient_id == patient_id
        ).order_by(HealthScore.calculated_at.desc()).limit(2).all()
        
        if len(scores) < 2:
            return "stable"
        
        if scores[0].score > scores[1].score:
            return "improving"
        elif scores[0].score < scores[1].score:
            return "declining"
        else:
            return "stable"
    
    @staticmethod
    def get_health_history(db: Session, patient_id: str, days: int = 180) -> List[Dict[str, Any]]:
        """Get patient's health score history"""
        start_date = datetime.now() - timedelta(days=days)
        
        history = db.query(HealthScore).filter(
            HealthScore.patient_id == patient_id,
            HealthScore.calculated_at >= start_date
        ).order_by(HealthScore.calculated_at).all()
        
        return [
            {
                "date": h.calculated_at.isoformat(),
                "score": h.score,
                "total_caries": h.total_caries
            }
            for h in history
        ]
    
    @staticmethod
    def get_detection_history(db: Session, patient_id: str) -> List[Dict[str, Any]]:
        """Get patient's detection history for charts"""
        detections = db.query(Detection).filter(
            Detection.patient_id == patient_id
        ).order_by(Detection.detection_date).all()
        
        return [
            {
                "date": d.detection_date.isoformat(),
                "caries_count": d.total_caries_detected,
                "detection_id": str(d.id)
            }
            for d in detections
        ]
