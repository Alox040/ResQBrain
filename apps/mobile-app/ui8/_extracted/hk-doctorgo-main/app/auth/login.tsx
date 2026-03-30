import ButtonPrimary from '@/components/button-primary';
import Container from '@/components/container';
import Header from '@/components/header';
import { Link } from 'expo-router';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputText from '@/components/input-text';
import ShowPassword from '@/components/show-password';
import { AuthContext } from '@/utils/auth-context';

export default function Login() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const authContext = useContext(AuthContext);

  const loginSchema = z.object({
    email: z.string().email(t('invalid_email')),
    password: z.string().min(6, t('password_min_length')),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log('Form data:', data);

    authContext.logIn();
  };

  return (
    <Container className="justify-between">
      <View className="gap-4">
        <Header name={t('login')} />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View>
              <InputText
                label={t('email')}
                placeholder={t('enter_email')}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                error={errors.email?.message}
              />
            </View>
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

        <Link href="/auth/forgot-password">
          <Text className="text-center font-medium text-primary dark:text-indigo-500">
            {t('forgot_password_question')}
          </Text>
        </Link>
      </View>

      <ButtonPrimary text={t('login')} className="android:mb-2" onPress={handleSubmit(onSubmit)} />
    </Container>
  );
}
