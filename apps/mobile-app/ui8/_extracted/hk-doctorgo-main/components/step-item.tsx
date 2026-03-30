import clsx from 'clsx';
import { Text, TouchableOpacity, View } from 'react-native';

type StepItemProps = {
  step: number;
  title: string;
  isActive: boolean;
  onPress: () => void;
};

export default function StepItem({ step, title, isActive, onPress }: StepItemProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} className="items-center" onPress={onPress}>
      <View
        className={clsx([
          `w-8 h-8 rounded-full items-center justify-center`,
          isActive ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800',
        ])}>
        <Text
          className={`font-bold ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-200'}`}>
          {step}
        </Text>
      </View>

      <Text
        className={`font-medium mt-1 ${isActive ? 'text-primary dark:text-indigo-400' : 'text-slate-500 dark:text-slate-200'}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
