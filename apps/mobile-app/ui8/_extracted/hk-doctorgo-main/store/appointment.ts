import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Doctor } from '@/types/common';

type Appointment = {
  doctor: Doctor;
  date: string;
  timeSlot: string | null;
  status?: 'upcoming' | 'completed' | 'cancelled';
};

type AppointmentStoreState = {
  appointments: Appointment[];
};

type AppointmentStoreActions = {
  setAppointment: (appointment: Appointment) => void;
  removeAppointment: (doctorId: number) => void;
  clearAppointments: () => void;
  updateAppointmentStatus: (doctorId: number | undefined, status: Appointment['status']) => void;
  getAppointments: (status: Appointment['status'] | Appointment['status'][]) => Appointment[];
};

type AppointmentStore = AppointmentStoreState & AppointmentStoreActions;

const useAppointmentStore = create<AppointmentStore>()(
  persist(
    (set, get) => ({
      appointments: [],
      setAppointment: (appointment) =>
        set((state) => ({
          appointments: [...state.appointments, { ...appointment, status: 'upcoming' }],
        })),
      removeAppointment: (doctorId) =>
        set((state) => ({
          appointments: state.appointments.filter((apt) => apt.doctor.id !== doctorId),
        })),
      clearAppointments: () => set({ appointments: [] }),
      updateAppointmentStatus: (doctorId, status) => {
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.doctor.id === doctorId ? { ...apt, status } : apt,
          ),
        }));
      },
      getAppointments: (status) =>
        get().appointments.filter((apt) =>
          Array.isArray(status) ? status.includes(apt.status) : apt.status === status,
        ),
    }),
    {
      name: 'appointment-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useAppointmentStore;
