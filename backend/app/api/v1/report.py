from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.orm import Session, joinedload
from uuid import UUID
from pydantic import BaseModel, EmailStr
from typing import Optional

from ...core.database import get_db
from ...models.user import User
from ...models.detection import Detection
from ...models.patient import Patient
from ...services.report_service import ReportService
from ...services.email_service import EmailService
from ...dependencies.auth import get_current_user, get_current_active_dentist
from datetime import datetime

router = APIRouter(prefix="/reports", tags=["reports"])

report_service = ReportService()
email_service = EmailService()


class EmailReportRequest(BaseModel):
    """Request model for emailing a report"""
    recipient_email: EmailStr
    cc_email: Optional[EmailStr] = None


@router.get("/detection/{detection_id}/pdf")
async def download_detection_report(
    detection_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Download PDF report for a detection
    
    - Dentists can download any detection report
    - Patients can only download their own detection reports
    """
    # Get detection
    detection = db.query(Detection).filter(Detection.id == detection_id).first()
    
    if not detection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Detection not found"
        )
    
    # Check permissions
    if current_user.role.value == "patient":
        # Patients can only view their own detections
        if detection.patient_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this detection"
            )
    
    # Get patient
    patient = db.query(Patient).filter(Patient.id == detection.patient_id).first()
    
    # Get dentist profile info with eager loading
    dentist = None
    if detection.dentist_id:
        dentist = db.query(User).options(joinedload(User.profile)).filter(User.id == detection.dentist_id).first()
    
    try:
        # Generate PDF
        pdf_bytes = report_service.generate_detection_report(
            detection=detection,
            patient=patient,
            dentist=dentist,
            include_images=True
        )
        
        # Return PDF as download
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=Detection_Report_{detection.detection_id}.pdf"
            }
        )
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate PDF report: {str(e)}"
        )


@router.post("/detection/{detection_id}/email")
async def email_detection_report(
    detection_id: UUID,
    email_data: EmailReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_dentist)
):
    """
    Email PDF report for a detection
    
    Only dentists and admins can email reports
    """
    # Get detection
    detection = db.query(Detection).filter(Detection.id == detection_id).first()
    
    if not detection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Detection not found"
        )
    
    # Get patient
    patient = db.query(Patient).filter(Patient.id == detection.patient_id).first()
    
    # Get dentist profile info with eager loading
    dentist = None
    if detection.dentist_id:
        dentist = db.query(User).options(joinedload(User.profile)).filter(User.id == detection.dentist_id).first()
        
    try:
        # Generate PDF
        pdf_bytes = report_service.generate_detection_report(
            detection=detection,
            patient=patient,
            dentist=dentist,
            include_images=True
        )
        
        # Prepare summary stats
        summary_stats = {
            "teeth_detected": detection.total_teeth_detected,
            "caries_found": detection.total_caries_detected,
            "status": detection.status.value
        }
        
        # Format detection date
        detection_date = datetime.fromisoformat(str(detection.detection_date)).strftime('%B %d, %Y')
        
        # Send email
        clinic_name = dentist.profile.clinic_name if dentist and dentist.profile else None
        
        success = email_service.send_detection_report(
            to_email=email_data.recipient_email,
            patient_name=patient.full_name,
            detection_id=detection.detection_id,
            detection_date=detection_date,
            summary_stats=summary_stats,
            pdf_bytes=pdf_bytes,
            cc_email=email_data.cc_email,
            clinic_name=clinic_name
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send email"
            )
        
        return {
            "message": "Report sent successfully",
            "recipient": email_data.recipient_email,
            "detection_id": detection.detection_id
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send report: {str(e)}"
        )

@router.get("/dashboard/pdf")
async def download_dashboard_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_dentist)
):
    """
    Download a summary PDF report for the entire clinic
    Only dentists and admins can access this report
    """
    try:
        # Get all patients
        patients = db.query(Patient).all()
        
        # Get all detections
        detections = db.query(Detection).all()
        
        # Generate PDF
        pdf_bytes = report_service.generate_dashboard_report(
            patients=patients,
            detections=detections,
            dentist=current_user
        )
        
        # Return PDF as download
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=Clinic_Intelligence_Summary_{datetime.now().strftime('%Y%m%d')}.pdf"
            }
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate dashboard report: {str(e)}"
        )
