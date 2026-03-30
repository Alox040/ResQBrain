import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { default as BaseCarousel } from 'pinar';
import { useColorScheme } from 'nativewind';
import colors from 'tailwindcss/colors';

type CarouselProps = {
  data: any;
  onPress?: (index: number) => void;
} & Partial<React.ComponentProps<typeof BaseCarousel>>;

export default function Carousel({ data, onPress, ...rest }: CarouselProps) {
  const { colorScheme } = useColorScheme();

  return (
    <BaseCarousel
      height={140}
      autoplay={true}
      autoplayInterval={2000}
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
      {data.map((carousel: any, index: number) => (
        <TouchableOpacity key={index} activeOpacity={0.8} onPress={() => onPress && onPress(index)}>
          <Image
            source={carousel.image}
            className="rounded-2xl w-full h-full border border-slate-100 dark:border-slate-800"
          />
        </TouchableOpacity>
      ))}
    </BaseCarousel>
  );
}
