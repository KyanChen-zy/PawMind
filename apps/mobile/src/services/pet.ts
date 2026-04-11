import { api } from './api';

export interface PetInfo {
  id: number; name: string; species: string; breed: string; birthday: string;
  gender: string; weight: number; avatar: string | null; personalityTags: string[];
  status: string; createdAt: string;
}

export interface CreatePetData {
  name: string; species: string; breed: string; birthday: string; gender: string; weight: number;
}

export function fetchPets(): Promise<PetInfo[]> { return api.get('/pets'); }
export function fetchPet(id: number): Promise<PetInfo> { return api.get(`/pets/${id}`); }
export function createPet(data: CreatePetData): Promise<PetInfo> { return api.post('/pets', data); }
export function updatePet(id: number, data: Partial<CreatePetData>): Promise<PetInfo> { return api.put(`/pets/${id}`, data); }
export function archivePet(id: number): Promise<void> { return api.delete(`/pets/${id}`); }
