# backend/app/models/resource.py

from sqlalchemy import Column, String, Text, Boolean, Integer, DateTime, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from ..core.database import Base

class Resource(Base):
    __tablename__ = "resources"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    category = Column(String(50), nullable=False)  # Education, Hygiene, Nutrition, Treatment, Pediatric
    resource_type = Column(String(50), nullable=False)  # article, video, guide
    url = Column(String(500))
    thumbnail_url = Column(String(500))
    author = Column(String(100))
    source = Column(String(100))
    tags = Column(ARRAY(Text))
    is_featured = Column(Boolean, default=False)
    view_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
