import { create } from 'zustand';
import * as careAiService from '../services/care-ai';
import type { CareAiSessionInfo, CareAiMessageInfo, DailyTipInfo, DiagnosisReportInfo } from '../services/care-ai';

interface CareAiState {
  sessions: CareAiSessionInfo[];
  messages: CareAiMessageInfo[];
  dailyTip: DailyTipInfo | null;
  diagnoses: DiagnosisReportInfo[];
  loading: boolean;
  fetchSessions: (petId: number) => Promise<void>;
  startSession: (petId: number) => Promise<CareAiSessionInfo>;
  fetchMessages: (sessionId: number) => Promise<void>;
  sendMessage: (sessionId: number, content: string) => Promise<void>;
  fetchDailyTip: () => Promise<void>;
  fetchDiagnoses: (petId: number) => Promise<void>;
  createDiagnosis: (petId: number, diagnosisType: string, imageUrl: string) => Promise<DiagnosisReportInfo>;
}

export const useCareAiStore = create<CareAiState>((set) => ({
  sessions: [], messages: [], dailyTip: null, diagnoses: [], loading: false,
  fetchSessions: async (petId) => {
    set({ loading: true });
    try { const sessions = await careAiService.getSessions(petId); set({ sessions, loading: false }); }
    catch { set({ loading: false }); }
  },
  startSession: async (petId) => {
    const session = await careAiService.createSession(petId);
    set((s) => ({ sessions: [session, ...s.sessions] }));
    return session;
  },
  fetchMessages: async (sessionId) => {
    try { const messages = await careAiService.getMessages(sessionId); set({ messages }); }
    catch {}
  },
  sendMessage: async (sessionId, content) => {
    const { userMsg, aiMsg } = await careAiService.sendMessage(sessionId, content);
    set((s) => ({ messages: [...s.messages, userMsg, aiMsg] }));
  },
  fetchDailyTip: async () => {
    try { const dailyTip = await careAiService.getDailyTip(); set({ dailyTip }); }
    catch {}
  },
  fetchDiagnoses: async (petId) => {
    try { const diagnoses = await careAiService.getDiagnosisByPet(petId); set({ diagnoses }); }
    catch {}
  },
  createDiagnosis: async (petId, diagnosisType, imageUrl) => {
    const diagnosis = await careAiService.createDiagnosis(petId, diagnosisType, imageUrl);
    set((s) => ({ diagnoses: [diagnosis, ...s.diagnoses] }));
    return diagnosis;
  },
}));
