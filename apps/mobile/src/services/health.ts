import { api } from './api';

export interface HealthLogInfo {
  id: number; petId: number; date: string; weight: number | null;
  appetiteLevel: string | null; activityLevel: string | null; waterIntake: number | null;
  symptoms: string | null; notes: string | null; isAlert: boolean; alertType: string | null;
  severity: string | null; createdAt: string;
}

export interface CreateHealthLogData {
  date: string; weight?: number; appetiteLevel?: string; activityLevel?: string;
  waterIntake?: number; symptoms?: string; notes?: string;
}

export function createHealthLog(petId: number, data: CreateHealthLogData): Promise<HealthLogInfo> { return api.post(`/pets/${petId}/health-logs`, data); }
export function getHealthLogs(petId: number): Promise<HealthLogInfo[]> { return api.get(`/pets/${petId}/health-logs`); }
export function getHealthTrends(petId: number, days: number = 7): Promise<HealthLogInfo[]> { return api.get(`/pets/${petId}/health-logs/trends?days=${days}`); }
export function getAlerts(petId: number): Promise<HealthLogInfo[]> { return api.get(`/pets/${petId}/health-logs/alerts`); }
export function resolveAlert(logId: number): Promise<HealthLogInfo> { return api.put(`/health-logs/${logId}/resolve`, {}); }
