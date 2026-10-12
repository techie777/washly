'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  KeyRound, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { AppNotification } from '@/types';

interface NotificationBellDrawerProps {
  onSelectBooking?: (bookingId: string) => void;
}

export default function NotificationBellDrawer({ onSelectBooking }: NotificationBellDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'otp'>('all');

  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'otp') {
      return (
        n.title.toLowerCase().includes('otp') ||
        n.message.toLowerCase().includes('otp') ||
        n.title.toLowerCase().includes('arrived')
      );
    }
    return true;
  });

  const formatRelativeTime = (iso: string) => {
    try {
      const diffMs = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      return new Date(iso).toLocaleDateString();
    } catch {
      return 'Recent';
    }
  };

  const getIcon = (type: AppNotification['type'], title: string) => {
    if (title.toLowerCase().includes('otp') || title.toLowerCase().includes('arrived')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <KeyRound className="w-4 h-4" />
        </div>
      );
    }
    if (title.toLowerCase().includes('en route') || title.toLowerCase().includes('assigned')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
          <Truck className="w-4 h-4" />
        </div>
      );
    }
    if (type === 'success') {
      return (
        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      );
    }
    if (type === 'warning' || type === 'error') {
      return (
        <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
        <Info className="w-4 h-4" />
      </div>
    );
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all active:scale-95"
        title="Fleet Notifications &amp; Alerts"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-rose-600 text-white font-black text-[10px] rounded-full flex items-center justify-center shadow-sm animate-pulse border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Slide-over Drawer Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-fadeIn">
          {/* Drawer Panel */}
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slideLeft">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Live Operations Alerts
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {unreadCount} unread operational updates
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs & Bulk Actions */}
            <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    filter === 'unread'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('otp')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    filter === 'otp'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  OTP &amp; Arrival
                </button>
              </div>

              <div className="flex items-center space-x-1">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead('admin')}
                    title="Mark all as read"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Clear all operational notifications?')) {
                        clearNotifications('admin');
                      }
                    }}
                    title="Clear list"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-slate-400 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-600">All caught up!</p>
                  <p className="text-[11px] text-slate-400">No notifications match this filter.</p>
                </div>
              ) : (
                filtered.map((item) => {
                  return (
                    <div
                      key={item.id}
                      onClick={() => markAsRead(item.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex items-start space-x-3 ${
                        item.read
                          ? 'bg-white border-slate-200/80 hover:border-slate-300'
                          : 'bg-blue-50/40 border-blue-200 hover:border-blue-300 shadow-xs'
                      }`}
                    >
                      {/* Unread indicator dot */}
                      {!item.read && (
                        <div className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                      )}

                      {getIcon(item.type, item.title)}

                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center space-x-1.5">
                          <h5 className="text-xs font-black text-slate-900 truncate">
                            {item.title}
                          </h5>
                        </div>

                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {item.message}
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                          <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-medium">
                            <Clock className="w-3 h-3" />
                            <span>{formatRelativeTime(item.timestamp)}</span>
                          </div>

                          {item.bookingId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onSelectBooking) onSelectBooking(item.bookingId!);
                                setIsOpen(false);
                              }}
                              className="text-[10px] font-mono font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 hover:underline"
                            >
                              #{item.bookingId}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
              <span className="text-[10px] text-slate-400 font-medium">
                Real-time operational alerts for Indore Dispatch Hub
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
