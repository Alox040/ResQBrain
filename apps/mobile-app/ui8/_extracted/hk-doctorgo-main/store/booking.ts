import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Doctor } from '@/types/common';

type BookingStep = 'details' | 'datetime' | 'confirm';

type BookingStore = {
  bookingStep: BookingStep;
  favorites: Doctor[];
  setBookingStep: (step: BookingStep) => void;
  addToFavorites: (doctor: Doctor) => void;
  removeFromFavorites: (doctorId: number) => void;
  isFavorite: (doctorId: number) => boolean;
  toggleFavorite: (doctor: Doctor) => void;
};

const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      bookingStep: 'details',
      favorites: [],
      setBookingStep: (step) => set({ bookingStep: step }),
      addToFavorites: (doctor) =>
        set((state) => ({
          favorites: [...state.favorites, doctor],
        })),
      removeFromFavorites: (doctorId) =>
        set((state) => ({
          favorites: state.favorites.filter((doc) => doc.id !== doctorId),
        })),
      isFavorite: (doctorId) => {
        return get().favorites.some((doc) => doc.id === doctorId);
      },
      toggleFavorite: (doctor) => {
        const state = get();
        const isFavorited = state.isFavorite(doctor.id);

        if (isFavorited) {
          state.removeFromFavorites(doctor.id);
        } else {
          state.addToFavorites(doctor);
        }
      },
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useBookingStore;
