import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '@/components/header';
import Container from '@/components/container';
import ButtonPrimary from '@/components/button-primary';
import InputText from '@/components/input-text';
import Dropdown from '@/components/dropdown';
import { countryCodeData, getRelationshipData } from '@/data/common';
import { useTranslation } from 'react-i18next';
import { RelationshipItem } from '@/types/common';
import { useUserStore } from '@/store/user';
import Label from '@/components/label';

export default function Emergency() {
  const router = useRouter();
  const { t } = useTranslation();
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const emergency = useUserStore((state) => state.emergency);

  const emergencySchema = z.object({
    name: z.string().min(1, t('name_required')),
    relationship: z.string().min(1, t('relationship_required')),
    countryCode: z.string().min(1, t('country_code_required')),
    phone: z
      .string()
      .min(1, t('phone_required'))
      .regex(/^[0-9]+$/, t('invalid_phone')),
  });

  type EmergencyFormData = z.infer<typeof emergencySchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmergencyFormData>({
    resolver: zodResolver(emergencySchema),
    defaultValues: {
      name: emergency.name,
      relationship: emergency.relationship,
      countryCode: emergency.countryCode,
      phone: emergency.phone,
    },
  });

  const onSubmit = (data: EmergencyFormData) => {
    setUserInfo({ emergency: data });
    router.back();
  };

  return (
    <Container>
      <Header name={t('emergency_contact_details')} />

      <ScrollView
        className="flex-1 mt-4"
        contentContainerClassName="gap-6"
        showsVerticalScrollIndicator={false}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <InputText
              label={t('name')}
              placeholder={t('name_placeholder')}
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="relationship"
          render={({ field: { onChange, value } }) => (
            <Dropdown
              label={t('relationship')}
              placeholder={t('relationship_placeholder')}
              value={value}
              data={getRelationshipData(t)}
              onChange={(item: RelationshipItem) => onChange(item.value)}
              error={errors.relationship?.message}
            />
          )}
        />

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
      </ScrollView>

      <ButtonPrimary text={t('save')} className="android:mb-2" onPress={handleSubmit(onSubmit)} />
    </Container>
  );
}
