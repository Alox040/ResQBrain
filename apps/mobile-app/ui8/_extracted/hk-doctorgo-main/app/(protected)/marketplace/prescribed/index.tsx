import { View, Text, ScrollView } from 'react-native';
import Header from '@/components/header';
import { useRouter } from 'expo-router';
import SettingItem from '@/components/setting-item';
import { useTranslation } from 'react-i18next';
import { conditions } from '@/data/common';
import Container from '@/components/container';

export default function Prescribed() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Container>
      <Header name={t('buy_medication')} />

      <View className="my-6 gap-2">
        <Text className="text-xl font-semibold text-slate-800 dark:text-white">
          {t('prescribed_meditations')}
        </Text>

        <Text className="text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
          {t('select_condition')}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {conditions.map((condition: string) => (
          <SettingItem
            key={condition}
            item={{
              label: condition,
              onPress: () => router.push(`/marketplace/prescribed/${condition.toLowerCase()}`),
            }}
          />
        ))}
      </ScrollView>
    </Container>
  );
}
