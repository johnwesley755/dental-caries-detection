from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from typing import List, Optional
from datetime import datetime
import uuid
import os
import shutil

from app.database import get_db
from app.models.user import User
from app.models.conversation import Conversation
from app.models.message import Message
from app.api.dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/messaging", tags=["messaging"])

# Pydantic schemas
class MessageCreate(BaseModel):
    receiver_id: str
    content: Optional[str] = None

class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    sender_id: str
    receiver_id: str
    content: Optional[str]
    file_url: Optional[str]
    file_name: Optional[str]
    file_type: Optional[str]
    file_size: Optional[int]
    is_read: bool
    created_at: datetime
    sender_name: str
    receiver_name: str

class ConversationResponse(BaseModel):
    id: str
    patient_id: str
    dentist_id: str
    last_message_at: Optional[datetime]
    other_user_id: str
    other_user_name: str
    other_user_role: str
    unread_count: int
    last_message: Optional[str]

class UnreadCountResponse(BaseModel):
    count: int

# Helper function to get or create conversation
def get_or_create_conversation(db: Session, user1_id: uuid.UUID, user2_id: uuid.UUID):
    # Determine who is patient and who is dentist
    user1 = db.query(User).filter(User.id == user1_id).first()
    user2 = db.query(User).filter(User.id == user2_id).first()
    
    if user1.role.value == "PATIENT":
        patient_id, dentist_id = user1_id, user2_id
    else:
        patient_id, dentist_id = user2_id, user1_id
    
    # Check if conversation exists
    conversation = db.query(Conversation).filter(
        Conversation.patient_id == patient_id,
        Conversation.dentist_id == dentist_id
    ).first()
    
    if not conversation:
        conversation = Conversation(
            patient_id=patient_id,
            dentist_id=dentist_id
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    
    return conversation

@router.get("/conversations", response_model=List[ConversationResponse])
async def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all conversations for the current user"""
    
    # Get conversations where user is either patient or dentist
    conversations = db.query(Conversation).filter(
        or_(
            Conversation.patient_id == current_user.id,
            Conversation.dentist_id == current_user.id
        )
    ).order_by(desc(Conversation.last_message_at)).all()
    
    result = []
    for conv in conversations:
        # Determine the other user
        if str(conv.patient_id) == str(current_user.id):
            other_user = conv.dentist
            other_user_id = str(conv.dentist_id)
        else:
            other_user = conv.patient
            other_user_id = str(conv.patient_id)
        
        # Get unread count
        unread_count = db.query(Message).filter(
            Message.conversation_id == conv.id,
            Message.receiver_id == current_user.id,
            Message.is_read == False
        ).count()
        
        # Get last message
        last_msg = db.query(Message).filter(
            Message.conversation_id == conv.id
        ).order_by(desc(Message.created_at)).first()
        
        result.append(ConversationResponse(
            id=str(conv.id),
            patient_id=str(conv.patient_id),
            dentist_id=str(conv.dentist_id),
            last_message_at=conv.last_message_at,
            other_user_id=other_user_id,
            other_user_name=other_user.full_name,
            other_user_role=other_user.role.value,
            unread_count=unread_count,
            last_message=last_msg.content if last_msg else None
        ))
    
    return result

@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageResponse])
async def get_messages(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all messages in a conversation"""
    
    # Verify user is part of this conversation
    conversation = db.query(Conversation).filter(Conversation.id == uuid.UUID(conversation_id)).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if str(conversation.patient_id) != str(current_user.id) and str(conversation.dentist_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to view this conversation")
    
    # Get messages
    messages = db.query(Message).filter(
        Message.conversation_id == uuid.UUID(conversation_id)
    ).order_by(Message.created_at).all()
    
    # Mark messages as read
    db.query(Message).filter(
        Message.conversation_id == uuid.UUID(conversation_id),
        Message.receiver_id == current_user.id,
        Message.is_read == False
    ).update({"is_read": True})
    db.commit()
    
    result = []
    for msg in messages:
        result.append(MessageResponse(
            id=str(msg.id),
            conversation_id=str(msg.conversation_id),
            sender_id=str(msg.sender_id),
            receiver_id=str(msg.receiver_id),
            content=msg.content,
            file_url=msg.file_url,
            file_name=msg.file_name,
            file_type=msg.file_type,
            file_size=msg.file_size,
            is_read=msg.is_read,
            created_at=msg.created_at,
            sender_name=msg.sender.full_name,
            receiver_name=msg.receiver.full_name
        ))
    
    return result

@router.post("/messages", response_model=MessageResponse)
async def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a new message"""
    
    receiver_id = uuid.UUID(message_data.receiver_id)
    
    # Verify receiver exists
    receiver = db.query(User).filter(User.id == receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
    # Get or create conversation
    conversation = get_or_create_conversation(db, current_user.id, receiver_id)
    
    # Create message
    message = Message(
        conversation_id=conversation.id,
        sender_id=current_user.id,
        receiver_id=receiver_id,
        content=message_data.content
    )
    
    db.add(message)
    
    # Update conversation last_message_at
    conversation.last_message_at = datetime.utcnow()
    
    db.commit()
    db.refresh(message)
    
    return MessageResponse(
        id=str(message.id),
        conversation_id=str(message.conversation_id),
        sender_id=str(message.sender_id),
        receiver_id=str(message.receiver_id),
        content=message.content,
        file_url=message.file_url,
        file_name=message.file_name,
        file_type=message.file_type,
        file_size=message.file_size,
        is_read=message.is_read,
        created_at=message.created_at,
        sender_name=current_user.full_name,
        receiver_name=receiver.full_name
    )

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload a file attachment"""
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="File type not allowed")
    
    # Validate file size (10MB max)
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > 10 * 1024 * 1024:  # 10MB
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")
    
    # Create uploads directory if it doesn't exist
    upload_dir = "uploads/messages"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {
        "file_url": f"/{file_path}",
        "file_name": file.filename,
        "file_type": file.content_type,
        "file_size": file_size
    }

@router.post("/messages/with-file", response_model=MessageResponse)
async def send_message_with_file(
    receiver_id: str,
    content: Optional[str] = None,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message with file attachment"""
    
    # Upload file first
    file_data = await upload_file(file, current_user)
    
    receiver_uuid = uuid.UUID(receiver_id)
    
    # Verify receiver exists
    receiver = db.query(User).filter(User.id == receiver_uuid).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
    # Get or create conversation
    conversation = get_or_create_conversation(db, current_user.id, receiver_uuid)
    
    # Create message with file
    message = Message(
        conversation_id=conversation.id,
        sender_id=current_user.id,
        receiver_id=receiver_uuid,
        content=content,
        file_url=file_data["file_url"],
        file_name=file_data["file_name"],
        file_type=file_data["file_type"],
        file_size=file_data["file_size"]
    )
    
    db.add(message)
    
    # Update conversation last_message_at
    conversation.last_message_at = datetime.utcnow()
    
    db.commit()
    db.refresh(message)
    
    return MessageResponse(
        id=str(message.id),
        conversation_id=str(message.conversation_id),
        sender_id=str(message.sender_id),
        receiver_id=str(message.receiver_id),
        content=message.content,
        file_url=message.file_url,
        file_name=message.file_name,
        file_type=message.file_type,
        file_size=message.file_size,
        is_read=message.is_read,
        created_at=message.created_at,
        sender_name=current_user.full_name,
        receiver_name=receiver.full_name
    )

@router.get("/unread-count", response_model=UnreadCountResponse)
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get total unread message count for current user"""
    
    count = db.query(Message).filter(
        Message.receiver_id == current_user.id,
        Message.is_read == False
    ).count()
    
    return UnreadCountResponse(count=count)

@router.put("/messages/{message_id}/read")
async def mark_message_read(
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a message as read"""
    
    message = db.query(Message).filter(
        Message.id == uuid.UUID(message_id),
        Message.receiver_id == current_user.id
    ).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message.is_read = True
    db.commit()
    
    return {"status": "success"}
