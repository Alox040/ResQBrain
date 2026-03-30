import { View, TouchableOpacity } from 'react-native';
import { IconStar, IconStarFilled } from '@tabler/icons-react-native';
import colors from 'tailwindcss/colors';

type RatingProps = {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showEmpty?: boolean;
  readonly?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
};

export default function Rating({
  value,
  size = 'sm',
  showEmpty = true,
  readonly = true,
  onChange,
  className = '',
}: RatingProps) {
  const maxStars = 5;
  const starSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;

  const handlePress = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating + 1);
    }
  };

  return (
    <View className={`flex-row gap-0.5 ${className}`}>
      {[...Array(maxStars)].map((_, index) => {
        const isFilled = index < value;
        if (!showEmpty && !isFilled) return null;

        return (
          <TouchableOpacity
            key={index}
            disabled={readonly}
            onPress={() => handlePress(index)}
            activeOpacity={readonly ? 1 : 0.8}>
            {isFilled ? (
              <IconStarFilled size={starSize} strokeWidth={0} fill={colors.amber[400]} />
            ) : (
              <IconStar size={starSize} color={colors.slate[300]} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
