import { Text, TouchableOpacity } from 'react-native';

type TagProps = {
  label: string;
  isSelected?: boolean;
  onPress?: () => void;
  className?: string;
};

export default function Tag({ label, isSelected, onPress, className }: TagProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`px-6 py-3 rounded-full border-2 ${
        isSelected
          ? 'border-primary bg-primary/5 dark:bg-slate-800'
          : 'border-slate-200 dark:border-slate-700'
      } ${className}`}>
      <Text
        className={`${isSelected ? 'text-primary dark:text-indigo-400' : 'text-slate-800 dark:text-white'} font-sans`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
