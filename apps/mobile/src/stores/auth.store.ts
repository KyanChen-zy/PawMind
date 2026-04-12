import { create } from 'zustand';
import * as authService from '../services/auth';

interface AuthState {
  isLoggedIn: boolean;
  userId: number | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userId: null,
  loading: true,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.login(email, password);
      set({ isLoggedIn: true, userId: res.userId, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  register: async (email, password, nickname) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.register(email, password, nickname);
      set({ isLoggedIn: true, userId: res.userId, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  logout: async () => {
    await authService.logout();
    set({ isLoggedIn: false, userId: null });
  },

  checkAuth: async () => {
    try {
      const loggedIn = await authService.isLoggedIn();
      set({ isLoggedIn: loggedIn, loading: false });
    } catch {
      set({ isLoggedIn: false, loading: false });
    }
  },
}));
