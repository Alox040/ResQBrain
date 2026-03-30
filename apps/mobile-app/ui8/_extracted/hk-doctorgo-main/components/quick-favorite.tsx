import clsx from 'clsx';
import { TouchableOpacity } from 'react-native';
import colors from 'tailwindcss/colors';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react-native';
import { useColorScheme } from 'nativewind';

type QuickFavoriteProps = {
  isFavorite: boolean;
  onPress: () => void;
  className?: string;
};

export default function QuickFavorite({ isFavorite, onPress, className }: QuickFavoriteProps) {
  const { colorScheme } = useColorScheme();

  return (
    <TouchableOpacity activeOpacity={0.8} className={clsx('p-2', className)} onPress={onPress}>
      {isFavorite ? (
        <IconHeartFilled
          size={24}
          fill={colorScheme === 'light' ? '#514DDF' : colors.indigo[400]}
          color="#514DDF"
        />
      ) : (
        <IconHeart
          size={24}
          color={colorScheme === 'light' ? colors.slate[800] : colors.slate[200]}
        />
      )}
    </TouchableOpacity>
  );
}
