import { ScrollView } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { IconCircleXFilled } from '@tabler/icons-react-native';
import Header from '@/components/header';
import Container from '@/components/container';
import Modal from '@/components/modal';
import { useState } from 'react';
import colors from 'tailwindcss/colors';
import SettingItem from '@/components/setting-item';
import { useTranslation } from 'react-i18next';
import { profileSettings } from '@/data/common';
import { ProfileSettingItem } from '@/types/common';

export default function Profile() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  return (
    <Container>
      <Header name={t('profile_settings')} />

      <ScrollView className="flex-1 mt-4" showsVerticalScrollIndicator={false}>
        {profileSettings.map((item: ProfileSettingItem, index: number) => (
          <SettingItem
            key={index}
            item={{
              ...item,
              onPress: () => {
                if (item.label === 'delete_account') {
                  setDeleteModalVisible(true);
                } else if (item.route) {
                  router.push(item.route as Href);
                }
              },
            }}
          />
        ))}
      </ScrollView>

      <Modal
        isVisible={isDeleteModalVisible}
        title={t('confirm_delete_account')}
        primaryButtonText={t('delete')}
        icon={
          <IconCircleXFilled
            strokeWidth={0}
            size={64}
            stroke={colors.red[500]}
            fill={colors.red[500]}
          />
        }
        onClose={() => setDeleteModalVisible(false)}
        onPrimaryButtonPress={() => setDeleteModalVisible(false)}
      />
    </Container>
  );
}
