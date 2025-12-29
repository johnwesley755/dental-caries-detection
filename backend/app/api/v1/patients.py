from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from ...core.database import get_db
from ...schemas.patient import PatientCreate, PatientUpdate, PatientResponse
from ...services.patient_service import PatientService
from ...dependencies.auth import get_current_active_dentist
from ...models.user import User

router = APIRouter()

@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_dentist)
):
    """Create new patient"""
    return PatientService.create_patient(db, patient, current_user.id)

@router.get("/", response_model=List[PatientResponse])
async def get_patients(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_dentist)
):
    """Get all patients"""
    return PatientService.get_patients(db, skip, limit)

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_dentist)
):
    """Get patient by ID"""
    patient = PatientService.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.put("/{patient_id}", response_model=PatientResponse)
async def update_patient(
    patient_id: UUID,
    patient_update: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_dentist)
):
    """Update patient"""
    return PatientService.update_patient(db, patient_id, patient_update)

@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient(
    patient_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_dentist)
):
    """Delete patient"""
    PatientService.delete_patient(db, patient_id)