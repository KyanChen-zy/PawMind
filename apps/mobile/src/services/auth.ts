import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { api } from './api';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
}

// Platform-specific storage implementation
const storage = {
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  async deleteItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

export async function register(email: string, password: string, nickname: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/register', { email, password, nickname });
  await storage.setItem('accessToken', res.accessToken);
  await storage.setItem('refreshToken', res.refreshToken);
  return res;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', { email, password });
  await storage.setItem('accessToken', res.accessToken);
  await storage.setItem('refreshToken', res.refreshToken);
  return res;
}

export async function logout(): Promise<void> {
  await storage.deleteItem('accessToken');
  await storage.deleteItem('refreshToken');
}

export async function isLoggedIn(): Promise<boolean> {
  const token = await storage.getItem('accessToken');
  return !!token;
}
