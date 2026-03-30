import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import {
  IconCircleKeyFilled,
  IconVip,
  IconReportMedical,
  IconClearAll,
} from '@tabler/icons-react-native';
import { useContext, useState } from 'react';
import Header from '@/components/header';
import SettingItem from '@/components/setting-item';
import Container from '@/components/container';
import Modal from '@/components/modal';
import Avatar from '@/components/avatar';
import { APP_VERSION, settingsData } from '@/data/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAppointmentStore from '@/store/appointment';
import useCartStore from '@/store/cart';
import useProductStore from '@/store/product';
import { SettingsLink } from '@/types/common';
import { Href } from 'expo-router/build/typed-routes/types';
import { useUserStore } from '@/store/user';
import { AuthContext } from '@/utils/auth-context';
import { useColorScheme } from 'nativewind';
import colors from 'tailwindcss/colors';
import { useSettingsStore } from '@/store/settings';

export default function More() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLogoutModalVisible, setLogoutModalVisible] = useState<boolean>(false);
  const [isClearCacheModalVisible, setClearCacheModalVisible] = useState<boolean>(false);
  const appointmentStore = useAppointmentStore();
  const cartStore = useCartStore();
  const productStore = useProductStore();
  const userStore = useUserStore();
  const authContext = useContext(AuthContext);
  const { colorScheme } = useColorScheme();
  const { theme, setTheme } = useSettingsStore();

  const clearCache = async () => {
    console.log('Clearing cache...');

    /** clear all data from async storage */
    await AsyncStorage.clear();
    await AsyncStorage.getAllKeys().then((keys) =>
      keys.forEach((key) => AsyncStorage.removeItem(key)),
    );

    /** clear all data from store */
    appointmentStore.clearAppointments();
    cartStore.clearCart();
    productStore.clearFavorites();
    userStore.resetUserInfo();

    setClearCacheModalVisible(false);
  };

  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Container bottom={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header name={t('profile_settings')} goBack={false} textBig className="my-4" />

        <View className="flex-row items-center gap-4 mb-8 flex-1">
          <View className="flex-row items-center gap-4">
            <Avatar
              imageUrl="https://mighty.tools/mockmind-api/content/human/80.jpg"
              size="md"
              color="primary"
            />

            <View className="flex-1">
              <Text className="text-lg font-medium text-slate-800 dark:text-slate-100">
                {userStore.fullName()}
              </Text>

              <TouchableOpacity onPress={() => router.push('/user/profile')}>
                <Text className="text-primary dark:text-indigo-400 font-sans">
                  {t('view_profile')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="mb-8">
          <Header name={t('my_membership_and_health_plan')} goBack={false} className="mb-4" />

          <SettingItem
            item={{
              icon: IconVip,
              label: 'membership',
              rightText: t('add'),
              onPress: () => router.push('/membership/overview'),
            }}
          />
        </View>

        <View className="mb-8">
          <Header name={t('my_health_data')} goBack={false} className="mb-4" />

          <TouchableOpacity
            className="flex-row items-center p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl"
            onPress={() => router.push('/user/health-records')}>
            <IconReportMedical
              size={32}
              color={colorScheme === 'light' ? '#514DDF' : colors.indigo[400]}
            />

            <View className="ml-3 gap-1">
              <Text className="text-base font-medium text-slate-800 dark:text-slate-100">
                {t('health_records')}
              </Text>

              <Text className="text-slate-500 dark:text-slate-300 font-sans">
                {t('lab_results_and_more')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="pb-4">
          <Header name={t('settings')} goBack={false} className="mb-4" />

          {settingsData.map((item: SettingsLink, index: number) => (
            <SettingItem
              key={index}
              item={{
                ...item,
                onPress: () => {
                  switch (item.label) {
                    case 'clear_cache':
                      setClearCacheModalVisible(true);
                      break;
                    case 'log_out':
                      setLogoutModalVisible(true);
                      break;
                    case 'toggle_theme':
                      handleToggleTheme();
                      break;
                    default:
                      router.push(item.route as Href);
                  }
                },
              }}
            />
          ))}

          <Text className="text-sm text-slate-400 dark:text-slate-100 font-sans mt-4">
            {`${t('version')} ${APP_VERSION} (${t('stable')})`}
          </Text>
        </View>
      </ScrollView>

      <Modal
        isVisible={isLogoutModalVisible}
        title={t('confirm_logout')}
        primaryButtonText={t('log_out')}
        icon={<IconCircleKeyFilled strokeWidth={0} size={64} stroke="#514DDF" fill="#514DDF" />}
        onClose={() => setLogoutModalVisible(false)}
        onPrimaryButtonPress={() => {
          setLogoutModalVisible(false);

          authContext.logOut();
        }}
      />

      <Modal
        isVisible={isClearCacheModalVisible}
        title={t('confirm_clear_cache')}
        primaryButtonText={t('clear')}
        icon={<IconClearAll strokeWidth={2} size={64} stroke="#514DDF" fill="#fff" />}
        onClose={() => setClearCacheModalVisible(false)}
        onPrimaryButtonPress={clearCache}
      />
    </Container>
  );
}
