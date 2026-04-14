import { create } from 'zustand';
import * as deviceService from '../services/device';
import type { DeviceInfo, DeviceProductInfo, CreateDeviceData } from '../services/device';

interface DeviceState {
  devices: DeviceInfo[]; products: DeviceProductInfo[]; loading: boolean;
  fetchDevices: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  bindDevice: (data: CreateDeviceData) => Promise<DeviceInfo>;
  unbindDevice: (id: number) => Promise<void>;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  devices: [], products: [], loading: false,
  fetchDevices: async () => {
    set({ loading: true });
    try { const devices = await deviceService.getDevices(); set({ devices, loading: false }); }
    catch { set({ loading: false }); }
  },
  fetchProducts: async () => {
    try { const products = await deviceService.getProducts(); set({ products }); }
    catch {}
  },
  bindDevice: async (data) => {
    const device = await deviceService.bindDevice(data);
    set((s) => ({ devices: [device, ...s.devices] }));
    return device;
  },
  unbindDevice: async (id) => {
    await deviceService.unbindDevice(id);
    set((s) => ({ devices: s.devices.filter(d => d.id !== id) }));
  },
}));
