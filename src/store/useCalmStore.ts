import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type CalmStore = {
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  calmMinutes: number;
  setHapticsEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  addCalm: (minutes: number) => void;
};

export const useCalmStore = create<CalmStore>()(
  persist(
    (set) => ({
      hapticsEnabled: true,
      soundEnabled: false,
      calmMinutes: 0,
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      addCalm: (minutes) =>
        set((state) => ({ calmMinutes: state.calmMinutes + Math.max(0, minutes) })),
    }),
    {
      name: 'calm-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
