import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { IconCircleCheck, IconCircleCheckFilled } from '@tabler/icons-react-native';
import { IconChevronDown, IconChevronRight, IconX } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import CountryFlag from 'react-native-country-flag';
import Header from '@/components/header';
import colors from 'tailwindcss/colors';
import Modal from '@/components/modal';
import Container from '@/components/container';
import images from '@/data/images';
import { useTranslation } from 'react-i18next';
import { default as BaseBottomSheet } from 'react-native-modal';
import { useColorScheme } from 'nativewind';

export default function Membership() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Singapore');
  const [showConsentModal, setShowConsentModal] = useState(false);

  const membershipPrograms = [
    {
      name: t('sg_health_insurance'),
      country: 'Singapore',
      logo: images.logo1,
    },
    {
      name: t('sg_corporate_healthcare'),
      country: 'Singapore',
      logo: images.logo2,
    },
    {
      name: t('my_healthcare_benefits'),
      country: 'Malaysia',
      logo: images.logo3,
    },
    {
      name: t('my_employee_wellness'),
      country: 'Malaysia',
      logo: images.logo4,
    },
    {
      name: t('th_corporate_health'),
      country: 'Thailand',
      logo: images.logo5,
    },
    {
      name: t('th_enterprise_health'),
      country: 'Thailand',
      logo: images.logo6,
    },
    {
      name: t('ph_health_benefits'),
      country: 'Philippines',
      logo: images.logo7,
    },
    {
      name: t('ph_corporate_benefits'),
      country: 'Philippines',
      logo: images.logo8,
    },
  ];

  const countries = [
    {
      name: 'Singapore',
      code: 'SG',
    },
    {
      name: 'Malaysia',
      code: 'MY',
    },
    {
      name: 'Thailand',
      code: 'TH',
    },
    {
      name: 'Philippines',
      code: 'PH',
    },
  ];

  return (
    <Container>
      <Header name={t('membership_details')} />

      <ScrollView className="flex-1 mt-4">
        <Text className="text-slate-600 dark:text-slate-100 mb-8 font-sans leading-normal">
          {t('choose_location_description')}
        </Text>

        <Header name={t('choose_location')} goBack={false} className="mb-4" />

        <TouchableOpacity
          className="flex-row items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl mb-8 bg-slate-50 dark:bg-slate-800"
          onPress={() => setShowCountryModal(true)}>
          <View className="flex-row items-center gap-2">
            <CountryFlag
              isoCode={countries.find((c) => c.name === selectedCountry)?.code || 'SG'}
              size={24}
            />
            <Text className="text-base font-sans text-slate-800 dark:text-slate-100">
              {selectedCountry}
            </Text>
          </View>
          <IconChevronDown
            size={20}
            color={colorScheme === 'light' ? '#64748B' : colors.slate[200]}
          />
        </TouchableOpacity>

        <Header name={t('membership_programme')} goBack={false} className="mb-4" />

        <View className="gap-4">
          {membershipPrograms
            .filter((program) => program.country === selectedCountry)
            .map((program, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800"
                onPress={() => {
                  setShowConsentModal(true);
                }}>
                <View className="flex-row items-center gap-3">
                  <Image source={program.logo} className="w-12 h-12" resizeMode="contain" />
                  <Text className="text-base font-sans text-slate-800 dark:text-slate-100">
                    {program.name}
                  </Text>
                </View>
                <IconChevronRight
                  size={20}
                  color={colorScheme === 'light' ? '#64748B' : colors.slate[200]}
                />
              </TouchableOpacity>
            ))}
        </View>

        <Modal
          isVisible={showConsentModal}
          title={t('consent_terms')}
          onClose={() => setShowConsentModal(false)}
          onPrimaryButtonPress={() => {
            setShowConsentModal(false);
            router.push('/membership/details');
          }}
          onSecondaryButtonPress={() => setShowConsentModal(false)}
          icon={<IconCircleCheckFilled strokeWidth={0} size={64} stroke="#514DDF" fill="#514DDF" />}
          primaryButtonText={t('accept')}
          secondaryButtonText={t('cancel')}
          description={t('consent_description')}
        />

        <BaseBottomSheet
          isVisible={showCountryModal}
          backdropOpacity={0.5}
          onBackdropPress={() => setShowCountryModal(false)}
          onBackButtonPress={() => setShowCountryModal(false)}
          style={{ margin: 0 }}>
          <View className="flex-1 justify-end">
            <View className="bg-white dark:bg-slate-900 rounded-t-3xl px-6 pb-6">
              <View className="flex-row items-center justify-between py-4 border-b border-slate-100 dark:border-b-slate-800">
                <Text className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Country
                </Text>

                <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                  <IconX
                    size={24}
                    color={colorScheme === 'light' ? colors.slate[600] : colors.slate[400]}
                  />
                </TouchableOpacity>
              </View>

              <View className="py-4 gap-4">
                {countries.map((country, index) => (
                  <TouchableOpacity
                    key={index}
                    className="flex-row items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800"
                    onPress={() => {
                      setSelectedCountry(country.name);
                      setShowCountryModal(false);
                    }}>
                    <View className="flex-row items-center gap-3">
                      <CountryFlag isoCode={country.code} size={32} />

                      <Text className="text-lg text-slate-800 dark:text-slate-100">
                        {country.name}
                      </Text>
                    </View>

                    {selectedCountry === country.name && (
                      <IconCircleCheck
                        size={28}
                        fill={colorScheme === 'light' ? '#514DDF' : colors.slate[900]}
                        stroke={colorScheme === 'light' ? '#fff' : colors.white}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </BaseBottomSheet>
      </ScrollView>
    </Container>
  );
}
