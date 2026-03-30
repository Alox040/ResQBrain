import ButtonPrimary from '@/components/button-primary';
import Container from '@/components/container';
import Header from '@/components/header';
import { IconBrandApple, IconBrandFacebook, IconBrandGoogle } from '@tabler/icons-react-native';
import { Link, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import colors from 'tailwindcss/colors';

export default function LoginOptions() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  return (
    <Container className="justify-between">
      <Header />

      <View className="gap-4">
        <ButtonPrimary text={t('login_with_email')} onPress={() => router.push('/auth/login')} />

        <View className="flex-row justify-center gap-2">
          <TouchableOpacity className="p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800">
            <IconBrandFacebook color={colorScheme === 'light' ? '#514DDF' : colors.white} />
          </TouchableOpacity>

          <TouchableOpacity className="p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800">
            <IconBrandGoogle color={colorScheme === 'light' ? '#514DDF' : colors.white} />
          </TouchableOpacity>

          <TouchableOpacity className="p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800">
            <IconBrandApple color={colorScheme === 'light' ? '#514DDF' : colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row justify-center gap-2 android:mb-2">
        <Text className="text-slate-800 dark:text-slate-400 font-medium">
          {t('new_to_doctor_go')}
        </Text>

        <Link
          href="/auth/sign-up-options"
          className="text-primary dark:text-indigo-500 font-semibold">
          {t('sign_up')}
        </Link>
      </View>
    </Container>
  );
}
