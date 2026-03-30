import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

type CardAppointmentProps = {
  index: number;
  image: any;
  title: string;
  price: string;
};

export default function CardAppointment({ index, image, title, price }: CardAppointmentProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Animated.View entering={FadeInUp.duration(200).delay(index * 100)}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push(`/book/${encodeURIComponent(title.toLowerCase())}`)}
        className="flex-row gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800">
        <Image source={image} className="w-16 h-16" />

        <View className="gap-2">
          <Text className="text-slate-800 dark:text-slate-100 font-medium text-lg">{title}</Text>

          <Text className="text-primary dark:text-indigo-400 text-sm font-medium">
            {price} /{t('consultation')}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
