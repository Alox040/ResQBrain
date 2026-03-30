import MarketplaceBestsellers from '@/components/marketplace-bestsellers';
import { highlightData, quickActions, virtualConsultationData } from '@/data/common';
import { IconArrowRight } from '@tabler/icons-react-native';
import { Href, Link, useRouter } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import Header from '@/components/header';
import CardConsulant from '@/components/card-consultant';
import { getGreetingTime } from '@/utils/common';
import BottomSheet from '@/components/bottom-sheet';
import ButtonPrimary from '@/components/button-primary';
import ButtonSecondary from '@/components/button-secondary';
import Container from '@/components/container';
import Avatar from '@/components/avatar';
import images from '@/data/images';
import { useTranslation } from 'react-i18next';
import ModalComingSoon from '@/components/modal-coming-soon';
import Carousel from '@/components/carousel';
import { useUserStore } from '@/store/user';
import { QuickActionItem } from '@/types/common';
import { useColorScheme } from 'nativewind';
import colors from 'tailwindcss/colors';

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userStore = useUserStore();
  const { colorScheme } = useColorScheme();

  return (
    <Container bottom={false}>
      <ScrollView
        contentContainerStyle={{
          gap: 24,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}>
        <Animated.View
          className="flex-row items-center gap-4 pt-4"
          entering={FadeInUp.duration(200)}>
          <Link href="/user/profile">
            <Avatar size="sm" imageUrl="https://mighty.tools/mockmind-api/content/human/80.jpg" />
          </Link>

          <Header
            name={`${t('good')} ${getGreetingTime(t)}, ${userStore.firstName}`}
            goBack={false}
            textBig
          />
        </Animated.View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ justifyContent: 'space-between' }}>
          {quickActions.map((action: QuickActionItem, index: number) => (
            <Animated.View entering={FadeInUp.duration(200).delay(index * 100)} key={index}>
              <TouchableOpacity
                className="w-[90px] items-center gap-2"
                onPress={() => {
                  switch (action.label) {
                    case 'call_doctor_now':
                      setIsModalVisible(true);
                      break;
                    case 'referral_support':
                      setShowReferralModal(true);
                      break;
                    default:
                      router.push(action.route as Href);
                      break;
                  }
                }}>
                <View className="p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-primary/10 dark:bg-primary/15">
                  <action.icon
                    strokeWidth={1.75}
                    color={colorScheme === 'light' ? '#514DDF' : colors.indigo[100]}
                    size={28}
                  />
                </View>

                <Text className="font-sans text-center text-slate-800 dark:text-slate-100 leading-tight">
                  {t(action.label)}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        <Animated.View entering={FadeInUp.duration(200).delay(600)}>
          <Carousel
            data={highlightData}
            onPress={(index) => {
              console.log(`carousel pressed ${index}`);
            }}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(200).delay(700)}>
          <Header
            name={t('virtual_consultation')}
            goBack={false}
            postfixIcon={
              <IconArrowRight color={colorScheme === 'light' ? '#514DDF' : colors.indigo[400]} />
            }
            onPress={() => router.navigate('/book/appointment')}
            className="justify-between"
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(200).delay(800)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 14 }}>
            {virtualConsultationData.map(({ title, image, price }, index) => (
              <CardConsulant title={title} image={image} price={price} key={index} />
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(200).delay(900)}>
          <Header name={t('membership_plan')} goBack={false} />
        </Animated.View>

        <Animated.View
          className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-primary/10 dark:bg-primary/15"
          entering={FadeInUp.duration(200).delay(1000)}>
          <TouchableOpacity
            onPress={() => router.push('/membership/overview')}
            className="flex-row items-center gap-4">
            <View className="flex-1 gap-2">
              <Text className="text-base font-sans text-slate-800 dark:text-slate-100">
                {t('link_company_membership')}
              </Text>

              <View className="flex-row items-center gap-2">
                <Text className="font-medium text-primary dark:text-indigo-400">
                  {t('continue')}
                </Text>

                <IconArrowRight
                  size={18}
                  strokeWidth={2.5}
                  color={colorScheme === 'light' ? '#514DDF' : colors.indigo[400]}
                />
              </View>
            </View>

            <Image source={images.membership} className="w-32 h-32" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(200).delay(1100)}>
          <Header
            name={t('marketplace_bestsellers')}
            goBack={false}
            postfixIcon={
              <IconArrowRight color={colorScheme === 'light' ? '#514DDF' : colors.indigo[400]} />
            }
            onPress={() => router.push('/marketplace/overview')}
            className="justify-between"
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(200).delay(1200)}>
          <MarketplaceBestsellers navigationReplace={false} />
        </Animated.View>
      </ScrollView>

      <BottomSheet
        isVisible={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        closeText={t('close')}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="items-center mb-6">
            <Image source={images.specialistCare} className="w-48 h-48" resizeMode="contain" />
          </View>

          <Text className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            {t('get_specialist_care_and_referral_support')}
          </Text>

          <Text className="text-slate-600 dark:text-slate-400 text-base mb-6">
            {t('specialists_care_description')}
          </Text>

          <View className="gap-2 mb-8">
            <Text className="text-slate-600 dark:text-slate-400 text-base">
              • {t('specialist_recommendations')}
            </Text>
            <Text className="text-slate-600 dark:text-slate-400 text-base">
              • {t('appointment_scheduling')}
            </Text>
            <Text className="text-slate-600 dark:text-slate-400 text-base">
              • {t('insurance_coordination')}
            </Text>
          </View>

          <View className="gap-2">
            <ButtonPrimary
              text={t('get_support_at_no_cost')}
              onPress={() => {
                setShowReferralModal(false);

                setTimeout(() => {
                  setIsModalVisible(true);
                }, 500);
              }}
            />

            <ButtonSecondary
              text={t('consult_a_general_practitioner')}
              onPress={() => {
                setShowReferralModal(false);
                router.push('/book/gp');
              }}
            />
          </View>
        </ScrollView>
      </BottomSheet>

      <ModalComingSoon isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </Container>
  );
}
