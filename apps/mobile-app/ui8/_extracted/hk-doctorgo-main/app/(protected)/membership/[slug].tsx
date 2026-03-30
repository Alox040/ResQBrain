import { View, Text, Image, ScrollView } from 'react-native';
import { IconInfoCircleFilled, IconLink } from '@tabler/icons-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/header';
import ButtonPrimary from '@/components/button-primary';
import ButtonSecondary from '@/components/button-secondary';
import * as WebBrowser from 'expo-web-browser';
import { healthPlanTypes, TERMS_AND_CONDITIONS } from '@/data/common';
import Modal from '@/components/modal';
import { useLocalSearchParams } from 'expo-router';
import Container from '@/components/container';

export default function MembershipPlan() {
  const { t } = useTranslation();
  const { slug } = useLocalSearchParams();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const healthPlan = healthPlanTypes.find((plan) => plan.slug === slug);
  const plan = {
    name: healthPlan ? t(healthPlan.name) : '',
    description: healthPlan ? t(healthPlan.description) : '',
    price: healthPlan ? t(healthPlan.price) : '',
    image: healthPlan ? healthPlan.image : '',
  };

  return (
    <Container>
      <Header name={plan.name} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mt-6 bg-peach-100 rounded-2xl p-6 flex-row items-center border border-slate-200 dark:border-slate-800">
          <View className="flex-1 gap-3">
            <Text className="text-xl font-semibold text-primary dark:text-indigo-400">
              {plan.name}
            </Text>

            <Text className="mt-2 text-base font-sans text-slate-800 dark:text-white">
              {plan.description}
            </Text>

            <Text className="text-2xl font-bold text-slate-800 dark:text-slate-400">
              {plan.price}
            </Text>
          </View>
          <Image source={plan.image} className="w-32 h-32" />
        </View>

        <View className="mt-8">
          <Text className="text-base text-slate-600 dark:text-white font-sans">
            {t('age_requirement')}
          </Text>

          <View className="mt-6">
            <Text className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {t('virtual_consultation_247')}
            </Text>
            <Text className="mt-2 text-base font-sans text-slate-800 dark:text-slate-100">
              {t('virtual_consultation_description')}
            </Text>

            <View className="mt-4 gap-2">
              <Text className="text-base font-sans text-slate-800 dark:text-slate-100">
                {t('standard_consultation')}
              </Text>
              <Text className="text-base font-sans text-slate-800 dark:text-slate-100">
                {t('premium_consultation')}
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {t('gp_clinic')}
            </Text>
            <Text className="mt-2 text-base font-sans text-slate-800 dark:text-slate-100">
              {t('gp_consultation_price')}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="gap-2 mb-6">
        <ButtonSecondary
          text={t('terms_conditions_apply')}
          prefixIcon={<IconLink size={18} strokeWidth={2.75} color={'#514DDF'} />}
          onPress={() => WebBrowser.openBrowserAsync(TERMS_AND_CONDITIONS)}
        />
        <ButtonPrimary text={t('purchase_health_plan')} onPress={() => setModalVisible(true)} />
      </View>

      <Modal
        isVisible={isModalVisible}
        title={plan.name}
        onClose={() => setModalVisible(false)}
        onPrimaryButtonPress={() => setModalVisible(false)}
        onSecondaryButtonPress={() => setModalVisible(false)}
        icon={<IconInfoCircleFilled strokeWidth={0} size={64} stroke="#514DDF" fill="#514DDF" />}
        primaryButtonText={t('continue')}
        secondaryButtonText={t('cancel')}
        description={t('multiple_memberships_notice')}
      />
    </Container>
  );
}
