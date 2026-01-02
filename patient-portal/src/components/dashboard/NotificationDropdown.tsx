// frontend/src/components/dashboard/NotificationDropdown.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck } from 'lucide-react';
import { notificationService, type Notification } from '../../services/notificationService';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { createPortal } from 'react-dom';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 384; // w-96 = 24rem = 384px
      
      // Calculate left position, ensuring dropdown doesn't go off-screen
      let leftPos = rect.right - dropdownWidth;
      
      // If dropdown would go off left edge, align with button's left edge instead
      if (leftPos < 8) {
        leftPos = rect.left;
      }
      
      // If dropdown would go off right edge, align right edge with screen
      if (leftPos + dropdownWidth > window.innerWidth - 8) {
        leftPos = window.innerWidth - dropdownWidth - 8;
      }
      
      setDropdownPosition({
        top: rect.bottom + 8,
        left: leftPos,
      });
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications(false, 20);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count');
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      detection: '🔍',
      appointment: '📅',
      report: '📄',
      system: '⚙️',
      reminder: '🔔',
    };
    return icons[type as keyof typeof icons] || '📬';
  };

  return (
    <>
      {/* Bell Icon Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Portal */}
      {isOpen && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div 
            className="fixed w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] max-h-[600px] overflow-hidden flex flex-col"
            style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-500">{unreadCount} unread</p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2">Loading...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.is_read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {notification.title}
                            </h4>
                            <button
                              onClick={() => handleDelete(notification.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </span>
                            {!notification.is_read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                              >
                                <Check className="h-3 w-3" />
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to notifications page if you have one
                  }}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>,
        document.body
      )}
    </>
  );
};
