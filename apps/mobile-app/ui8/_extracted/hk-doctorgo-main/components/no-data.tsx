import images from '@/data/images';
import { Text, Image, ImageSourcePropType } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

type NoDataProps = {
  image?: ImageSourcePropType;
  message?: string;
  when: boolean;
  action?: React.ReactNode;
};

export default function NoData({
  image = images.notFound,
  message = 'No data found',
  when,
  action,
}: NoDataProps) {
  if (!when) return null;

  return (
    <Animated.View
      className="mx-auto justify-center items-center h-[480px] gap-8"
      entering={FadeInDown}>
      <Image source={image} className="w-80 h-80" resizeMode="contain" />

      <Text className="text-center text-slate-600 dark:text-slate-400 font-sans text-xl">
        {message}
      </Text>

      {action}
    </Animated.View>
  );
}
