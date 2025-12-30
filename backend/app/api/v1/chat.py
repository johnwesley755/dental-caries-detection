# backend/app/api/v1/chat.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from ...core.database import get_db
from ...dependencies.auth import get_current_user
from ...models.user import User
from ...models.chat import ChatMessage
from ...schemas.chat import (
    ChatMessageCreate,
    ChatMessageResponse,
    ChatHistoryResponse,
    DetectionContext
)
from ...services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/", response_model=ChatMessageResponse, status_code=status.HTTP_201_CREATED)
async def send_chat_message(
    message_data: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Send a message to the chatbot and get a response.
    
    **Patient-only endpoint**
    
    The chatbot helps patients understand their dental scan results.
    It does NOT provide medical advice, diagnosis, or prescriptions.
    """
    
    # Verify user is a patient
    if current_user.role.upper() != "PATIENT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chatbot is only available for patients"
        )
    
    # Generate response using ChatService
    response_data = ChatService.generate_response(
        db=db,
        user_id=str(current_user.id),
        user_message=message_data.message,
        detection_id=str(message_data.detection_id) if message_data.detection_id else None
    )
    
    # Save chat message to database
    chat_message = ChatService.save_chat_message(
        db=db,
        user_id=str(current_user.id),
        detection_id=str(message_data.detection_id) if message_data.detection_id else None,
        user_message=message_data.message,
        bot_response=response_data["bot_response"]
    )
    
    # Build response
    detection_context = None
    if response_data["detection_context"]:
        ctx = response_data["detection_context"]
        detection_context = DetectionContext(
            detection_id=UUID(ctx["detection_id"]),
            severity=ctx["severity"],
            total_caries=ctx["total_caries"],
            confidence_avg=ctx["confidence_avg"]
        )
    
    return ChatMessageResponse(
        id=chat_message.id,
        user_message=chat_message.user_message,
        bot_response=chat_message.bot_response,
        detection_context=detection_context,
        created_at=chat_message.created_at
    )

@router.get("/history", response_model=ChatHistoryResponse)
async def get_chat_history(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get chat history for the current user.
    
    **Patient-only endpoint**
    """
    
    # Verify user is a patient
    if current_user.role.upper() != "PATIENT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chatbot is only available for patients"
        )
    
    # Get chat messages
    messages = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id
    ).order_by(
        ChatMessage.created_at.desc()
    ).limit(limit).all()
    
    total = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id
    ).count()
    
    # Convert to response format
    message_responses = []
    for msg in reversed(messages):  # Reverse to show oldest first
        message_responses.append(ChatMessageResponse(
            id=msg.id,
            user_message=msg.user_message,
            bot_response=msg.bot_response,
            detection_context=None,  # Not including context in history for simplicity
            created_at=msg.created_at
        ))
    
    return ChatHistoryResponse(
        messages=message_responses,
        total=total
    )
