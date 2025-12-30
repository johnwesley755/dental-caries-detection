# backend/app/schemas/chat.py
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional

class ChatMessageCreate(BaseModel):
    """Schema for creating a new chat message"""
    message: str
    detection_id: Optional[UUID] = None

class DetectionContext(BaseModel):
    """Detection context included in chat response"""
    detection_id: UUID
    severity: Optional[str] = None
    total_caries: int
    confidence_avg: Optional[float] = None

class ChatMessageResponse(BaseModel):
    """Schema for chat message response"""
    id: UUID
    user_message: str
    bot_response: str
    detection_context: Optional[DetectionContext] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChatHistoryResponse(BaseModel):
    """Schema for chat history"""
    messages: list[ChatMessageResponse]
    total: int
