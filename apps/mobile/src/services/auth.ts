import * as SecureStore from 'expo-secure-store';
import { api } from './api';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
}

export async function register(email: string, password: string, nickname: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/register', { email, password, nickname });
  await SecureStore.setItemAsync('accessToken', res.accessToken);
  await SecureStore.setItemAsync('refreshToken', res.refreshToken);
  return res;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', { email, password });
  await SecureStore.setItemAsync('accessToken', res.accessToken);
  await SecureStore.setItemAsync('refreshToken', res.refreshToken);
  return res;
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
}

export async function isLoggedIn(): Promise<boolean> {
  const token = await SecureStore.getItemAsync('accessToken');
  return !!token;
}
