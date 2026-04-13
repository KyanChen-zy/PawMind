import { api } from './api';

export interface DeviceInfo {
  id: number; userId: number; petId: number; productId: number | null;
  name: string; deviceType: string; serialNumber: string | null;
  status: string; batteryLevel: number | null; networkStatus: string | null;
  bindTime: string | null; createdAt: string; updatedAt: string;
  product?: DeviceProductInfo; pet?: { id: number; name: string };
}

export interface DeviceProductInfo {
  id: number; name: string; type: string; brand: string;
  description: string; specs: Record<string, string> | null;
  imageUrl: string | null; purchaseUrl: string; price: number | null;
}

export interface CreateDeviceData {
  petId: number; name: string; deviceType: string;
  serialNumber?: string; productId?: number;
}

export function getDevices(): Promise<DeviceInfo[]> { return api.get('/devices'); }
export function bindDevice(data: CreateDeviceData): Promise<DeviceInfo> { return api.post('/devices', data); }
export function getDevice(id: number): Promise<DeviceInfo> { return api.get(`/devices/${id}`); }
export function updateDevice(id: number, data: { name?: string }): Promise<DeviceInfo> { return api.patch(`/devices/${id}`, data); }
export function unbindDevice(id: number): Promise<void> { return api.delete(`/devices/${id}`); }
export function getProducts(): Promise<DeviceProductInfo[]> { return api.get('/devices/products'); }
export function getProduct(id: number): Promise<DeviceProductInfo> { return api.get(`/devices/products/${id}`); }
