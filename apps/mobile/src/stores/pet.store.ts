import { create } from 'zustand';
import * as petService from '../services/pet';
import type { PetInfo, CreatePetData } from '../services/pet';

interface PetState {
  pets: PetInfo[]; currentPet: PetInfo | null; loading: boolean;
  fetchPets: () => Promise<void>; selectPet: (pet: PetInfo) => void; addPet: (data: CreatePetData) => Promise<void>;
}

export const usePetStore = create<PetState>((set, get) => ({
  pets: [], currentPet: null, loading: false,
  fetchPets: async () => {
    set({ loading: true });
    try {
      const pets = await petService.fetchPets();
      set({ pets, loading: false });
      if (!get().currentPet && pets.length > 0) set({ currentPet: pets[0] });
    } catch { set({ loading: false }); }
  },
  selectPet: (pet) => set({ currentPet: pet }),
  addPet: async (data) => {
    const pet = await petService.createPet(data);
    set((s) => ({ pets: [pet, ...s.pets], currentPet: pet }));
  },
}));
