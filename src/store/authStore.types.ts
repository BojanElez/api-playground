import type { IAuthUser } from '../types/types';

export interface IAuthState {
  isAuthenticated: boolean;
  isAuthHydrated: boolean;
  user: IAuthUser | null;
}

export interface IAuthActions {
  login: (userInfo: IAuthUser) => void;
  logout: () => void;
  checkAuthFromStorage: () => void;
}

export type TAuthStore = IAuthState & IAuthActions;
