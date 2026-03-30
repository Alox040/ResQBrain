import { IconMoonFilled, IconSunFilled, IconWorld } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ButtonOutline from '@/components/button-outline';
import ButtonPrimary from '@/components/button-primary';
import ButtonSecondary from '@/components/button-secondary';
import colors from 'tailwindcss/colors';
import Container from '@/components/container';
import { useTranslation } from 'react-i18next';
import CarouselOnboarding from '@/components/carousel-onboarding';
import { useColorScheme } from 'nativewind';
import { TouchableOpacity } from 'react-native';
import { useSettingsStore } from '@/store/settings';

export default function Onboarding() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { theme, setTheme } = useSettingsStore();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Container className="justify-between" bottom={true}>
      <Animated.View
        entering={FadeInDown.duration(500).delay(1500)}
        className={'flex-row items-center justify-between'}>
        <TouchableOpacity onPress={toggleTheme}>
          {colorScheme === 'light' ? (
            <IconMoonFilled color={colors.indigo[800]} />
          ) : (
            <IconSunFilled color={colors.yellow[400]} />
          )}
        </TouchableOpacity>

        <ButtonOutline
          prefixIcon={
            <IconWorld
              strokeWidth={2}
              color={colorScheme === 'light' ? colors.slate[800] : colors.slate[100]}
            />
          }
          text={t('lang')}
          onPress={() => router.push('/languages')}
          className="w-[80px]"
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(500)}>
        <CarouselOnboarding />
      </Animated.View>

      <Animated.View className="gap-2 android:mb-2" entering={FadeInDown.duration(500).delay(1000)}>
        <ButtonPrimary text={t('sign_up')} onPress={() => router.push('/auth/sign-up-options')} />

        <ButtonSecondary text={t('login')} onPress={() => router.push('/auth/login-options')} />
      </Animated.View>
    </Container>
  );
}
