import { create } from 'zustand';
import * as vaccinationService from '../services/vaccination';
import type { VaccinationInfo, CreateVaccinationData } from '../services/vaccination';

interface VaccinationState {
  vaccinations: VaccinationInfo[]; upcoming: VaccinationInfo[]; loading: boolean;
  fetchVaccinations: (petId: number) => Promise<void>;
  fetchUpcoming: (petId: number) => Promise<void>;
  addVaccination: (petId: number, data: CreateVaccinationData) => Promise<VaccinationInfo>;
  removeVaccination: (id: number) => Promise<void>;
}

export const useVaccinationStore = create<VaccinationState>((set) => ({
  vaccinations: [], upcoming: [], loading: false,
  fetchVaccinations: async (petId) => {
    set({ loading: true });
    try { const vaccinations = await vaccinationService.getVaccinations(petId); set({ vaccinations, loading: false }); }
    catch { set({ loading: false }); }
  },
  fetchUpcoming: async (petId) => {
    try { const upcoming = await vaccinationService.getUpcoming(petId); set({ upcoming }); }
    catch {}
  },
  addVaccination: async (petId, data) => {
    const vaccination = await vaccinationService.createVaccination(petId, data);
    set((s) => ({ vaccinations: [vaccination, ...s.vaccinations] }));
    return vaccination;
  },
  removeVaccination: async (id) => {
    await vaccinationService.deleteVaccination(id);
    set((s) => ({ vaccinations: s.vaccinations.filter(v => v.id !== id) }));
  },
}));
