import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import Container from '@/components/container';
import Header from '@/components/header';
import images from '@/data/images';
import Badge from '@/components/badge';
import { useState } from 'react';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import ModalComingSoon from '@/components/modal-coming-soon';

export default function Help() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { t } = useTranslation();

  const handlePress = () => {
    setIsModalVisible(true);
  };

  return (
    <Container className="gap-4">
      <Header name={t('help_and_faqs')} />

      <ScrollView contentContainerClassName="gap-4">
        <TouchableOpacity
          className="flex-row items-start bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 gap-4"
          onPress={handlePress}>
          <Image source={images.robot} className="w-16 h-16" />

          <View className="flex-1 gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-semibold text-slate-800 dark:text-white">
                {t('dg_assistant')}
              </Text>

              <Badge text={t('upcoming')} variant="sky" />
            </View>

            <Text className="text-slate-600 dark:text-slate-400 text-base font-sans">
              {t('dg_assistant_description')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 gap-4"
          onPress={() => router.push('/user/faq')}>
          <Image source={images.contact} className="w-16 h-16" />

          <View className="flex-1 gap-2">
            <Text className="text-lg font-semibold text-slate-800 dark:text-white">
              {t('faqs_and_contact_us')}
            </Text>

            <Text className="text-slate-600 dark:text-slate-400 text-base font-sans">
              {t('faqs_description')}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <ModalComingSoon isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </Container>
  );
}
