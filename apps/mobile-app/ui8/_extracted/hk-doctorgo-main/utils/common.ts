import { Doctor } from '@/types/common';
import dayjs, { Dayjs } from 'dayjs';

export const generateTimeSlots = (date: Dayjs, doctor: Doctor) => {
  if (!date || !doctor) return [];

  const slots = [];
  const now = dayjs();
  const startTime = doctor.earliestSlot;
  const endTime = doctor.lastSlot;

  let currentTime = startTime;

  while (currentTime.isBefore(endTime)) {
    if (!date.isSame(now, 'day') || currentTime.isAfter(now)) {
      slots.push(currentTime.format('hh:mm A'));
    }

    currentTime = currentTime.add(30, 'minute');
  }

  return slots;
};

export const getGreetingTime = (t: any) => {
  const hours = new Date().getHours();

  if (hours >= 5 && hours < 12) {
    return t('morning');
  } else if (hours >= 12 && hours < 17) {
    return t('afternoon');
  } else {
    return t('evening');
  }
};
