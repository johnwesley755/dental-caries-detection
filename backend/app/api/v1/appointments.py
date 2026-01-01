# backend/app/api/v1/appointments.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ...core.database import get_db
from ...dependencies.auth import get_current_user
from ...models.user import User, UserRole
from ...models.appointment import Appointment, AppointmentStatus
from ...models.patient import Patient
from ...models.notification import Notification, NotificationType
from pydantic import BaseModel
from typing import Optional

router = APIRouter(tags=["appointments"])

# Schemas
class AppointmentCreate(BaseModel):
    patient_id: str
    appointment_date: datetime
    duration_minutes: str = "30"
    appointment_type: str = "checkup"
    notes: Optional[str] = None

class AppointmentUpdate(BaseModel):
    appointment_date: Optional[datetime] = None
    duration_minutes: Optional[str] = None
    status: Optional[AppointmentStatus] = None
    appointment_type: Optional[str] = None
    notes: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: str
    patient_id: str
    patient_name: str
    dentist_id: str
    dentist_name: str
    appointment_date: datetime
    duration_minutes: str
    status: str
    appointment_type: str
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Helper function to create notification
def create_appointment_notification(db: Session, patient_id: str, appointment_date: datetime, action: str):
    """Create notification for appointment"""
    try:
        # Get patient's user_id if they have portal access
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if patient and patient.user_id:
            notification = Notification(
                user_id=str(patient.user_id),
                title=f"Appointment {action}",
                message=f"Your appointment has been {action} for {appointment_date.strftime('%B %d, %Y at %I:%M %p')}",
                type=NotificationType.APPOINTMENT
            )
            db.add(notification)
            db.commit()
    except Exception as e:
        print(f"Error creating notification: {e}")

# Endpoints
@router.get("/appointments", response_model=List[AppointmentResponse])
async def get_appointments(
    status: Optional[str] = None,
    patient_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all appointments (filtered by status or patient)"""
    query = db.query(Appointment)
    
    # Filter by patient if specified
    if patient_id:
        query = query.filter(Appointment.patient_id == patient_id)
    
    # Filter by status if specified
    if status:
        query = query.filter(Appointment.status == status)
    
    # If user is a patient, only show their appointments
    if current_user.role == UserRole.PATIENT:
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if patient:
            query = query.filter(Appointment.patient_id == str(patient.id))
        else:
            return []
    
    appointments = query.order_by(Appointment.appointment_date.desc()).all()
    
    # Format response
    result = []
    for appt in appointments:
        patient = db.query(Patient).filter(Patient.id == appt.patient_id).first()
        dentist = db.query(User).filter(User.id == appt.dentist_id).first()
        
        result.append({
            "id": appt.id,
            "patient_id": appt.patient_id,
            "patient_name": patient.full_name if patient else "Unknown",
            "dentist_id": appt.dentist_id,
            "dentist_name": dentist.full_name if dentist else "Unknown",
            "appointment_date": appt.appointment_date,
            "duration_minutes": appt.duration_minutes,
            "status": appt.status.value,
            "appointment_type": appt.appointment_type,
            "notes": appt.notes,
            "created_at": appt.created_at
        })
    
    return result

@router.post("/appointments", response_model=dict)
async def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new appointment"""
    
    # Verify patient exists
    patient = db.query(Patient).filter(Patient.id == appointment.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Create appointment
    new_appointment = Appointment(
        patient_id=appointment.patient_id,
        dentist_id=str(current_user.id),
        appointment_date=appointment.appointment_date,
        duration_minutes=appointment.duration_minutes,
        appointment_type=appointment.appointment_type,
        notes=appointment.notes,
        status=AppointmentStatus.SCHEDULED
    )
    
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    
    # Create notification
    create_appointment_notification(db, appointment.patient_id, appointment.appointment_date, "scheduled")
    
    return {
        "message": "Appointment created successfully",
        "appointment_id": new_appointment.id
    }

@router.put("/appointments/{appointment_id}", response_model=dict)
async def update_appointment(
    appointment_id: str,
    appointment_update: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an appointment"""
    
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Update fields
    if appointment_update.appointment_date:
        appointment.appointment_date = appointment_update.appointment_date
    if appointment_update.duration_minutes:
        appointment.duration_minutes = appointment_update.duration_minutes
    if appointment_update.status:
        appointment.status = appointment_update.status
    if appointment_update.appointment_type:
        appointment.appointment_type = appointment_update.appointment_type
    if appointment_update.notes is not None:
        appointment.notes = appointment_update.notes
    
    appointment.updated_at = datetime.utcnow()
    
    db.commit()
    
    # Create notification if status changed
    if appointment_update.status:
        create_appointment_notification(
            db, 
            appointment.patient_id, 
            appointment.appointment_date, 
            appointment_update.status.value
        )
    
    return {"message": "Appointment updated successfully"}

@router.delete("/appointments/{appointment_id}")
async def delete_appointment(
    appointment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cancel/Delete an appointment"""
    
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Update status to cancelled instead of deleting
    appointment.status = AppointmentStatus.CANCELLED
    appointment.updated_at = datetime.utcnow()
    
    db.commit()
    
    # Create notification
    create_appointment_notification(db, appointment.patient_id, appointment.appointment_date, "cancelled")
    
    return {"message": "Appointment cancelled successfully"}
