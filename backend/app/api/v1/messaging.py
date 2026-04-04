from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, desc, func
from typing import List, Optional
from datetime import datetime, timezone
import uuid
import os
import shutil

from app.core.database import get_db
from ...models.user import User
from ...models.conversation import Conversation
from ...models.message import Message
from ...dependencies.auth import get_current_user
from ...services.image_service import ImageService
from pydantic import BaseModel
from ...utils.notifications import notify_user
from ...models.notification import NotificationType

router = APIRouter(prefix="/messaging", tags=["messaging"])
image_service = ImageService()

# Pydantic schemas
class MessageCreate(BaseModel):
    receiver_id: str
    content: Optional[str] = None
    detection_id: Optional[str] = None

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
    detection_id: Optional[str]
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

@router.get("/dentists", response_model=List[dict])
async def get_dentists(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all active dentists for patient selection"""
    from ...models.user import UserRole
    dentists = db.query(User).filter(
        User.role == UserRole.DENTIST,
        User.is_active == True,
        User.is_verified == True
    ).all()
    
    return [
        {
            "id": str(d.id),
            "full_name": d.full_name,
            "email": d.email,
            "role": d.role.value if hasattr(d.role, "value") else str(d.role)
        }
        for d in dentists
    ]

@router.get("/conversations", response_model=List[ConversationResponse])
async def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all conversations for the current user"""
    with open("/tmp/chat_debug.log", "a") as f:
        f.write(f"DEBUG: get_conversations for user {current_user.id} ({current_user.email})\n")
    # Get conversations with eagerly loaded users
    conversations = db.query(Conversation).options(
        joinedload(Conversation.patient),
        joinedload(Conversation.dentist)
    ).filter(
        or_(
            Conversation.patient_id == current_user.id,
            Conversation.dentist_id == current_user.id
        )
    ).order_by(desc(Conversation.last_message_at)).all()
    with open("/tmp/chat_debug.log", "a") as f:
        f.write(f"DEBUG: Found {len(conversations)} conversations\n")
    
    result = []
    for conv in conversations:
        # Determine the other user
        if str(conv.patient_id) == str(current_user.id):
            other_user = conv.dentist
            other_user_id = str(conv.dentist_id)
        else:
            other_user = conv.patient
            other_user_id = str(conv.patient_id)
        
        # Optimized unread count
        unread_count = db.query(func.count(Message.id)).filter(
            Message.conversation_id == conv.id,
            Message.receiver_id == current_user.id,
            Message.is_read == False
        ).scalar()
        
        # Get last message
        last_msg = db.query(Message).filter(
            Message.conversation_id == conv.id
        ).order_by(desc(Message.created_at)).first()
        
        last_message_preview = None
        if last_msg:
            if last_msg.content:
                last_message_preview = last_msg.content
            elif last_msg.file_url:
                if last_msg.file_type and last_msg.file_type.startswith('image/'):
                    last_message_preview = "📷 Photo"
                else:
                    last_message_preview = f"📎 {last_msg.file_name or 'File'}"
            elif last_msg.detection_id:
                last_message_preview = "🔍 New Detection"
            else:
                last_message_preview = "Sent a message"

        result.append(ConversationResponse(
            id=str(conv.id),
            patient_id=str(conv.patient_id),
            dentist_id=str(conv.dentist_id),
            last_message_at=conv.last_message_at,
            other_user_id=other_user_id,
            other_user_name=other_user.full_name if other_user else "Deleted User",
            other_user_role=other_user.role.value if other_user else "UNKNOWN",
            unread_count=unread_count,
            last_message=last_message_preview
        ))
    
    return result

@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageResponse])
async def get_messages(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    with open("/tmp/chat_debug.log", "a") as f:
        f.write(f"DEBUG: get_messages for conv {conversation_id} user {current_user.id}\n")
    # Verify user is part of this conversation
    conversation = db.query(Conversation).filter(Conversation.id == uuid.UUID(conversation_id)).first()
    if not conversation:
        with open("/tmp/chat_debug.log", "a") as f:
            f.write(f"DEBUG: Conversation {conversation_id} NOT FOUND\n")
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if str(conversation.patient_id) != str(current_user.id) and str(conversation.dentist_id) != str(current_user.id):
        with open("/tmp/chat_debug.log", "a") as f:
            f.write(f"DEBUG: User {current_user.id} NOT AUTHORIZED for conv {conversation_id}\n")
            f.write(f"DEBUG: Conv patient: {conversation.patient_id}, Conv dentist: {conversation.dentist_id}\n")
        raise HTTPException(status_code=403, detail="Not authorized to view this conversation")
    
    # Get messages with eagerly loaded sender and receiver
    messages = db.query(Message).options(
        joinedload(Message.sender),
        joinedload(Message.receiver)
    ).filter(
        Message.conversation_id == uuid.UUID(conversation_id)
    ).order_by(Message.created_at).all()
    with open("/tmp/chat_debug.log", "a") as f:
        f.write(f"DEBUG: Found {len(messages)} messages for conv {conversation_id}\n")
    
    # Mark messages as read in one query (already efficient but keeping it clean)
    db.query(Message).filter(
        Message.conversation_id == uuid.UUID(conversation_id),
        Message.receiver_id == current_user.id,
        Message.is_read == False
    ).update({"is_read": True}, synchronize_session=False)
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
            detection_id=str(msg.detection_id) if msg.detection_id else None,
            is_read=msg.is_read,
            created_at=msg.created_at,
            sender_name=msg.sender.full_name if msg.sender else "Deleted User",
            receiver_name=msg.receiver.full_name if msg.receiver else "Deleted User"
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
        content=message_data.content,
        detection_id=uuid.UUID(message_data.detection_id) if message_data.detection_id else None,
        is_read=False,
        created_at=datetime.now(timezone.utc)
    )
    
    db.add(message)
    
    # Update conversation last_message_at
    conversation.last_message_at = datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(message)
    
    # Notify receiver
    notify_user(
        db=db,
        user_id=str(receiver_id),
        title=f"New Message from {current_user.full_name}",
        message=message_data.content[:100] + "..." if message_data.content and len(message_data.content) > 100 else (message_data.content or "Sent an attachment"),
        notification_type=NotificationType.SYSTEM,
        related_id=str(message.id),
        related_type="message"
    )
    
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
        detection_id=str(message.detection_id) if message.detection_id else None,
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
    
    # Save using ImageService (which handles local + Cloudinary)
    upload_result = await image_service.save_upload_file(
        file, 
        upload_to_cloudinary=True, 
        folder="dental-caries/messages",
        delete_local=True
    )
    
    # Use Cloudinary URL if available, otherwise fallback to local path
    file_url = upload_result.get("cloudinary_url")
    if not file_url:
        file_url = f"/{upload_result['local_path']}"
    
    return {
        "file_url": file_url,
        "file_name": file.filename,
        "file_type": file.content_type,
        "file_size": file_size
    }

@router.post("/messages/with-file", response_model=MessageResponse)
async def send_message_with_file(
    receiver_id: str = Form(...),
    content: Optional[str] = Form(None),
    detection_id: Optional[str] = Form(None),
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
        file_size=file_data["file_size"],
        detection_id=uuid.UUID(detection_id) if detection_id else None,
        is_read=False,
        created_at=datetime.now(timezone.utc)
    )
    
    db.add(message)
    
    # Update conversation last_message_at
    conversation.last_message_at = datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(message)
    
    # Notify receiver
    notify_user(
        db=db,
        user_id=str(receiver_uuid),
        title=f"New Message from {current_user.full_name}",
        message=content[:100] + "..." if content and len(content) > 100 else (content or "Sent an attachment"),
        notification_type=NotificationType.SYSTEM,
        related_id=str(message.id),
        related_type="message"
    )
    
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
        detection_id=str(message.detection_id) if message.detection_id else None,
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
