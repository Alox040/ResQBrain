import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type CardDoctorProps = {
  title: string;
  desc: string;
  image: any;
  price: string;
};

export default function CardDoctor({ title, desc, image, price }: CardDoctorProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push(`/book/${encodeURIComponent(title.toLowerCase())}`)}
      className="flex-row gap-4 p-4 rounded-2xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800">
      <Image source={image} className="w-16 h-16" />

      <View className="gap-2 flex-1">
        <Text className="text-slate-800 dark:text-white font-medium text-lg">{t(title)}</Text>

        <Text className="text-slate-800 dark:text-white text-sm font-sans">{t(desc)}</Text>

        <Text className="text-primary dark:text-indigo-400 font-medium text-base">
          {t('from')} {price}/ {t('consultation')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
