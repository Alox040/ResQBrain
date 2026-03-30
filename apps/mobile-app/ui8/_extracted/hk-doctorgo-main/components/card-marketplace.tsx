import { IconCircleCheckFilled, IconStar } from '@tabler/icons-react-native';
import { useColorScheme } from 'nativewind';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import colors from 'tailwindcss/colors';

type CardMarketplaceProps = {
  product: any;
  onPress?: () => void;
  className?: string;
};

export default function CardMarketplace({
  product,
  onPress,
  className = 'w-[160px]',
}: CardMarketplaceProps) {
  const { colorScheme } = useColorScheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`flex-1 justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 ${className}`}>
      {product?.inStock && (
        <View className="absolute top-2 right-2 z-10">
          <IconCircleCheckFilled
            width={24}
            height={24}
            strokeWidth={0}
            fill={colorScheme === 'light' ? colors.green[600] : colors.green[400]}
          />
        </View>
      )}

      <View className="gap-2">
        <View className="items-center">
          <Image source={product.image} className="w-32 h-32 rounded-2xl" />
        </View>

        <Text numberOfLines={2} className="text-slate-800 dark:text-slate-100 font-medium text-lg">
          {product.title}
        </Text>
      </View>

      <View className="flex-row items-center">
        <View className="flex-1 flex-row items-center gap-1">
          <IconStar size={14} strokeWidth={3} color={colors.yellow[500]} />

          <Text className="font-sans text-slate-500 dark:text-slate-400">
            {product.reviews.average} ({product.reviews.total})
          </Text>
        </View>

        <Text className="text-primary dark:text-indigo-400 font-medium">{product.price}</Text>
      </View>
    </TouchableOpacity>
  );
}
