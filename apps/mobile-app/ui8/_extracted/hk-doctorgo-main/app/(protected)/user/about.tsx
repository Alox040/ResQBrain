import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  IconDualScreen,
  IconGenderFemale,
  IconGenderMale,
  IconId,
} from '@tabler/icons-react-native';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '@/components/header';
import ButtonPrimary from '@/components/button-primary';
import Container from '@/components/container';
import InputText from '@/components/input-text';
import RadioGroup from '@/components/radio-group';
import Dropdown from '@/components/dropdown';
import { countryData } from '@/data/common';
import { useTranslation } from 'react-i18next';
import { CountrySelectItem } from '@/types/common';
import { useUserStore } from '@/store/user';
import { useColorScheme } from 'nativewind';
import colors from 'tailwindcss/colors';

export default function About() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setUserInfo } = useUserStore();
  const { colorScheme } = useColorScheme();

  const aboutSchema = z.object({
    firstName: z.string().min(1, t('first_name_required')),
    lastName: z.string().min(1, t('last_name_required')),
    idType: z.string().min(1, t('id_type_required')),
    nric: z.string().min(1, t('nric_required')),
    citizenship: z.string().min(1, t('citizenship_required')),
    gender: z.string().min(1, t('gender_required')),
  });

  type AboutFormData = z.infer<typeof aboutSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: useUserStore.getState(),
  });

  const onSubmit = (data: AboutFormData) => {
    setUserInfo(data);
    router.back();
  };

  return (
    <Container>
      <Header name={t('about_me')} />

      <ScrollView className="flex-1 my-4" showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <InputText
                label={t('first_name')}
                placeholder="John"
                onChangeText={onChange}
                value={value}
                error={errors.firstName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <InputText
                label={t('last_name')}
                placeholder="Doe"
                onChangeText={onChange}
                value={value}
                error={errors.lastName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="idType"
            render={({ field: { onChange, value } }) => (
              <View className="gap-3">
                <Text className="font-semibold text-slate-800 dark:text-slate-300">
                  {t('id_type')}
                </Text>

                <RadioGroup
                  options={[
                    {
                      value: 'id',
                      label: t('id'),
                      icon: (
                        <IconId
                          color={colorScheme === 'light' ? '#514DDF' : colors.white}
                          size={32}
                        />
                      ),
                    },
                    {
                      value: 'passport',
                      label: t('passport'),
                      icon: (
                        <IconDualScreen
                          color={colorScheme === 'light' ? '#514DDF' : colors.white}
                          size={32}
                        />
                      ),
                    },
                  ]}
                  selectedValue={value}
                  onValueChange={onChange}
                  error={errors.idType?.message}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="nric"
            render={({ field: { onChange, value } }) => (
              <InputText
                label={t('nric')}
                placeholder="e.g K0001234H"
                helpText={t('we_need_your_nric_details')}
                onChangeText={onChange}
                value={value}
                error={errors.nric?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="citizenship"
            render={({ field: { onChange, value } }) => (
              <Dropdown
                label={t('country_of_citizenship')}
                value={value}
                data={countryData}
                onChange={(item: CountrySelectItem) => onChange(item.value)}
                placeholder={t('select_country')}
                error={errors.citizenship?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <View className="gap-3">
                <Text className="font-semibold text-slate-800 dark:text-slate-300">
                  {t('gender')}
                </Text>

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
                  selectedValue={value}
                  onValueChange={onChange}
                  error={errors.gender?.message}
                />
              </View>
            )}
          />
        </View>
      </ScrollView>

      <ButtonPrimary text={t('save')} className="android:mb-2" onPress={handleSubmit(onSubmit)} />
    </Container>
  );
}
