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
from ...utils.notifications import notify_user

router = APIRouter(tags=["appointments"])

# Schemas
class AppointmentCreate(BaseModel):
    patient_id: Optional[str] = None
    dentist_id: Optional[str] = None # Important for patients choosing a dentist
    appointment_date: datetime
    duration_minutes: str = "30"
    appointment_type: str = "checkup"
    notes: Optional[str] = None
    detection_id: Optional[str] = None

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
    detection_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Helper function to create notification
def create_appointment_notification(db: Session, patient_id: str, appointment_date: datetime, action: str, dentist_id: Optional[str] = None, notify_dentist: bool = False, current_user_id: str = None):
    """Create notification for appointment"""
    try:
        # Get patient details
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            return

        formatted_date = appointment_date.strftime('%B %d, %Y at %I:%M %p')
        
        # 1. Notify the PATIENT (unless they performed the action themselves, e.g. cancellation)
        if patient.user_id and str(patient.user_id) != str(current_user_id):
            notify_user(
                db=db,
                user_id=str(patient.user_id),
                title=f"Appointment {action.capitalize()}",
                message=f"Your appointment for {formatted_date} has been {action}.",
                notification_type=NotificationType.APPOINTMENT
            )
            
        # 2. Notify the DENTIST (if we have their ID and they didn't perform the action)
        if dentist_id and str(dentist_id) != str(current_user_id):
             notify_user(
                db=db,
                user_id=str(dentist_id),
                title="Appointment Update",
                message=f"Appointment with {patient.full_name} for {formatted_date} has been {action}.",
                notification_type=NotificationType.APPOINTMENT
            )
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
        try:
            patient = db.query(Patient).filter(Patient.id == appt.patient_id).first()
            dentist = db.query(User).filter(User.id == appt.dentist_id).first()
            
            detection_id = getattr(appt, 'detection_id', None)

            result.append({
                "id": str(appt.id),
                "patient_id": str(appt.patient_id),
                "patient_name": patient.full_name if patient else "Unknown",
                "dentist_id": str(appt.dentist_id),
                "dentist_name": dentist.full_name if dentist else "Unknown",
                "appointment_date": appt.appointment_date,
                "duration_minutes": appt.duration_minutes,
                "status": appt.status.value if hasattr(appt.status, 'value') else str(appt.status),
                "appointment_type": appt.appointment_type,
                "notes": appt.notes,
                "detection_id": str(detection_id) if detection_id else None,
                "created_at": appt.created_at
            })
        except Exception as row_error:
            print(f"Skipping appointment {appt.id} due to error: {row_error}")
            continue
    
    return result

@router.post("/appointments", response_model=dict)
async def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new appointment"""
    
    # Auto-assign patient_id if not provided and user is a patient
    if not appointment.patient_id and current_user.role == UserRole.PATIENT:
        patient_record = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        
        # Auto-create patient profile if missing
        if not patient_record:
            import uuid
            new_patient = Patient(
                patient_id=f"PT-{str(uuid.uuid4())[:8].upper()}",
                full_name=current_user.full_name,
                email=current_user.email,
                user_id=current_user.id
            )
            db.add(new_patient)
            db.flush()
            patient_record = new_patient
            
        appointment.patient_id = str(patient_record.id)
            
    if not appointment.patient_id:
        raise HTTPException(status_code=400, detail="patient_id is required")
        
    # Verify patient exists
    patient = db.query(Patient).filter(Patient.id == appointment.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Determine appropriate dentist_id
    assigned_dentist_id = None
    initial_status = AppointmentStatus.SCHEDULED
    
    if current_user.role == UserRole.PATIENT:
        initial_status = AppointmentStatus.PENDING_APPROVAL
        
        target_dentist_id = appointment.dentist_id
        if not target_dentist_id and patient:
            target_dentist_id = str(patient.created_by)
            
        if not target_dentist_id:
            raise HTTPException(status_code=400, detail="dentist_id is required when a patient requests an appointment")
        
        # Verify that the chosen dentist actually is a dentist/admin
        dentist_check = db.query(User).filter(User.id == target_dentist_id).first()
        if not dentist_check or dentist_check.role == UserRole.PATIENT:
            raise HTTPException(status_code=400, detail="Invalid dentist_id provided")
        assigned_dentist_id = target_dentist_id
    else:
        # Dentist making an appointment for a patient
        assigned_dentist_id = appointment.dentist_id if appointment.dentist_id else str(current_user.id)
    
    # Create appointment
    new_appointment = Appointment(
        patient_id=appointment.patient_id,
        dentist_id=assigned_dentist_id,
        appointment_date=appointment.appointment_date,
        duration_minutes=appointment.duration_minutes,
        appointment_type=appointment.appointment_type,
        notes=appointment.notes,
        detection_id=appointment.detection_id,
        status=initial_status
    )
    
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    
    # Create notification depending on flow
    if current_user.role == UserRole.PATIENT:
        create_appointment_notification(
            db, 
            new_appointment.patient_id, 
            new_appointment.appointment_date, 
            "requested and is pending approval",
            new_appointment.dentist_id,
            current_user_id=current_user.id
        )
    else:
        create_appointment_notification(
            db, 
            new_appointment.patient_id, 
            new_appointment.appointment_date, 
            "scheduled",
            new_appointment.dentist_id,
            current_user_id=current_user.id
        )
    
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
            appointment_update.status.value,
            appointment.dentist_id,
            current_user_id=current_user.id
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
    create_appointment_notification(
        db, 
        appointment.patient_id, 
        appointment.appointment_date, 
        "cancelled",
        appointment.dentist_id,
        current_user_id=current_user.id
    )
    
    return {"message": "Appointment cancelled successfully"}
