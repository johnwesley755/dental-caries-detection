// frontend/src/components/dashboard/NotificationDropdown.tsx
import React, { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, BriefcaseMedical, CalendarDays, FileText, Settings, BellRing, Inbox } from 'lucide-react';
import { notificationService, type Notification } from '../../services/notificationService';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

// ─── Notification type meta ────────────────────────────────────────────────
interface NotificationMeta {
  icon: React.ReactNode;
  dot: string;
  badge: string;
}

const getNotificationMeta = (type: string): NotificationMeta => {
  switch (type) {
    case 'detection':
      return {
        icon: <BriefcaseMedical className="h-4 w-4 text-[#003d9b]" />,
        dot: 'bg-[#003d9b]',
        badge: 'bg-[#dae2ff] text-[#003d9b]',
      };
    case 'appointment':
      return {
        icon: <CalendarDays className="h-4 w-4 text-violet-600" />,
        dot: 'bg-violet-500',
        badge: 'bg-violet-50 text-violet-600',
      };
    case 'report':
      return {
        icon: <FileText className="h-4 w-4 text-emerald-600" />,
        dot: 'bg-emerald-500',
        badge: 'bg-emerald-50 text-emerald-700',
      };
    case 'system':
      return {
        icon: <Settings className="h-4 w-4 text-slate-500" />,
        dot: 'bg-slate-400',
        badge: 'bg-slate-100 text-slate-600',
      };
    case 'reminder':
      return {
        icon: <BellRing className="h-4 w-4 text-amber-600" />,
        dot: 'bg-amber-400',
        badge: 'bg-amber-50 text-amber-700',
      };
    default:
      return {
        icon: <Inbox className="h-4 w-4 text-slate-400" />,
        dot: 'bg-slate-300',
        badge: 'bg-slate-50 text-slate-500',
      };
  }
};

// ─── Single notification row ───────────────────────────────────────────────
interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkRead, onDelete }) => {
  const meta = getNotificationMeta(notification.type);

  return (
    <div
      className={`group relative px-4 py-3.5 transition-colors hover:bg-slate-50 ${
        !notification.is_read ? 'bg-[#eaedff]/40' : ''
      }`}
    >
      {/* Unread left accent bar */}
      {!notification.is_read && (
        <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-[#003d9b]" />
      )}

      <div className="flex items-start gap-3">
        {/* Icon chip */}
        <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${meta.badge}`}>
          {meta.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm leading-snug ${notification.is_read ? 'font-medium text-slate-700' : 'font-semibold text-slate-900'}`}>
              {notification.title}
            </p>

            {/* Actions — visible on hover */}
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.is_read && (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-slate-400 hover:text-[#003d9b] hover:bg-[#eaedff]"
                        onClick={() => onMarkRead(notification.id)}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">Mark as read</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => onDelete(notification.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">Delete</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>

          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-slate-400 font-medium">
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${meta.badge}`}>
              {notification.type}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Skeleton loader ──────────────────────────────────────────────────────
const NotificationSkeleton = () => (
  <div className="px-4 py-3.5 space-y-2.5">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-start gap-3">
        <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-3/4 rounded" />
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Main Dropdown ─────────────────────────────────────────────────────────
export const NotificationDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Reload notifications when opening
  useEffect(() => {
    if (open) loadNotifications();
  }, [open]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications(false, 20);
      setNotifications(data);
    } catch {
      console.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch {
      console.error('Failed to load unread count');
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (notifications.find(n => n.id === id && !n.is_read)) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-slate-400 hover:text-[#003d9b] transition-colors hover:bg-[#eaedff] rounded-xl">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-[#003d9b] text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[380px] p-0 rounded-2xl border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#dae2ff] rounded-xl flex items-center justify-center">
              <Bell className="h-4 w-4 text-[#003d9b]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-none">Notifications</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-7 px-2.5 text-xs font-semibold text-[#003d9b] hover:bg-[#eaedff] hover:text-[#003d9b] gap-1.5"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        {/* ── List ── */}
        <ScrollArea className="max-h-[420px]">
          {loading ? (
            <NotificationSkeleton />
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                <Inbox className="h-7 w-7 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-500">No notifications yet</p>
              <p className="text-xs text-slate-400 mt-1">We'll notify you when something arrives</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* ── Footer ── */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="px-4 py-2.5 bg-slate-50/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 text-xs font-semibold text-[#003d9b] hover:bg-[#eaedff]"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};