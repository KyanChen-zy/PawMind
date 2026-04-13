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

export interface HealthMetricInfo {
  id: number; petId: number; metricType: string; value: number; unit: string;
  source: string; deviceId: number | null; recordedAt: string; createdAt: string;
}

export interface CreateHealthMetricData {
  petId: number; metricType: string; value: number; unit: string;
  source: string; deviceId?: number; recordedAt: string;
}

export interface HealthRecordInfo {
  id: number; petId: number; recordType: string;
  visitDate: string | null; hospitalName: string | null;
  diagnosis: string | null; prescription: string | null; doctorAdvice: string | null;
  content: string | null; tags: string[] | null; inputMethod: string | null;
  attachments: string[] | null; createdAt: string; updatedAt: string;
}

export interface CreateHealthRecordData {
  recordType: string; visitDate?: string; hospitalName?: string;
  diagnosis?: string; prescription?: string; doctorAdvice?: string;
  content?: string; tags?: string[]; inputMethod?: string; attachments?: string[];
}

export function recordMetric(data: CreateHealthMetricData): Promise<HealthMetricInfo> { return api.post('/health-metrics', data); }
export function getMetrics(petId: number, type?: string, range?: string): Promise<HealthMetricInfo[]> {
  let path = `/pets/${petId}/health-metrics?`;
  if (type) path += `type=${type}&`;
  if (range) path += `range=${range}`;
  return api.get(path);
}
export function getMetricSummary(petId: number, range?: string): Promise<Record<string, unknown>> { return api.get(`/pets/${petId}/health-metrics/summary${range ? `?range=${range}` : ''}`); }
export function createHealthRecord(petId: number, data: CreateHealthRecordData): Promise<HealthRecordInfo> { return api.post(`/pets/${petId}/health-records`, data); }
export function getHealthRecords(petId: number): Promise<HealthRecordInfo[]> { return api.get(`/pets/${petId}/health-records`); }
export function getHealthRecord(id: number): Promise<HealthRecordInfo> { return api.get(`/health-records/${id}`); }
export function updateHealthRecord(id: number, data: Partial<CreateHealthRecordData>): Promise<HealthRecordInfo> { return api.patch(`/health-records/${id}`, data); }
export function deleteHealthRecord(id: number): Promise<void> { return api.delete(`/health-records/${id}`); }
