import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ButtonPrimary from '@/components/button-primary';
import Header from '@/components/header';
import Container from '@/components/container';
import Dropdown from '@/components/dropdown';
import InputText from '@/components/input-text';
import { countryCodeData } from '@/data/common';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/user';
import Label from '@/components/label';

export default function Contact() {
  const router = useRouter();
  const { t } = useTranslation();
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const userStore = useUserStore();

  const contactSchema = z.object({
    countryCode: z.string().min(1, t('country_code_required')),
    phone: z
      .string()
      .min(1, t('phone_required'))
      .regex(/^[0-9]+$/, t('invalid_phone')),
    email: z.string().email(t('invalid_email')),
  });

  type ContactFormData = z.infer<typeof contactSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      countryCode: userStore.countryCode,
      phone: userStore.phone,
      email: userStore.email,
    },
  });

  const onSubmit = (data: ContactFormData) => {
    setUserInfo(data);

    router.back();
  };

  return (
    <Container>
      <Header name={t('contact_details')} />

      <ScrollView className="flex-1 mt-4" showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          <View className="gap-3">
            <Label text={t('mobile_number')} />

            <View className="flex-row gap-3">
              <View className="w-[88px]">
                <Controller
                  control={control}
                  name="countryCode"
                  render={({ field: { onChange, value } }) => (
                    <Dropdown
                      placeholder={t('country_code_placeholder')}
                      value={value}
                      data={countryCodeData}
                      searchable={false}
                      onChange={(item) => onChange(item.value)}
                      error={errors.countryCode?.message}
                    />
                  )}
                />
              </View>

              <View className="flex-1">
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, value } }) => (
                    <InputText
                      placeholder={t('mobile_number_placeholder')}
                      keyboardType="phone-pad"
                      value={value}
                      onChangeText={onChange}
                      error={errors.phone?.message}
                    />
                  )}
                />
              </View>
            </View>
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <InputText
                label={t('email_address')}
                placeholder={t('email_address_placeholder')}
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />
        </View>
      </ScrollView>

      <ButtonPrimary text={t('save')} className="android:mb-2" onPress={handleSubmit(onSubmit)} />
    </Container>
  );
}
