// patient-portal/src/components/common/NotificationDropdown.tsx
import React, { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, BriefcaseMedical, CalendarDays, FileText, Settings, BellRing, Inbox } from 'lucide-react';
import { notificationService, type Notification } from '../../services/notificationService';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
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
        icon: <BriefcaseMedical className="h-4 w-4 text-primary" />,
        dot: 'bg-primary',
        badge: 'bg-blue-50 text-primary',
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
        !notification.is_read ? 'bg-blue-50/40' : ''
      }`}
    >
      {/* Unread left accent bar */}
      {!notification.is_read && (
        <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-primary" />
      )}

      <div className="flex items-start gap-3">
        {/* Icon chip */}
        <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${meta.badge}`}>
          {meta.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm leading-snug ${notification.is_read ? 'font-medium text-slate-700' : 'font-black text-slate-900 tracking-tight'}`}>
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
                        className="h-6 w-6 text-slate-400 hover:text-primary hover:bg-blue-50"
                        onClick={() => onMarkRead(notification.id)}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-[10px] font-black px-3 py-1.5">Mark as read</TooltipContent>
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
                  <TooltipContent side="top" className="text-[10px] font-black px-3 py-1.5">Delete</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-bold tracking-tight">
            {notification.message}
          </p>

          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-slate-400 font-black opacity-60">
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
            </span>
            <Badge variant="outline" className={`text-[10px] font-black px-2 py-0.5 rounded-lg border-none ${meta.badge}`}>
              {notification.type}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Skeleton loader ──────────────────────────────────────────────────────
const NotificationSkeleton = () => (
  <div className="px-4 py-3.5 space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-start gap-3">
        <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-3/4 rounded-lg" />
          <Skeleton className="h-2 w-full rounded-lg" />
          <Skeleton className="h-2 w-1/2 rounded-lg" />
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
      toast.success('All notifications marked as read', {
        className: 'font-black text-[10px]'
      });
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
        <button className="relative p-2.5 text-slate-400 hover:text-primary transition-all hover:bg-blue-50 rounded-2xl group border border-transparent active:scale-95">
          <Bell className="h-5 w-5 transform group-hover:rotate-12 transition-transform" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 min-w-[18px] h-[18px] bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white shadow-xl shadow-primary/20">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-[380px] p-0 rounded-[2rem] border-none shadow-2xl shadow-blue-900/10 overflow-hidden bg-white/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-[1.25rem] flex items-center justify-center shadow-inner">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight leading-none">Notifications Center</h3>
              <p className="text-[10px] text-slate-400 mt-1.5 font-bold">
                {unreadCount > 0 ? `${unreadCount} unread events` : 'System optimized'}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-8 px-3 text-[10px] font-black text-primary hover:bg-blue-50 hover:text-primary transition-all rounded-xl"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-2" />
              Clear all
            </Button>
          )}
        </div>

        {/* ── List ── */}
        <ScrollArea className="max-h-[420px] bg-slate-50/30">
          {loading ? (
            <NotificationSkeleton />
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-10 text-center space-y-6">
              <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-blue-900/5 ring-1 ring-slate-100">
                <Inbox className="h-8 w-8 text-slate-200" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-900 tracking-tight">Inbox Synchronized</p>
                <p className="text-[10px] text-slate-400 font-bold">Awaiting clinical diagnostic data</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100/50">
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
          <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-black">
              Audit level: {notifications.length} logged
            </span>
            <Button
              variant="ghost"
              size="sm"
                className="h-8 px-4 text-[10px] font-black text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
