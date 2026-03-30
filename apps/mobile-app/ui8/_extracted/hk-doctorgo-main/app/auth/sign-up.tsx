import ButtonPrimary from '@/components/button-primary';
import Container from '@/components/container';
import Header from '@/components/header';
import InputText from '@/components/input-text';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import ShowPassword from '@/components/show-password';

export default function SignUp() {
  const { t } = useTranslation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const signUpSchema = z.object({
    firstName: z.string().min(1, t('first_name_required')),
    lastName: z.string().min(1, t('last_name_required')),
    email: z.string().email(t('invalid_email')),
    password: z.string().min(6, t('password_min_length')),
  });

  type SignUpFormData = z.infer<typeof signUpSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    console.log('Form data:', data);

    router.push('/auth/details');
  };

  return (
    <Container className="justify-between">
      <View>
        <Header name={t('sign_up')} />

        <View className="gap-4 mt-4">
          <Text className="text-slate-800 dark:text-slate-100 font-sans leading-relaxed">
            {t('ensure_personal_details_complete')}
          </Text>

          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <InputText
                label={t('first_name')}
                placeholder={t('enter_your_first_name')}
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
                placeholder={t('enter_your_last_name')}
                onChangeText={onChange}
                value={value}
                error={errors.lastName?.message}
              />
            )}
          />

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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View>
                <View className="relative">
                  <InputText
                    label={t('password')}
                    placeholder={t('enter_password')}
                    secureTextEntry={!showPassword}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password?.message}
                    postfixIcon={
                      <ShowPassword
                        showPassword={showPassword}
                        handlePress={() => setShowPassword(!showPassword)}
                      />
                    }
                  />
                </View>
              </View>
            )}
          />
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
