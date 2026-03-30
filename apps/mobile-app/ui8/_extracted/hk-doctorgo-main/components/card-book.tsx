import { Doctor } from '@/types/common';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import QuickFavorite from './quick-favorite';
import { useTranslation } from 'react-i18next';
import Badge from './badge';
import useBookingStore from '@/store/booking';
import dayjs from 'dayjs';

type CardBookProps = {
  doctor: Doctor;
  onPress?: () => void;
};

export default function CardBook({ doctor, onPress }: CardBookProps) {
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useBookingStore();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="flex-row items-start mb-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800">
      {doctor.image ? (
        <Image source={doctor.image} className="w-12 h-12 rounded-full" />
      ) : (
        <View className="w-12 h-12 rounded-full bg-slate-100" />
      )}

      <View className="flex-1 ml-3">
        <View className="flex-row justify-between">
          <View>
            <Text className="font-semibold text-slate-800 dark:text-white">{doctor.name}</Text>

            <Text className="mt-1 text-slate-500 dark:text-slate-200 font-medium text-sm">
              {t(doctor.role)}
            </Text>
          </View>

          {doctor?.status && <Badge text={doctor?.status} />}
        </View>

        <Text className="text-slate-500 dark:text-slate-300 font-sans text-sm">
          {doctor.clinic}
        </Text>

        <View className="flex-row items-center gap-2 mt-2">
          <Text className="text-primary dark:text-indigo-400 font-medium text-sm">
            {t('fee')} ${doctor.price}
          </Text>

          <Text className="text-slate-500 dark:text-slate-300 font-sans text-sm">•</Text>

          <Text className="text-slate-500 dark:text-slate-300 font-sans text-sm">
            {dayjs(doctor.earliestSlot).format('DD MMM, hh:mm A')}
          </Text>
        </View>
      </View>

      <QuickFavorite isFavorite={isFavorite(doctor.id)} onPress={() => toggleFavorite(doctor)} />
    </TouchableOpacity>
  );
}
