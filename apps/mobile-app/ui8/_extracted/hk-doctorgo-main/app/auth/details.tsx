import { IconGenderFemale, IconGenderMale } from '@tabler/icons-react-native';
import { useContext, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '@/components/header';
import InputText from '@/components/input-text';
import RadioGroup from '@/components/radio-group';
import ButtonPrimary from '@/components/button-primary';
import BottomSheet from '@/components/bottom-sheet';
import Calendar from '@/components/calendar';
import { PRIVACY_POLICY, TERMS_AND_CONDITIONS } from '@/data/common';
import Container from '@/components/container';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '@/utils/auth-context';
import { useColorScheme } from 'nativewind';
import colors from 'tailwindcss/colors';

export default function Details() {
  const { t } = useTranslation();
  const authContext = useContext(AuthContext);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { colorScheme } = useColorScheme();

  const detailsSchema = z.object({
    dateOfBirth: z.string().min(1, t('date_of_birth_required')),
    gender: z.string().min(1, t('gender_required')),
    agree: z.boolean().refine((val) => val === true, {
      message: t('terms_and_conditions_required'),
    }),
  });

  type DetailsFormData = z.infer<typeof detailsSchema>;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<DetailsFormData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      dateOfBirth: '',
      gender: '',
      agree: false,
    },
  });

  const selectedDate = watch('dateOfBirth');
  const selectedGender = watch('gender');
  const agree = watch('agree');

  const onSubmit = (data: DetailsFormData) => {
    console.log('Form data:', data);

    authContext.logIn();
  };

  return (
    <Container className="justify-between">
      <View>
        <Header name={t('details')} />

        <View className="gap-4 mt-4">
          <Text className="text-slate-800 dark:text-slate-100 font-sans leading-relaxed">
            {t('ensure_date_of_birth_is_accurate')}
          </Text>

          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field: { value } }) => (
              <InputText
                label={t('date_of_birth')}
                placeholder={t('dd_mm_yyyy')}
                value={value}
                onPress={() => setShowDatePicker(true)}
                caretHidden={true}
                inputMode="none"
                error={errors.dateOfBirth?.message}
              />
            )}
          />

          <BottomSheet
            isVisible={showDatePicker}
            onClose={() => setShowDatePicker(false)}
            title={t('select_date')}>
            <Calendar
              selectedDate={selectedDate}
              onDateChange={(date) => {
                setValue('dateOfBirth', date);
                setShowDatePicker(false);
              }}
              onClose={() => setShowDatePicker(false)}
              maxDate={new Date()}
            />
          </BottomSheet>

          <View className="gap-3">
            <Text className="font-semibold text-slate-800 dark:text-slate-300">{t('gender')}</Text>

            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange } }) => (
                <RadioGroup
                  options={[
                    {
                      value: 'male',
                      label: t('male'),
                      icon: (
                        <IconGenderMale
                          color={colorScheme === 'light' ? '#514DDF' : colors.white}
                          size={32}
                        />
                      ),
                    },
                    {
                      value: 'female',
                      label: t('female'),
                      icon: (
                        <IconGenderFemale
                          color={colorScheme === 'light' ? '#514DDF' : colors.white}
                          size={32}
                        />
                      ),
                    },
                  ]}
                  selectedValue={selectedGender}
                  onValueChange={(value) => onChange(value)}
                  error={errors.gender?.message}
                />
              )}
            />
          </View>

          <View className="items-start gap-3">
            <View className="flex-row items-center gap-3">
              <Controller
                control={control}
                name="agree"
                render={({ field: { onChange } }) => (
                  <BouncyCheckbox
                    isChecked={agree}
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
                    onPress={() => onChange(!agree)}
                  />
                )}
              />

              <Pressable onPress={() => setValue('agree', !agree)}>
                <Text className="text-slate-800 dark:text-slate-100 leading-relaxed font-sans">
                  {t('agree_to') + '\n'}
                  <Text
                    className="text-primary"
                    onPress={() => WebBrowser.openBrowserAsync(TERMS_AND_CONDITIONS)}>
                    {t('terms_and_conditions')}
                  </Text>
                  {` ${t('and')} `}
                  <Text
                    className="text-primary"
                    onPress={() => WebBrowser.openBrowserAsync(PRIVACY_POLICY)}>
                    {t('privacy_policy')}
                  </Text>
                </Text>
              </Pressable>
            </View>

            {errors.agree && (
              <Text className="text-sm text-red-500 dark:text-red-500/80">
                {errors.agree?.message}
              </Text>
            )}
          </View>
        </View>
      </View>

      <ButtonPrimary
        text={t('sign_up')}
        className="android:mb-2"
        onPress={handleSubmit(onSubmit)}
      />
    </Container>
  );
}
