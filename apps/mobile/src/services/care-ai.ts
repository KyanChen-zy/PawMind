import { api } from './api';

export interface CareAiSessionInfo { id: number; petId: number; createdAt: string; }
export interface CareAiMessageInfo { id: number; sessionId: number; role: 'user' | 'assistant'; content: string; createdAt: string; }
export interface DailyTipInfo { id: number; title: string; content: string; summary: string | null; category: string; targetSpecies: string; publishDate: string | null; }
export interface DiagnosisReportInfo {
  id: number; petId: number; diagnosisType: string; imageUrl: string;
  resultSummary: string | null; resultDetail: Record<string, unknown> | null;
  savedToRecord: boolean; createdAt: string;
}

export function createSession(petId: number): Promise<CareAiSessionInfo> { return api.post('/care-ai/sessions', { petId }); }
export function getSessions(petId: number): Promise<CareAiSessionInfo[]> { return api.get(`/care-ai/sessions?petId=${petId}`); }
export function sendMessage(sessionId: number, content: string): Promise<{ userMsg: CareAiMessageInfo; aiMsg: CareAiMessageInfo }> { return api.post(`/care-ai/sessions/${sessionId}/messages`, { content }); }
export function getMessages(sessionId: number): Promise<CareAiMessageInfo[]> { return api.get(`/care-ai/sessions/${sessionId}/messages`); }
export function getDailyTip(): Promise<DailyTipInfo | null> { return api.get('/care-ai/daily-tip'); }
export function getDailyTips(): Promise<DailyTipInfo[]> { return api.get('/care-ai/daily-tips'); }
export function createDiagnosis(petId: number, diagnosisType: string, imageUrl: string): Promise<DiagnosisReportInfo> { return api.post('/care-ai/diagnosis', { petId, diagnosisType, imageUrl }); }
export function getDiagnosis(id: number): Promise<DiagnosisReportInfo> { return api.get(`/care-ai/diagnosis/${id}`); }
export function getDiagnosisByPet(petId: number): Promise<DiagnosisReportInfo[]> { return api.get(`/care-ai/diagnosis?petId=${petId}`); }
