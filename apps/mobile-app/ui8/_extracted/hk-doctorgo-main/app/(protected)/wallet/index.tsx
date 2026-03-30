import ButtonPrimary from '@/components/button-primary';
import Container from '@/components/container';
import Header from '@/components/header';
import ModalComingSoon from '@/components/modal-coming-soon';
import images from '@/data/images';
import { IconPlus } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import colors from 'tailwindcss/colors';

export default function Wallet() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { colorScheme } = useColorScheme();

  return (
    <Container className="justify-between">
      <View>
        <Header name={t('wallet')} />

        <View className="items-center mt-5 p-6 gap-2 border bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 rounded-2xl">
          <Text className="font-semibold text-lg text-slate-800 dark:text-slate-100 text-center">
            {t('wallet_balance')}
          </Text>

          <Text className="font-semibold text-2xl text-slate-800 dark:text-slate-100 text-center">
            $0
          </Text>

          <TouchableOpacity className="items-center" onPress={() => setIsModalVisible(true)}>
            <View className="p-3 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
              <IconPlus
                color={colorScheme === 'light' ? '#514DDF' : colors.indigo[400]}
                size={28}
              />
            </View>

            <Text className="mt-2 font-sans text-center text-slate-800 dark:text-slate-100 leading-tight">
              {t('top_up')}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="justify-center items-center gap-2 mt-8">
          <Image source={images.transaction} className="w-[280px] h-[280px]" />

          <Text className="font-semibold text-xl text-slate-800 dark:text-slate-100">
            {t('no_transactions_available')}
          </Text>

          <Text className="font-base text-slate-600 dark:text-slate-400">
            {t('ready_to_explore_doctor_go')}
          </Text>

          <Text className="font-base text-slate-600 dark:text-slate-400">
            {t('explore_our_products_details')}
          </Text>
        </View>
      </View>

      <ButtonPrimary
        text={t('discover')}
        className="android:mb-2"
        onPress={() => router.push('/(protected)/(tabs)/discover')}
      />

      <ModalComingSoon isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </Container>
  );
}
