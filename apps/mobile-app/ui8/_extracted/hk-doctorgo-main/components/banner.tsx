import { View, Text } from 'react-native';
import { IconInfoCircle } from '@tabler/icons-react-native';
import type { Icon as TablerIcon } from '@tabler/icons-react-native';
import { useColorScheme } from 'nativewind';
import colors from 'tailwindcss/colors';

type BannerProps = {
  title: string;
  description: string;
  icon?: TablerIcon;
  variant?: 'primary' | 'sky';
  className?: string;
};

export default function Banner({
  title,
  description,
  icon: Icon = IconInfoCircle,
  variant = 'primary',
  className,
}: BannerProps) {
  const { colorScheme } = useColorScheme();
  const availableColors = {
    primary: {
      bg: 'bg-primary/10 dark:bg-primary/15',
      icon: colorScheme === 'light' ? '#514DDF' : colors.white,
      title: 'text-primary dark:text-white',
      description: 'text-primary/80 dark:text-indigo-400',
    },
    sky: {
      bg: 'bg-sky-50',
      icon: colorScheme === 'light' ? '#0284C7' : colors.white,
      title: 'text-sky-700',
      description: 'text-sky-600',
    },
  };

  return (
    <View
      className={`${availableColors[variant].bg} rounded-2xl p-4 flex-row items-start ${className}`}>
      <Icon size={20} color={availableColors[variant].icon} />

      <View className="flex-1 ml-2 gap-1">
        <Text className={`${availableColors[variant].title} font-medium mb-1`}>{title}</Text>

        <Text className={availableColors[variant].description}>{description}</Text>
      </View>
    </View>
  );
}
