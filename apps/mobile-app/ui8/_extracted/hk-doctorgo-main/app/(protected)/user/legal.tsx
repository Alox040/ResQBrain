import { View } from 'react-native';
import { IconFileText } from '@tabler/icons-react-native';
import Container from '@/components/container';
import Header from '@/components/header';
import SettingItem from '@/components/setting-item';
import * as WebBrowser from 'expo-web-browser';
import { PRIVACY_POLICY, TERMS_AND_CONDITIONS, TERMS_OF_SERVICE } from '@/data/common';
import { useTranslation } from 'react-i18next';

export default function Legal() {
  const { t } = useTranslation();

  const legalItems = [
    {
      icon: IconFileText,
      label: t('terms_and_conditions'),
      route: TERMS_AND_CONDITIONS,
    },
    {
      icon: IconFileText,
      label: t('privacy_policy'),
      route: PRIVACY_POLICY,
    },
    {
      icon: IconFileText,
      label: t('doctor_go_terms_of_use'),
      route: TERMS_OF_SERVICE,
    },
  ];

  return (
    <Container>
      <Header name={t('legal')} />

      <View className="pt-4 py-4">
        {legalItems.map((item, index) => (
          <SettingItem
            key={index}
            item={{
              ...item,
              onPress: () => WebBrowser.openBrowserAsync(item.route),
            }}
          />
        ))}
      </View>
    </Container>
  );
}
