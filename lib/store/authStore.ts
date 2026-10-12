import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CustomerProfile } from '@/types';

interface AuthState {
  user: CustomerProfile | null;
  isLoggedIn: boolean;
  login: (user: CustomerProfile) => void;
  logout: () => void;
  updateUser: (updates: Partial<CustomerProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user: CustomerProfile) =>
        set({
          user,
          isLoggedIn: true,
        }),
      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
        }),
      updateUser: (updates: Partial<CustomerProfile>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'carwash_customer_auth',
    }
  )
);
