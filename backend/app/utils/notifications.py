# backend/app/utils/notifications.py
from sqlalchemy.orm import Session
from ..models.notification import Notification, NotificationType
from typing import Optional
import logging

logger = logging.getLogger(__name__)

def notify_user(
    db: Session,
    user_id: str,
    title: str,
    message: str,
    notification_type: NotificationType = NotificationType.SYSTEM,
    related_id: Optional[str] = None,
    related_type: Optional[str] = None
):
    """Utility function to create a notification for a user"""
    try:
        if not user_id:
            return None
            
        notification = Notification(
            user_id=str(user_id),
            title=title,
            message=message,
            type=notification_type,
            related_id=related_id,
            related_type=related_type,
            is_read=False
        )
        db.add(notification)
        db.commit()
        return notification
    except Exception as e:
        logger.error(f"Error creating notification for user {user_id}: {e}")
        db.rollback()
        return None
