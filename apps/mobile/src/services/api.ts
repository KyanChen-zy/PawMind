import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../constants/api';

class ApiClient {
  private baseUrl = API_BASE_URL;

  private async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync('accessToken');
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || `请求失败: ${res.status}`);
    }
    return res.json();
  }

  get<T>(path: string) { return this.request<T>(path); }

  post<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) });
  }

  put<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
