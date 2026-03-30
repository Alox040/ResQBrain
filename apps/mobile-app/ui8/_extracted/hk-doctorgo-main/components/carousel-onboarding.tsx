import React from 'react';
import { Image, View, Text, useWindowDimensions } from 'react-native';
import Carousel from 'pinar';
import { onboardingData } from '@/data/common';
import { useTranslation } from 'react-i18next';
import { OnboardingItem } from '@/types/common';
import { useColorScheme } from 'nativewind';
import colors from 'tailwindcss/colors';

type CarouselOnboardingProps = {
  onboardingData?: typeof onboardingData;
} & Partial<React.ComponentProps<typeof Carousel>>;

export default function CarouselOnboarding({
  onboardingData: customData,
  ...rest
}: CarouselOnboardingProps) {
  const { width, height } = useWindowDimensions();
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  const data = customData || onboardingData;

  return (
    <Carousel
      width={width - 48}
      height={height - 260}
      autoplay={true}
      autoplayInterval={3000}
      loop={true}
      showsControls={false}
      dotsContainerStyle={{
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 8,
        left: 0,
        right: 0,
      }}
      dotStyle={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colorScheme === 'light' ? colors.slate[300] : colors.slate[800],
        marginHorizontal: 4,
        marginVertical: 4,
      }}
      activeDotStyle={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colorScheme === 'light' ? colors.indigo[500] : colors.indigo[700],
        marginHorizontal: 4,
        marginVertical: 4,
      }}
      {...rest}>
      {data.map((carousel: OnboardingItem, index: number) => (
        <View className="flex-1 justify-center items-center px-6" key={index}>
          <View className="items-center">
            <Image source={carousel.image} style={{ width: 280, height: 280 }} />

            <Text className="mt-8 font-semibold text-2xl text-center text-slate-800 dark:text-slate-100">
              {t(carousel.title)}
            </Text>

            <Text className="mt-4 text-base font-sans text-center text-slate-600 dark:text-slate-300 leading-relaxed">
              {t(carousel.description)}
            </Text>
          </View>
        </View>
      ))}
    </Carousel>
  );
}
