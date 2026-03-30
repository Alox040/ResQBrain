import { SplashScreen, Stack } from 'expo-router';
import '@/i18n';
import '../global.css';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { AuthProvivder } from '@/utils/auth-context';
import { useColorScheme } from 'nativewind';
import { useSettingsStore } from '@/store/settings';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { theme } = useSettingsStore();

  useEffect(() => {
    if (theme === 'system') {
      setColorScheme('system');
    } else {
      setColorScheme(theme);
    }
  }, [theme]);

  const [fontsLoaded] = useFonts({
    'rubik-extrabold': require('@/assets/fonts/Rubik-ExtraBold.ttf'),
    'rubik-bold': require('@/assets/fonts/Rubik-Bold.ttf'),
    'rubik-semibold': require('@/assets/fonts/Rubik-SemiBold.ttf'),
    'rubik-regular': require('@/assets/fonts/Rubik-Regular.ttf'),
    'rubik-medium': require('@/assets/fonts/Rubik-Medium.ttf'),
    'rubik-light': require('@/assets/fonts/Rubik-Light.ttf'),
    // 'roboto-extrabold': require('@/assets/fonts/Roboto-ExtraBold.ttf'),
    // 'roboto-bold': require('@/assets/fonts/Roboto-Bold.ttf'),
    // 'roboto-semibold': require('@/assets/fonts/Roboto-SemiBold.ttf'),
    // 'roboto-regular': require('@/assets/fonts/Roboto-Regular.ttf'),
    // 'roboto-medium': require('@/assets/fonts/Roboto-Medium.ttf'),
    // 'roboto-light': require('@/assets/fonts/Roboto-Light.ttf'),
    // 'poppins-extrabold': require('@/assets/fonts/Poppins-ExtraBold.ttf'),
    // 'poppins-bold': require('@/assets/fonts/Poppins-Bold.ttf'),
    // 'poppins-semibold': require('@/assets/fonts/Poppins-SemiBold.ttf'),
    // 'poppins-regular': require('@/assets/fonts/Poppins-Regular.ttf'),
    // 'poppins-medium': require('@/assets/fonts/Poppins-Medium.ttf'),
    // 'poppins-light': require('@/assets/fonts/Poppins-Light.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvivder>
      <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </AuthProvivder>
  );
}
