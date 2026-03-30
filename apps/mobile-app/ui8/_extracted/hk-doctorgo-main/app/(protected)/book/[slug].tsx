import { View, Text, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import {
  IconCategory,
  IconCircleCheckFilled,
  IconHearts,
  IconSearch,
} from '@tabler/icons-react-native';
import Header from '@/components/header';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import BottomSheet from '@/components/bottom-sheet';
import ButtonPrimary from '@/components/button-primary';
import colors from 'tailwindcss/colors';
import { doctors } from '@/data/common';
import CardBook from '@/components/card-book';
import { generateTimeSlots } from '@/utils/common';
import Tag from '@/components/tag';
import Container from '@/components/container';
import Animated, { LinearTransition, FadeInDown } from 'react-native-reanimated';
import InputText from '@/components/input-text';
import NoData from '@/components/no-data';
import QuickFavorite from '@/components/quick-favorite';
import { useTranslation } from 'react-i18next';
import useAppointmentStore from '@/store/appointment';
import Modal from '@/components/modal';
import Calendar from '@/components/calendar';
import useBookingStore from '@/store/booking';
import { Doctor } from '@/types/common';
import { useColorScheme } from 'nativewind';
import Label from '@/components/label';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.tz.setDefault('Asia/Singapore');

export default function Book(): React.ReactNode {
  const { t } = useTranslation();
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState<boolean>(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const [doctorRole, setDoctorRole] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [favorited, setFavorited] = useState<boolean>(false);
  const setAppointment = useAppointmentStore((s) => s.setAppointment);
  const { bookingStep, setBookingStep, isFavorite, toggleFavorite } = useBookingStore();
  const { colorScheme } = useColorScheme();

  const filteredDoctors = useMemo(() => {
    let filtered = doctors;

    if (favorited) {
      filtered = filtered.filter((doctor) => isFavorite(doctor.id));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(query) ||
          doctor.clinic.toLowerCase().includes(query) ||
          doctor.role.toLowerCase().includes(query),
      );
    }

    if (selectedGender) {
      filtered = filtered.filter((doctor) => doctor.gender === selectedGender);
    }

    if (doctorRole) {
      filtered = filtered.filter((doctor) => t(doctor.role) === doctorRole);
    }

    if (selectedDay) {
      filtered = filtered.filter((doctor) => {
        const earliestHour = doctor.earliestSlot.hour();
        const lastHour = doctor.lastSlot.hour();

        switch (selectedDay) {
          case 'morning':
            return (earliestHour >= 6 && earliestHour < 12) || (lastHour > 6 && lastHour <= 12);
          case 'afternoon':
            return (earliestHour >= 12 && earliestHour < 17) || (lastHour > 12 && lastHour <= 17);
          case 'evening':
            return (earliestHour >= 17 && earliestHour < 22) || (lastHour > 17 && lastHour <= 22);
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [
    searchQuery,
    selectedGender,
    doctorRole,
    selectedDay,
    favorited,
    t,
    isFavorite,
    // selectedDate,
  ]);

  const handleFilterPress = () => setIsFilterOpen(true);
  const handleFilterClose = () => setIsFilterOpen(false);

  return (
    <Container className="gap-4">
      <Header
        name={`${t('search_only')} ${t(slug)}`}
        className="justify-between"
        postfixIcon={
          <View className="flex-row gap-4">
            <TouchableOpacity activeOpacity={0.8} onPress={() => setFavorited(!favorited)}>
              <IconHearts
                size={22}
                color={
                  favorited
                    ? colorScheme === 'light'
                      ? '#514DDF'
                      : colors.indigo[400]
                    : colorScheme === 'light'
                      ? colors.slate[800]
                      : colors.slate[200]
                }
              />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={handleFilterPress}>
              <IconCategory
                size={22}
                color={
                  selectedGender || doctorRole || selectedDay
                    ? colorScheme === 'light'
                      ? '#514DDF'
                      : colors.indigo[400]
                    : colorScheme === 'light'
                      ? colors.slate[800]
                      : colors.slate[200]
                }
              />
            </TouchableOpacity>
          </View>
        }
      />

      <InputText
        placeholder={`${t('search_only')} ${slug}...`}
        value={searchQuery}
        onChangeText={setSearchQuery}
        prefixIcon={<IconSearch size={20} color={colors.slate[400]} />}
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => console.log('refreshing')} />
        }>
        {filteredDoctors.map((doctor, index) => (
          <Animated.View
            key={doctor.id}
            entering={FadeInDown.delay(index * 100)}
            layout={LinearTransition.springify()}>
            <CardBook
              doctor={doctor}
              onPress={() => {
                setSelectedDoctor(doctor);
                setIsOpen(true);
              }}
            />
          </Animated.View>
        ))}

        <NoData message={t('no_doctors_found')} when={filteredDoctors.length === 0} />
      </Animated.ScrollView>

      <BottomSheet
        isVisible={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedDate(dayjs());
          setSelectedTimeSlot(null);
          setBookingStep('details');
        }}
        closeText={t('cancel')}
        title={
          bookingStep === 'details'
            ? t('doctor_details')
            : bookingStep === 'datetime'
              ? t('select_date_and_time_slot')
              : t('confirm_appointment')
        }
        hasLeftAction={bookingStep !== 'details'}
        leftAction={
          bookingStep === 'datetime'
            ? () => setBookingStep('details')
            : () => setBookingStep('datetime')
        }>
        {selectedDoctor && (
          <>
            {bookingStep === 'details' && (
              <>
                <View className="flex-row items-center mb-6">
                  <View className="flex-row items-start gap-4 flex-1">
                    <Image source={selectedDoctor.image} className="w-20 h-20 rounded-full" />

                    <View className="flex-1 gap-1">
                      <Text className="text-lg font-semibold text-slate-800 dark:text-white">
                        {selectedDoctor.name}
                      </Text>

                      <Text className="text-primary dark:text-indigo-400 font-medium">
                        {t(selectedDoctor.role)}
                      </Text>

                      <Text className="text-slate-500 dark:text-slate-300 font-sans">
                        {selectedDoctor.experience} {t('experience')}
                      </Text>
                    </View>
                  </View>

                  <QuickFavorite
                    isFavorite={isFavorite(selectedDoctor.id)}
                    onPress={() => toggleFavorite(selectedDoctor)}
                  />
                </View>

                <View className="gap-4">
                  <View className="gap-2">
                    <Label text={t('about')} />

                    <Text className="text-slate-500 dark:text-white font-sans leading-relaxed">
                      {selectedDoctor.details}
                    </Text>
                  </View>

                  <View className="gap-2">
                    <Label text={t('clinic')} />

                    <Text className="text-slate-500 dark:text-white font-sans">
                      {selectedDoctor.clinic}
                    </Text>
                  </View>

                  <View className="gap-2 mb-6">
                    <Label text={t('next_available')} />

                    <Text className="text-slate-500 dark:text-white font-sans">
                      {selectedDoctor.earliestSlot.format('DD MMM, hh:mm A')}
                    </Text>
                  </View>

                  <ButtonPrimary
                    text={t('book_appointment')}
                    onPress={() => setBookingStep('datetime')}
                  />
                </View>
              </>
            )}

            {bookingStep === 'datetime' && (
              <>
                <Text className="text-slate-500 font-sans mb-4">
                  {t('see_timing_in_local_timezone')}
                </Text>
                <View className="mb-6">
                  <Calendar
                    selectedDate={selectedDate.toString()}
                    onDateChange={(date) => {
                      setSelectedDate(dayjs(date, 'DD/MM/YYYY'));
                      setSelectedTimeSlot(null);
                    }}
                    minDate={dayjs().toDate()}
                    maxDate={dayjs().add(2, 'week').toDate()}
                  />
                </View>
                <View className="gap-2">
                  <Label text={t('available_time_slots')} />

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="items-center mb-6 gap-2">
                    {(() => {
                      const timeSlots = generateTimeSlots(selectedDate, selectedDoctor);

                      if (timeSlots.length === 0) {
                        return (
                          <Text className="text-slate-500 font-sans">
                            {t('no_slots_available')}
                          </Text>
                        );
                      }

                      return timeSlots.map((time) => (
                        <Tag
                          key={time}
                          label={time}
                          isSelected={selectedTimeSlot === time}
                          onPress={() => setSelectedTimeSlot(time)}
                        />
                      ));
                    })()}
                  </ScrollView>
                </View>
                <TouchableOpacity
                  className={`bg-primary rounded-full py-4 items-center ${
                    !selectedTimeSlot && 'opacity-50'
                  }`}
                  disabled={!selectedTimeSlot}
                  onPress={() => {
                    setBookingStep('confirm');
                  }}>
                  <Text className="text-white font-semibold">{t('confirm_booking')}</Text>
                </TouchableOpacity>
              </>
            )}

            {bookingStep === 'confirm' && (
              <>
                <View className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 mb-6">
                  <View className="flex-row items-center gap-4 mb-6">
                    <Image source={selectedDoctor.image} className="w-16 h-16 rounded-full" />

                    <View className="flex-1 gap-1">
                      <Text className="text-lg font-semibold text-slate-800 dark:text-white">
                        {selectedDoctor.name}
                      </Text>

                      <Text className="text-primary dark:text-indigo-400 font-medium">
                        {t(selectedDoctor.role)}
                      </Text>

                      <Text className="text-slate-500 dark:text-slate-200 font-sans">
                        {selectedDoctor.clinic}
                      </Text>
                    </View>
                  </View>

                  <View className="gap-4">
                    <View className="gap-2">
                      <Label text={t('date_and_time')} />

                      <Text className="text-slate-500 dark:text-white font-sans">
                        {selectedDate.format('DD MMMM YYYY')} {t('at')} {selectedTimeSlot}
                      </Text>
                    </View>

                    <View className="gap-2">
                      <Label text={t('consultation_type')} />

                      <Text className="text-slate-500 dark:text-white font-sans">{t('video_consultation')}</Text>
                    </View>

                    <View className="gap-2">
                      <Label text={t('consultation_fee')} />

                      <Text className="text-slate-500 dark:text-white font-sans">$50.00</Text>
                    </View>
                  </View>
                </View>

                <ButtonPrimary
                  text={t('confirm')}
                  onPress={() => {
                    setAppointment({
                      doctor: selectedDoctor,
                      date: selectedDate.format('DD/MM/YYYY'),
                      timeSlot: selectedTimeSlot,
                    });

                    /** reset the state */
                    setIsOpen(false);
                    setSelectedDate(dayjs());
                    setSelectedTimeSlot(null);
                    setBookingStep('details');

                    setTimeout(() => setAppointmentConfirmed(true), 500);
                  }}
                />
              </>
            )}
          </>
        )}
      </BottomSheet>

      <FilterBottomSheet
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
        doctorRole={doctorRole}
        setDoctorRole={setDoctorRole}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        handleFilterClose={handleFilterClose}
      />

      <Modal
        isVisible={appointmentConfirmed}
        icon={<IconCircleCheckFilled strokeWidth={0} size={64} stroke="#514DDF" fill="#514DDF" />}
        title={t('confirm_appointment')}
        primaryButtonText={t('continue')}
        onPrimaryButtonPress={() => {
          setAppointmentConfirmed(false);
          router.push('/(protected)/(tabs)/activity');
        }}
        secondaryButton={false}
      />
    </Container>
  );
}

const FilterBottomSheet = ({
  isFilterOpen,
  setIsFilterOpen,
  selectedGender,
  setSelectedGender,
  doctorRole,
  setDoctorRole,
  selectedDay,
  setSelectedDay,
  handleFilterClose,
}: {
  isFilterOpen: boolean;
  setIsFilterOpen: any;
  selectedGender: any;
  setSelectedGender: any;
  doctorRole: any;
  setDoctorRole: any;
  selectedDay: any;
  setSelectedDay: any;
  handleFilterClose: any;
}) => {
  const { t } = useTranslation();

  return (
    <BottomSheet
      isVisible={isFilterOpen}
      onClose={() => setIsFilterOpen(false)}
      title={t('filters')}>
      <ScrollView className="mb-6">
        <View className="gap-6">
          <View className="gap-2">
            <Label text={t('gender')} />

            <View className="flex-row gap-3">
              <Tag
                label={t('male')}
                isSelected={selectedGender === 'Male'}
                onPress={() => setSelectedGender('Male')}
              />
              <Tag
                label={t('female')}
                isSelected={selectedGender === 'Female'}
                onPress={() => setSelectedGender('Female')}
              />
            </View>
          </View>

          <View className="gap-2">
            <Label text={t('role')} />

            <View className="flex-row flex-wrap gap-3">
              {[t('general_practitioner'), t('family_physician')].map((role) => (
                <Tag
                  key={role}
                  label={role}
                  isSelected={doctorRole === role}
                  onPress={() => setDoctorRole(role)}
                />
              ))}
            </View>
          </View>

          <View className="gap-2">
            <Label text={t('day')} />

            <View className="flex-row flex-wrap gap-3">
              {[t('morning'), t('afternoon'), t('evening')].map((time) => (
                <Tag
                  key={time}
                  label={time[0].toUpperCase() + time.slice(1).toLowerCase() + ' ' + t('time')}
                  isSelected={selectedDay === time}
                  onPress={() => setSelectedDay(time)}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <ButtonPrimary
        text={t('reset')}
        onPress={() => {
          setSelectedGender(null);
          setDoctorRole(null);
          setSelectedDay(null);
          handleFilterClose();
        }}
      />
    </BottomSheet>
  );
};
