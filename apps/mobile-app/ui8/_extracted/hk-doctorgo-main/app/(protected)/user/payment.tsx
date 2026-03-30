import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconWallet, IconCreditCard } from '@tabler/icons-react-native';
import Container from '@/components/container';
import Header from '@/components/header';
import SettingItem from '@/components/setting-item';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalComingSoon from '@/components/modal-coming-soon';

export default function Payment() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const paymentMethods = [
    {
      icon: IconWallet,
      label: t('wallet'),
      route: '/wallet',
    },
    {
      icon: IconCreditCard,
      label: t('credit_debit_card'),
      showModal: true,
      rightText: t('add_card'),
    },
  ];

  return (
    <Container>
      <Header name={t('payment_method')} />

      <View className="mt-4">
        {paymentMethods.map((item, index) => (
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
