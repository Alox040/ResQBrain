import { Pressable, Text } from 'react-native';

type TabItemProps = {
  label: string;
  isActive: boolean;
  onPress: () => void;
};

export default function TabItem({ label, isActive, onPress }: TabItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`py-4 flex-1 ${isActive ? 'border-b-2 border-primary dark:border-white' : 'border-b-2 border-transparent'}`}>
      <Text
        className={`text-center ${isActive ? 'text-primary dark:text-white font-medium' : 'text-slate-600 dark:text-slate-300'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
