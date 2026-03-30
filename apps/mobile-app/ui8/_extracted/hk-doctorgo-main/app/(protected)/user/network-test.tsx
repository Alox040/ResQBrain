import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/header';
import ButtonSecondary from '@/components/button-secondary';
import Container from '@/components/container';
import images from '@/data/images';
import Animated, {
  withRepeat,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';

export default function NetworkTest() {
  const router = useRouter();
  const { t } = useTranslation();
  const opacity = useSharedValue(0.5);
  const [networkStats, setNetworkStats] = useState({
    type: '',
    downloadSpeed: 0,
    uploadSpeed: 0,
    isConnected: false,
  });

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);

    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkStats((prev) => ({
        ...prev,
        type: state.type,
        isConnected: state.isConnected || false,
      }));
    });

    const testDownloadSpeed = async () => {
      const startTime = Date.now();
      try {
        const response = await fetch('https://www.google.com');
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        const speed = (response.headers.get('content-length') || 1000) / duration / 1024;
        setNetworkStats((prev) => ({ ...prev, downloadSpeed: Math.round(speed) }));
      } catch (error) {
        console.log('Download speed test failed:', error);
      }
    };

    const testUploadSpeed = async () => {
      const startTime = Date.now();
      try {
        const data = new Array(1024).join('x');
        await fetch('https://httpbin.org/post', {
          method: 'POST',
          body: data,
        });
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        const speed = data.length / duration / 1024;
        setNetworkStats((prev) => ({ ...prev, uploadSpeed: Math.round(speed) }));
      } catch (error) {
        console.log('Upload speed test failed:', error);
      }
    };

    testDownloadSpeed();
    testUploadSpeed();

    return () => {
      unsubscribe();
    };
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Container>
      <Header name={t('network_test')} />

      <View className="flex-1 items-center justify-center gap-6">
        <Animated.Image
          source={images.network}
          className="w-[280px] h-[380px]"
          resizeMode="contain"
          style={animatedStyle}
        />

        <View className="items-center gap-2">
          <Text className="text-lg font-sans text-center text-slate-800 dark:text-white">
            {networkStats.isConnected ? t('connected') : t('not_connected')}
          </Text>
          <Text className="text-sm font-sans text-center text-slate-600 dark:text-slate-400">
            {t('network_type', { type: networkStats.type })}
          </Text>
          <Text className="text-sm font-sans text-center text-slate-600 dark:text-slate-400">
            {t('download_speed', { speed: networkStats.downloadSpeed })}
          </Text>
          <Text className="text-sm font-sans text-center text-slate-600 dark:text-slate-400">
            {t('upload_speed', { speed: networkStats.uploadSpeed })}
          </Text>
        </View>
      </View>

      <ButtonSecondary
        text={t('cancel_network_test')}
        className="mb-6"
        onPress={() => router.push('/(protected)/(tabs)/more')}
      />
    </Container>
  );
}
