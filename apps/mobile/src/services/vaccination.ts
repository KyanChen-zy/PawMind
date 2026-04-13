import { api } from './api';

export interface VaccinationInfo {
  id: number; petId: number; vaccineName: string; barcode: string | null;
  vaccinationDate: string; expiryDate: string | null; nextDueDate: string | null;
  institution: string | null; batchNumber: string | null; notes: string | null;
  createdAt: string; updatedAt: string;
}

export interface CreateVaccinationData {
  vaccineName: string; barcode?: string; vaccinationDate: string;
  expiryDate?: string; nextDueDate?: string; institution?: string;
  batchNumber?: string; notes?: string;
}

export function getVaccinations(petId: number): Promise<VaccinationInfo[]> { return api.get(`/pets/${petId}/vaccinations`); }
export function createVaccination(petId: number, data: CreateVaccinationData): Promise<VaccinationInfo> { return api.post(`/pets/${petId}/vaccinations`, data); }
export function getUpcoming(petId: number): Promise<VaccinationInfo[]> { return api.get(`/pets/${petId}/vaccinations/upcoming`); }
export function updateVaccination(id: number, data: Partial<CreateVaccinationData>): Promise<VaccinationInfo> { return api.patch(`/vaccinations/${id}`, data); }
export function deleteVaccination(id: number): Promise<void> { return api.delete(`/vaccinations/${id}`); }
