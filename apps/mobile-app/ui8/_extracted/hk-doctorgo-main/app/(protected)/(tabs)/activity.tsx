import { View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import images from '@/data/images';
import Header from '@/components/header';
import ButtonPrimary from '@/components/button-primary';
import Container from '@/components/container';
import Animated, { FadeInDown, FadeInUp, LinearTransition } from 'react-native-reanimated';
import { TabContainer } from '@/components/tab-container';
import { useTranslation } from 'react-i18next';
import CardBook from '@/components/card-book';
import { useState } from 'react';
import useAppointmentStore from '@/store/appointment';
import Modal from '@/components/modal';
import { IconCircleXFilled, IconClearAll, IconInfoCircleFilled } from '@tabler/icons-react-native';
import colors from 'tailwindcss/colors';
import { Doctor } from '@/types/common';
import { useColorScheme } from 'nativewind';

export default function Activity() {
  const { t } = useTranslation();
  const router = useRouter();
  const tabs = ['Upcoming', 'Past'] as const;
  type TabType = (typeof tabs)[number];
  const [doctorModal, setDoctorModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>();
  const appointmentStore = useAppointmentStore();
  const [appointmentModal, setAppointmentModal] = useState<boolean>(false);
  const { colorScheme } = useColorScheme();

  const tabContent: Record<TabType, React.ReactNode> = {
    Upcoming:
      appointmentStore.getAppointments('upcoming').length > 0 ? (
        <Animated.ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {appointmentStore.getAppointments('upcoming').map((doctor, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(index * 100)}
              layout={LinearTransition.springify()}>
              <CardBook
                doctor={doctor.doctor}
                onPress={() => {
                  setSelectedDoctor(doctor.doctor);
                  setDoctorModal(true);
                }}
              />
            </Animated.View>
          ))}
        </Animated.ScrollView>
      ) : (
        <View key="Upcoming">
          <Animated.View className="items-center" entering={FadeInUp.duration(400)}>
            <Image source={images.upcoming} className="w-[280px] h-[380px]" resizeMode="contain" />
          </Animated.View>

          <Animated.Text
            className="text-xl font-semibold mb-2 text-center text-slate-800 dark:text-slate-100"
            entering={FadeInUp.duration(400).delay(100)}>
            {t('no_upcoming_appointments')}
          </Animated.Text>

          <Animated.Text
            className="w-4/5 mx-auto text-slate-600 dark:text-slate-400 text-center font-sans leading-relaxed mb-8"
            entering={FadeInUp.duration(400).delay(200)}>
            {t('schedule_appointements_at_your_convenience')}
          </Animated.Text>

          <Animated.View entering={FadeInUp.duration(400).delay(300)}>
            <ButtonPrimary
              text={t('book_appointment')}
              className="android:mb-2"
              onPress={() => router.push('/book/appointment')}
            />
          </Animated.View>
        </View>
      ),
    Past:
      appointmentStore.getAppointments(['completed', 'cancelled']).length > 0 ? (
        <Animated.ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {appointmentStore.getAppointments(['completed', 'cancelled']).map((doctor, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(index * 100)}
              layout={LinearTransition.springify()}>
              <CardBook doctor={doctor.doctor} />
            </Animated.View>
          ))}
        </Animated.ScrollView>
      ) : (
        <View key="Past">
          <Animated.View className="items-center" entering={FadeInUp.duration(400)}>
            <Image source={images.past} className="w-[280px] h-[380px]" resizeMode="contain" />
          </Animated.View>

          <Animated.Text
            className="text-xl font-semibold mb-2 text-center text-slate-800 dark:text-slate-100"
            entering={FadeInUp.duration(400).delay(100)}>
            {t('no_past_appointments')}
          </Animated.Text>

          <Animated.Text
            className="w-4/5 mx-auto text-slate-600 dark:text-slate-400 text-center font-sans leading-relaxed mb-8"
            entering={FadeInUp.duration(400).delay(200)}>
            {t('ready_to_explore')}
          </Animated.Text>

          <Animated.View entering={FadeInUp.duration(400).delay(300)}>
            <ButtonPrimary
              text={t('discover')}
              className="android:mb-2"
              onPress={() => router.push('/(protected)/(tabs)/discover')}
            />
          </Animated.View>
        </View>
      ),
  };

  return (
    <Container bottom={false}>
      <Header
        name={t('activity')}
        goBack={false}
        textBig
        className="mt-4 justify-between"
        postfixIcon={
          appointmentStore.appointments.length > 0 && (
            <IconClearAll color={colorScheme === 'light' ? colors.slate[800] : colors.slate[300]} />
          )
        }
        onPress={() => setAppointmentModal(true)}
      />

      <TabContainer
        tabs={tabs}
        tabLabel={[t('upcoming'), t('past')]}
        initialTab="Upcoming"
        renderContent={(tab) => tabContent[tab]}
      />

      <Modal
        isVisible={doctorModal}
        icon={<IconInfoCircleFilled strokeWidth={0} size={64} stroke="#514DDF" fill="#514DDF" />}
        title={t('about_this_appointment')}
        description={t('appointment_details')}
        primaryButtonText={t('mark_done')}
        onPrimaryButtonPress={() => {
          appointmentStore.updateAppointmentStatus(selectedDoctor?.id, 'completed');
          setDoctorModal(false);
        }}
        secondaryButtonText={t('cancel_appointment')}
        onSecondaryButtonPress={() => {
          appointmentStore.updateAppointmentStatus(selectedDoctor?.id, 'cancelled');
          setDoctorModal(false);
        }}
      />

      <Modal
        isVisible={appointmentModal}
        title={t('remove_all_appointments')}
        primaryButtonText={t('remove')}
        icon={
          <IconCircleXFilled
            strokeWidth={0}
            size={64}
            stroke={colors.red[500]}
            fill={colors.red[500]}
          />
        }
        onPrimaryButtonPress={() => {
          appointmentStore.clearAppointments();

          setAppointmentModal(false);
        }}
        onClose={() => setAppointmentModal(false)}
      />
    </Container>
  );
}
