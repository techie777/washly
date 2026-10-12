import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppNotification } from '@/types';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  bookingId?: string;
}

interface NotificationState {
  toasts: ToastItem[];
  notifications: AppNotification[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (targetRole?: 'customer' | 'admin' | 'jr_admin') => void;
  clearNotifications: (targetRole?: 'customer' | 'admin' | 'jr_admin') => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '🚨 Van Arrived - Customer OTP Required',
    message: 'Expert Devraj reached 30 B Aasha Nagar. Customer Start OTP 8091 required to start washing.',
    type: 'warning',
    timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
    read: false,
    targetRole: 'admin',
    bookingId: 'WSH-38080',
  },
  {
    id: 'notif-2',
    title: '🚗 Expert Assigned & En Route',
    message: 'Devraj Chauhan assigned to booking #WSH-89241 (Maruti Swift). Field status: On The Way.',
    type: 'info',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    read: false,
    targetRole: 'admin',
    bookingId: 'WSH-89241',
  },
  {
    id: 'notif-3',
    title: '💰 Payment Collected via UPI QR',
    message: '₹250 collected successfully by Rajesh Solanki for booking #WSH-29768 (Hyundai i20).',
    type: 'success',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    read: true,
    targetRole: 'admin',
    bookingId: 'WSH-29768',
  },
  {
    id: 'notif-4',
    title: '🛎️ New Customer Support Query',
    message: 'Aditya Malviya submitted gate pass security instructions for booking #IND-9011.',
    type: 'info',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    read: true,
    targetRole: 'admin',
    bookingId: 'IND-9011',
  },
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      toasts: [],
      notifications: INITIAL_NOTIFICATIONS,

      addToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const newToast: ToastItem = { ...toast, id };

        set((state) => ({
          toasts: [...state.toasts, newToast],
        }));

        // Also record as notification if it is an important alert
        if (toast.type === 'warning' || toast.type === 'success' || toast.type === 'error') {
          get().addNotification({
            title: toast.title,
            message: toast.message || '',
            type: toast.type,
            targetRole: 'admin',
          });
        }

        const duration = toast.duration ?? 4500;
        if (duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, duration);
        }
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      addNotification: (notif) => {
        const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const item: AppNotification = {
          ...notif,
          id,
          timestamp: new Date().toISOString(),
          read: false,
        };

        set((state) => ({
          notifications: [item, ...state.notifications],
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllAsRead: (targetRole) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            !targetRole || n.targetRole === targetRole ? { ...n, read: true } : n
          ),
        }));
      },

      clearNotifications: (targetRole) => {
        set((state) => ({
          notifications: targetRole
            ? state.notifications.filter((n) => n.targetRole !== targetRole)
            : [],
        }));
      },
    }),
    {
      name: 'doorstep_notifications_store',
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
);
