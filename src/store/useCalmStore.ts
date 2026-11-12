import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type CalmStore = {
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  calmMinutes: number;
  darkMode: boolean;
  streakDays: number;
  lastSessionDate: string | null;
  totalSessions: number;
  setHapticsEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  addCalm: (minutes: number) => void;
  setDarkMode: (enabled: boolean) => void;
  addSession: () => void;
  resetData: () => void;
};

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export const useCalmStore = create<CalmStore>()(
  persist(
    (set) => ({
      hapticsEnabled: true,
      soundEnabled: false,
      calmMinutes: 0,
      darkMode: true,
      streakDays: 0,
      lastSessionDate: null,
      totalSessions: 0,
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      addCalm: (minutes) =>
        set((state) => ({ calmMinutes: state.calmMinutes + Math.max(0, minutes) })),
      setDarkMode: (darkMode) => set({ darkMode }),
      addSession: () =>
        set((state) => {
          const today = new Date().toISOString().slice(0, 10);
          const last = state.lastSessionDate;

          // Same day — no streak change
          if (last === today) {
            return { totalSessions: state.totalSessions + 1 };
          }

          const yesterday = getYesterday();
          const newStreak = last === yesterday ? state.streakDays + 1 : 1;

          return {
            totalSessions: state.totalSessions + 1,
            lastSessionDate: today,
            streakDays: newStreak,
          };
        }),
      resetData: () =>
        set({
          calmMinutes: 0,
          streakDays: 0,
          totalSessions: 0,
          lastSessionDate: null,
        }),
    }),
    {
      name: 'calm-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
