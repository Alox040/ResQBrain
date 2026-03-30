import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Header from '@/components/header';
import InputText from '@/components/input-text';
import * as WebBrowser from 'expo-web-browser';
import ButtonPrimary from '@/components/button-primary';
import ButtonSecondary from '@/components/button-secondary';
import BottomSheet from '@/components/bottom-sheet';
import Calendar from '@/components/calendar';
import { PRIVACY_POLICY, TERMS_AND_CONDITIONS } from '@/data/common';
import Container from '@/components/container';
import colors from 'tailwindcss/colors';
import { useColorScheme } from 'nativewind';

export default function MembershipDetails() {
  const router = useRouter();
  const { t } = useTranslation();
  const [nationalId, setNationalId] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const { colorScheme } = useColorScheme();

  return (
    <Container>
      <Header name={t('membership_details')} className="mb-4" />

      <View className="flex-1">
        <Text className="text-base font-sans mb-2 text-slate-800 dark:text-slate-100">
          {t('verify_membership_info')}
        </Text>

        <View className="gap-6 mt-4">
          <InputText
            label={t('national_id_label')}
            placeholder={t('national_id_placeholder')}
            value={nationalId}
            onChangeText={setNationalId}
          />

          <InputText
            label={t('date_of_birth')}
            placeholder={t('dd_mm_yyyy')}
            value={selectedDate}
            onPress={() => setShowDatePicker(true)}
            caretHidden={true}
          />

          <View className="flex-row items-start gap-3">
            <BouncyCheckbox
              isChecked={acceptedTerms}
              disableText
              useBuiltInState={false}
              fillColor="#514DDF"
              unFillColor={
                colorScheme === 'light'
                  ? colorScheme === 'light'
                    ? colors.white
                    : colors.slate[800]
                  : colors.slate[800]
              }
              onPress={(agree: boolean) => setAcceptedTerms(!agree)}
            />

            <Pressable onPress={() => setAcceptedTerms(!acceptedTerms)}>
              <Text className="-mt-1 text-slate-800 dark:text-slate-100 leading-relaxed font-sans">
                {t('agree_to')}
                {'\n'}
                <Text
                  className="text-primary"
                  onPress={() => WebBrowser.openBrowserAsync(TERMS_AND_CONDITIONS)}>
                  {t('terms_and_conditions')}
                </Text>{' '}
                {t('and')}{' '}
                <Text
                  className="text-primary"
                  onPress={() => WebBrowser.openBrowserAsync(PRIVACY_POLICY)}>
                  {t('privacy_policy')}
                </Text>
                .
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <BottomSheet
        isVisible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        title={t('select_date')}>
        <Calendar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onClose={() => setShowDatePicker(false)}
          maxDate={new Date()}
        />
      </BottomSheet>

      {!acceptedTerms || !nationalId ? (
        <ButtonSecondary
          className="android:mb-2"
          disabled={!acceptedTerms || !nationalId}
          text={t('next')}
        />
      ) : (
        <ButtonPrimary
          text={t('next')}
          className="android:mb-2"
          onPress={() => router.push('/membership/healthwise-plus')}
        />
      )}
    </Container>
  );
}
