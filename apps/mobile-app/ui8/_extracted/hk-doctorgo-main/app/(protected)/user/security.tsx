import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconDeviceMobile, IconLock } from '@tabler/icons-react-native';
import Header from '@/components/header';
import Container from '@/components/container';
import SettingItem from '@/components/setting-item';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalComingSoon from '@/components/modal-coming-soon';

export default function Security() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const securityItems = [
    {
      icon: IconLock,
      label: t('change_password'),
      route: '/auth/forgot-password',
    },
    {
      icon: IconDeviceMobile,
      label: t('two_step_verification'),
      route: '/auth/2-steps-verification',
      showModal: true,
    },
  ];

  return (
    <Container>
      <Header name={t('login_and_security')} />

      <View className="pt-6 py-4">
        {securityItems.map((item, index) => (
          <SettingItem
            key={index}
            item={{
              ...item,
              onPress: () => {
                if (item.showModal) {
                  setIsModalVisible(true);
                } else {
                  router.push(item.route);
                }
              },
            }}
          />
        ))}
      </View>

      <ModalComingSoon isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </Container>
  );
}
