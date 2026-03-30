import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DependantData } from '@/components/card-dependant';

export type UserState = {
  firstName: string;
  lastName: string;
  idType: string;
  nric: string;
  citizenship: string;
  gender: string;
  dependants: DependantData[];
  countryCode: string;
  phone: string;
  email: string;
  emergency: {
    name: string;
    relationship: string;
    countryCode: string;
    phone: string;
  };
  address: {
    postalCode: string;
    streetAddress: string;
    unitNumber: string;
    city: string;
    country: string;
  };
  setUserInfo: (
    info: Partial<
      Omit<UserState, 'setUserInfo' | 'resetUserInfo' | 'fullName' | 'complete' | 'dependants'>
    >,
  ) => void;
  addDependant: (dependant: DependantData) => void;
  getDependants: () => DependantData[];
  resetUserInfo: () => void;
  fullName: () => string;
  complete: () => boolean;
  removeDependant: (index: number) => void;
};

const defaultState = {
  firstName: 'John',
  lastName: 'Doe',
  idType: 'id',
  nric: '738765191877',
  citizenship: 'SG',
  gender: 'male',
  dependants: [],
  countryCode: '',
  phone: '',
  email: '',
  emergency: {
    name: '',
    relationship: '',
    countryCode: '',
    phone: '',
  },
  address: {
    postalCode: '',
    streetAddress: '',
    unitNumber: '',
    city: '',
    country: '',
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      setUserInfo: (info) => set((state) => ({ ...state, ...info })),
      addDependant: (dependant) =>
        set((state) => ({
          ...state,
          dependants: [...state.dependants, dependant],
        })),
      getDependants: () => get().dependants,
      resetUserInfo: () => set(defaultState),
      fullName: () => `${get().firstName} ${get().lastName}`,
      complete: () => {
        const state = get();
        return [
          state.firstName,
          state.lastName,
          state.idType,
          state.nric,
          state.citizenship,
          state.gender,
        ].every((field) => field.trim().length > 0);
      },
      removeDependant: (index) =>
        set((state) => ({
          ...state,
          dependants: state.dependants.filter((_, i) => i !== index),
        })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
