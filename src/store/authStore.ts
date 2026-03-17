import { create } from 'zustand';
import type { IAuthUser } from '../types/types';
import type { TAuthStore } from './authStore.types';

const STORAGE_KEYS = {
  authUser: 'authUser',
  isAuthenticated: 'isAuthenticated',
};

export const useAuthStore = create<TAuthStore>((set) => ({
  isAuthenticated: false,
  isAuthHydrated: false,
  user: null,

  login: (userInfo: IAuthUser): void => {
    set({ isAuthenticated: true, isAuthHydrated: true, user: userInfo });
    sessionStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(userInfo));
    sessionStorage.setItem(STORAGE_KEYS.isAuthenticated, 'true');
  },

  logout: (): void => {
    set({ isAuthenticated: false, isAuthHydrated: true, user: null });
    sessionStorage.removeItem(STORAGE_KEYS.authUser);
    sessionStorage.removeItem(STORAGE_KEYS.isAuthenticated);
  },

  checkAuthFromStorage: (): void => {
    try {
      const isAuthenticated = sessionStorage.getItem(STORAGE_KEYS.isAuthenticated) === 'true';
      const userInfo = sessionStorage.getItem(STORAGE_KEYS.authUser);

      if (isAuthenticated && userInfo) {
        const user = JSON.parse(userInfo) as IAuthUser;
        set({ isAuthenticated: true, isAuthHydrated: true, user });
        return;
      }

      set({ isAuthenticated: false, isAuthHydrated: true, user: null });
    } catch {
      set({ isAuthenticated: false, isAuthHydrated: true, user: null });
    }
  },
}));
