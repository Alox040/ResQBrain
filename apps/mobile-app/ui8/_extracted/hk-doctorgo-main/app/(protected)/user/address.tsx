import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '@/components/header';
import Container from '@/components/container';
import ButtonPrimary from '@/components/button-primary';
import InputText from '@/components/input-text';
import Dropdown from '@/components/dropdown';
import { useTranslation } from 'react-i18next';
import { countryData } from '@/data/common';
import { CountrySelectItem } from '@/types/common';
import { useUserStore } from '@/store/user';

export default function Address() {
  const router = useRouter();
  const { t } = useTranslation();
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const address = useUserStore((state) => state.address);

  const addressSchema = z.object({
    postalCode: z.string().min(1, t('postal_code_required')),
    streetAddress: z
      .string()
      .min(1, t('street_address_required'))
      .max(50, t('street_address_too_long')),
    unitNumber: z.string().min(1, t('unit_number_required')),
    city: z.string().min(1, t('city_required')),
    country: z.string().min(1, t('country_required')),
  });

  type AddressFormData = z.infer<typeof addressSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      postalCode: address.postalCode,
      streetAddress: address.streetAddress,
      unitNumber: address.unitNumber,
      city: address.city,
      country: address.country,
    },
  });

  const onSubmit = (data: AddressFormData) => {
    setUserInfo({ address: data });
    router.back();
  };

  return (
    <Container className="justify-between gap-y-4">
      <Header name={t('address')} />

      <ScrollView contentContainerClassName="gap-6" showsVerticalScrollIndicator={false}>
        <Controller
          control={control}
          name="postalCode"
          render={({ field: { onChange, value } }) => (
            <InputText
              label={t('postal_code')}
              placeholder={t('postal_code_placeholder')}
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              error={errors.postalCode?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="streetAddress"
          render={({ field: { onChange, value } }) => (
            <InputText
              label={t('street_address')}
              placeholder={t('street_address_placeholder')}
              helpText={t('character_limit', { count: 50 })}
              value={value}
              onChangeText={onChange}
              error={errors.streetAddress?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="unitNumber"
          render={({ field: { onChange, value } }) => (
            <InputText
              label={t('unit_house_number')}
              placeholder={t('unit_house_number_placeholder')}
              value={value}
              onChangeText={onChange}
              error={errors.unitNumber?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, value } }) => (
            <InputText
              label={t('city')}
              placeholder={t('city_placeholder')}
              value={value}
              onChangeText={onChange}
              error={errors.city?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="country"
          render={({ field: { onChange, value } }) => (
            <Dropdown
              label={t('country')}
              value={value}
              data={countryData}
              onChange={(item: CountrySelectItem) => onChange(item.value)}
              placeholder={t('select_country')}
              error={errors.country?.message}
            />
          )}
        />
      </ScrollView>

      <ButtonPrimary text={t('save')} className="android:mb-2" onPress={handleSubmit(onSubmit)} />
    </Container>
  );
}
