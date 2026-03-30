import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity } from 'react-native';

type CardConsulantProps = {
  title: string;
  price: string;
  image: any;
};

export default function CardConsulant({ title, price, image }: CardConsulantProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="justify-center items-center gap-2 p-4 w-[160px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800"
      onPress={() => {
        if (title === 'specialist') {
          router.push(`/book/specialists`);
        } else {
          router.push(`/book/${encodeURIComponent(title.toLowerCase())}`);
        }
      }}>
      <Image source={image} className="w-20 h-20" />

      <Text className="text-slate-800 dark:text-slate-100 font-medium text-lg text-center">
        {t(title)}
      </Text>

      <Text className="text-primar dark:text-indigo-400 font-medium text-base">{price}</Text>
    </TouchableOpacity>
  );
}
