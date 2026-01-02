# backend/app/models/notification.py
from sqlalchemy import Column, String, DateTime, Text, Boolean, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..core.database import Base
import uuid
from datetime import datetime
import enum

class NotificationType(str, enum.Enum):
    DETECTION = "detection"
    APPOINTMENT = "appointment"
    REPORT = "report"
    SYSTEM = "system"
    REMINDER = "reminder"

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)  # Can be dentist or patient
    
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(SQLEnum(NotificationType, values_callable=lambda x: [e.value for e in x]), default=NotificationType.SYSTEM)
    
    is_read = Column(Boolean, default=False)
    
    # Optional: link to related entity
    related_id = Column(String, nullable=True)  # ID of detection, appointment, etc.
    related_type = Column(String, nullable=True)  # "detection", "appointment", etc.
    
    created_at = Column(DateTime, default=datetime.utcnow)
    read_at = Column(DateTime, nullable=True)
