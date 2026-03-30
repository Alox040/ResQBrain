import ButtonPrimary from '@/components/button-primary';
import Container from '@/components/container';
import Header from '@/components/header';
import InputText from '@/components/input-text';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const router = useRouter();

  const forgotPasswordSchema = z.object({
    email: z.string().email(t('invalid_email')),
  });

  type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log('Form data:', data);
    router.push('/(protected)/(tabs)');
  };

  return (
    <Container className="justify-between">
      <View className="gap-4">
        <Header name={t('forgot_password')} />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <InputText
              label={t('email')}
              placeholder={t('enter_email')}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              error={errors.email?.message}
            />
          )}
        />
      </View>

      <ButtonPrimary
        text={t('reset_password')}
        className="android:mb-2"
        onPress={handleSubmit(onSubmit)}
      />
    </Container>
  );
}
