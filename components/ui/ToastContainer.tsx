'use client';

import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  X, 
  Sparkles,
  Bell
} from 'lucide-react';
import { useNotificationStore, ToastItem } from '@/lib/store/notificationStore';

export default function ToastContainer() {
  const { toasts, removeToast } = useNotificationStore();

  if (!toasts || toasts.length === 0) return null;

  const getToastStyles = (type: ToastItem['type']) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-white border-emerald-300 shadow-emerald-500/10',
          accent: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          titleColor: 'text-emerald-950',
          textColor: 'text-emerald-800',
        };
      case 'warning':
        return {
          bg: 'bg-white border-amber-300 shadow-amber-500/10',
          accent: 'bg-amber-500',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          titleColor: 'text-amber-950',
          textColor: 'text-amber-800',
        };
      case 'error':
        return {
          bg: 'bg-white border-rose-300 shadow-rose-500/10',
          accent: 'bg-rose-500',
          icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
          titleColor: 'text-rose-950',
          textColor: 'text-rose-800',
        };
      case 'info':
      default:
        return {
          bg: 'bg-white border-amber-300 shadow-amber-500/10',
          accent: 'bg-amber-500',
          icon: <Info className="w-5 h-5 text-amber-600 shrink-0" />,
          titleColor: 'text-amber-950',
          textColor: 'text-amber-800',
        };
    }
  };

  return (
    <aside
      aria-label="Notifications"
      className="fixed top-5 right-5 z-[99999] flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0"
    >
      {toasts.map((toast) => {
        const style = getToastStyles(toast.type);
        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto rounded-2xl border shadow-xl p-4 flex items-start space-x-3 transition-all transform duration-200 animate-slideDown overflow-hidden relative ${style.bg}`}
          >
            {/* Left accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.accent}`} />

            {/* Icon */}
            <div className="pt-0.5">{style.icon}</div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-1">
              <h5 className={`text-xs font-black leading-tight ${style.titleColor}`}>
                {toast.title}
              </h5>
              {toast.message && (
                <p className={`text-[11px] font-medium mt-1 leading-snug ${style.textColor}`}>
                  {toast.message}
                </p>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="w-6 h-6 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </aside>
  );
}
