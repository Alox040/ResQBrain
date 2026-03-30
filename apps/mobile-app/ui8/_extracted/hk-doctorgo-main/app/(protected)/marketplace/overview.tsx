import Container from '@/components/container';
import Header from '@/components/header';
import MarketplaceBestsellers from '@/components/marketplace-bestsellers';
import images from '@/data/images';
import { IconArrowRight, IconMedicalCross } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import colors from 'tailwindcss/colors';

export default function Marketplace() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  return (
    <Container>
      <Header name={t('home')} className="pb-4" />

      <ScrollView contentContainerStyle={{ gap: 24 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-3">
          <View className="flex-1 gap-3">
            <Text className="font-bold text-2xl text-slate-800 dark:text-white">
              {t('shop_wellbeing_essentials')}
            </Text>

            <Text className="text-slate-600 dark:text-slate-400 font-medium text-base">
              {t('medication_supplements_description')}
            </Text>
          </View>

          <Image source={images.market} className="w-24 h-24" resizeMode="contain" />
        </View>

        <View className="gap-4">
          <Header name={t('order_medication')} goBack={false} />

          <View className="gap-2">
            <TouchableOpacity
              className="flex-row gap-4 p-4 rounded-2xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800"
              onPress={() => router.push('/marketplace/prescribed')}>
              <IconMedicalCross
                color={colorScheme === 'light' ? '#514DDF' : colors.indigo[400]}
                size={32}
              />

              <View className="flex-1 gap-1">
                <Text className="text-slate-800 dark:text-white font-semibold text-lg">
                  {t('prescribed_medication')}
                </Text>

                <Text className="text-slate-600 dark:text-slate-400 font-sans text-base">
                  {t('prescribed_medication_description')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/marketplace',
                  params: { type: 'otc' },
                })
              }
              className="flex-row gap-4 p-4 rounded-2xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800">
              <IconMedicalCross color={'#2AEEC8'} size={32} />

              <View className="flex-1 gap-1">
                <Text className="text-slate-800 dark:text-white font-semibold text-lg">
                  {t('otc_medication')}
                </Text>

                <Text className="text-slate-600 dark:text-slate-400 font-sans text-base">
                  {t('otc_delivery_description')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="gap-4">
          <Header name={t('discover_marketplace')} goBack={false} />

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/marketplace',
                params: { type: 'health-wellness' },
              })
            }
            className="flex-row items-center border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-primary/10 dark:bg-primary/15">
            <View className="flex-1 gap-2">
              <Text className="text-primary dark:text-indigo-400 font-medium text-lg">
                {t('shop_health_wellness')}
              </Text>

              <Text className="text-slate-800 dark:text-white font-sans text-base">
                {t('free_delivery_description')}
              </Text>
            </View>

            <Image source={images.shopping} className="w-24 h-24" resizeMode="contain" />
          </TouchableOpacity>
        </View>

        <View className="gap-4">
          <Header
            name={t('marketplace_bestsellers')}
            goBack={false}
            onPress={() => router.push('/marketplace')}
            postfixIcon={<IconArrowRight color={'#514DDF'} />}
            className="justify-between"
          />

          <MarketplaceBestsellers navigationReplace={false} />
        </View>
      </ScrollView>
    </Container>
  );
}
