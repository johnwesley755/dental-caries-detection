from sqlalchemy.orm import Session
from ..models.patient import Patient
from ..schemas.patient import PatientCreate, PatientUpdate
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime
from fastapi import HTTPException, status

class PatientService:
    @staticmethod
    def generate_patient_id() -> str:
        """Generate unique patient ID"""
        return f"PAT-{datetime.now().strftime('%Y%m%d')}-{str(uuid4())[:8].upper()}"
    
    @staticmethod
    def create_patient(db: Session, patient: PatientCreate, user_id: UUID) -> Patient:
        """Create new patient"""
        db_patient = Patient(
            patient_id=PatientService.generate_patient_id(),
            full_name=patient.full_name,
            age=patient.age,
            gender=patient.gender,
            contact_number=patient.contact_number,
            email=patient.email,
            address=patient.address,
            medical_history=patient.medical_history,
            created_by=user_id
        )
        db.add(db_patient)
        db.commit()
        db.refresh(db_patient)
        return db_patient
    
    @staticmethod
    def get_patient(db: Session, patient_id: UUID) -> Optional[Patient]:
        """Get patient by ID"""
        return db.query(Patient).filter(Patient.id == patient_id).first()
    
    @staticmethod
    def get_patients(db: Session, skip: int = 0, limit: int = 100) -> List[Patient]:
        """Get all patients"""
        return db.query(Patient).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_patient(db: Session, patient_id: UUID, patient_update: PatientUpdate) -> Patient:
        """Update patient"""
        db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not db_patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        update_data = patient_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_patient, field, value)
        
        db.commit()
        db.refresh(db_patient)
        return db_patient
    
    @staticmethod
    def delete_patient(db: Session, patient_id: UUID) -> bool:
        """Delete patient"""
        db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not db_patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        db.delete(db_patient)
        db.commit()
        return True
