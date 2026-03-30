import { View, Text, Image, ImageSourcePropType } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import ButtonSecondary from '@/components/button-secondary';

type CardMembershipProps = {
  title: string;
  description: string;
  image: ImageSourcePropType;
  buttonText?: string;
  delay?: number;
  onPress?: () => void;
};

export default function CardMembership({
  title,
  description,
  image,
  buttonText,
  delay = 0,
  onPress,
}: CardMembershipProps) {
  return (
    <Animated.View
      entering={FadeInUp.duration(400).delay(delay)}
      className="gap-4 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
      <View className="flex-row items-center">
        <View className="flex-1 gap-3">
          <Text className="text-xl font-semibold text-primary dark:text-indigo-400">{title}</Text>

          <Text className="mt-2 text-base font-sans text-slate-800 dark:text-white">
            {description}
          </Text>
        </View>

        <Image source={image} className="w-32 h-32" />
      </View>

      {!!onPress && <ButtonSecondary text={buttonText} onPress={onPress} />}
    </Animated.View>
  );
}
