import { api } from './api';

export interface GrowthRecordInfo { id: number; petId: number; contentType: string; mediaUrl: string | null; description: string | null; tags: string[]; createdAt: string; }

export function getGrowthRecords(petId: number): Promise<GrowthRecordInfo[]> { return api.get(`/pets/${petId}/growth-records`); }
export function createGrowthRecord(petId: number, data: { contentType: string; mediaUrl?: string; description?: string; tags?: string[]; }): Promise<GrowthRecordInfo> { return api.post(`/pets/${petId}/growth-records`, data); }
export function deleteGrowthRecord(id: number): Promise<void> { return api.delete(`/growth-records/${id}`); }
