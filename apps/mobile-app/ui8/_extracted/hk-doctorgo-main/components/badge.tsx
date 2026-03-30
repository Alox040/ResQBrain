import { Text, TouchableOpacity } from 'react-native';

type BadgeProps = {
  text: string;
  variant?: 'primary' | 'sky';
  onPress?: () => void;
};

export default function Badge({ text, variant = 'primary', onPress }: BadgeProps) {
  const availableColors = {
    primary: {
      bg: 'bg-primary/10 dark:bg-primary/90',
      text: 'text-primary dark:text-white',
    },
    sky: {
      bg: 'bg-sky-50 dark:bg-sky-900',
      text: 'text-sky-700 dark:text-white',
    },
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`${availableColors[variant].bg} self-start px-3 py-1 rounded-full mb-1`}>
      <Text className={`${availableColors[variant].text} text-sm`}>{text}</Text>
    </TouchableOpacity>
  );
}
