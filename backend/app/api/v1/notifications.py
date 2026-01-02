# backend/app/api/v1/notifications.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ...core.database import get_db
from ...dependencies.auth import get_current_user
from ...models.user import User
from ...models.notification import Notification, NotificationType
from pydantic import BaseModel
from typing import Optional

router = APIRouter(tags=["notifications"])

# Schemas
class NotificationCreate(BaseModel):
    user_id: str
    title: str
    message: str
    type: NotificationType = NotificationType.SYSTEM
    related_id: Optional[str] = None
    related_type: Optional[str] = None

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    type: str
    is_read: bool
    related_id: Optional[str]
    related_type: Optional[str]
    created_at: datetime
    read_at: Optional[datetime]

    class Config:
        from_attributes = True

# Endpoints
@router.get("/notifications", response_model=List[NotificationResponse])
async def get_notifications(
    unread_only: bool = False,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get notifications for current user"""
    
    query = db.query(Notification).filter(Notification.user_id == str(current_user.id))
    
    if unread_only:
        query = query.filter(Notification.is_read == False)
    
    notifications = query.order_by(Notification.created_at.desc()).limit(limit).all()
    
    return [
        {
            "id": str(n.id),
            "user_id": str(n.user_id),
            "title": n.title,
            "message": n.message,
            "type": n.type.value,
            "is_read": n.is_read,
            "related_id": str(n.related_id) if n.related_id else None,
            "related_type": n.related_type,
            "created_at": n.created_at,
            "read_at": n.read_at
        }
        for n in notifications
    ]

@router.get("/notifications/unread-count")
async def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get count of unread notifications"""
    
    count = db.query(Notification).filter(
        Notification.user_id == str(current_user.id),
        Notification.is_read == False
    ).count()
    
    return {"unread_count": count}

@router.put("/notifications/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark notification as read"""
    
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == str(current_user.id)
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    notification.read_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Notification marked as read"}

@router.put("/notifications/mark-all-read")
async def mark_all_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark all notifications as read"""
    
    db.query(Notification).filter(
        Notification.user_id == str(current_user.id),
        Notification.is_read == False
    ).update({
        "is_read": True,
        "read_at": datetime.utcnow()
    })
    
    db.commit()
    
    return {"message": "All notifications marked as read"}

@router.delete("/notifications/{notification_id}")
async def delete_notification(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a notification"""
    
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == str(current_user.id)
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    db.delete(notification)
    db.commit()
    
    return {"message": "Notification deleted successfully"}

@router.post("/notifications", response_model=dict)
async def create_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new notification (admin/system use)"""
    
    new_notification = Notification(
        user_id=notification.user_id,
        title=notification.title,
        message=notification.message,
        type=notification.type,
        related_id=notification.related_id,
        related_type=notification.related_type
    )
    
    db.add(new_notification)
    db.commit()
    db.refresh(new_notification)
    
    return {
        "message": "Notification created successfully",
        "notification_id": new_notification.id
    }
