import { ScrollView, Text, View, TouchableOpacity, Image } from 'react-native';
import { Href, useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Header from '@/components/header';
import Container from '@/components/container';
import { discoverData, services } from '@/data/common';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalComingSoon from '@/components/modal-coming-soon';
import Carousel from '@/components/carousel';
import { ServiceItem } from '@/types/common';

export default function Discover() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePress = (route: Href) => {
    if (route) {
      router.push(route);
    } else {
      setIsModalVisible(true);
    }
  };

  return (
    <Container bottom={false}>
      <ScrollView
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}>
        <Header name={t('discover')} goBack={false} textBig className="mt-4" />

        <Animated.View entering={FadeInUp.duration(200).delay(200)}>
          <Carousel
            data={discoverData}
            onPress={(index) => {
              console.log(`carousel pressed ${index}`);
            }}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(500)}
          className="flex-row flex-wrap justify-between gap-y-4">
          {services.map((service: ServiceItem, index: number) => (
            <Animated.View
              entering={FadeInUp.duration(400).delay(index * 100)}
              key={service.id}
              className="w-[48%]">
              <TouchableOpacity
                onPress={() => handlePress(service.route as Href)}
                className="justify-center items-center px-4 py-6 w-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-800 gap-4">
                <Image source={service.image} className="w-20 h-20" />

                <View className="h-[48px] justify-center">
                  <Text
                    numberOfLines={2}
                    className="text-slate-800 dark:text-slate-100 font-medium text-base text-center">
                    {t(service.name)}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>

      <ModalComingSoon isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </Container>
  );
}
