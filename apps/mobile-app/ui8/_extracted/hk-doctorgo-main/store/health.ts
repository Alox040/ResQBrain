import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type HealthRecord = {
  id: string;
  type: string;
  fileName: string;
  fileUrl: string;
  uploadDate: string;
};

type HealthState = {
  records: HealthRecord[];
  addRecord: (record: Omit<HealthRecord, 'id' | 'uploadDate'>) => void;
  removeRecord: (id: string) => void;
  getRecords: () => HealthRecord[];
};

export const useHealthStore = create<HealthState>()(
  persist<HealthState>(
    (set, get) => ({
      records: [],
      addRecord: (record) =>
        set((state) => ({
          records: [
            ...state.records,
            {
              ...record,
              id: Math.random().toString(36).substring(7),
              uploadDate: new Date().toISOString(),
            },
          ],
        })),
      removeRecord: (id) =>
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
        })),
      getRecords: () => get().records,
    }),
    {
      name: 'health-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
