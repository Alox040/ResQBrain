import { Text } from 'react-native';

type LabelProps = {
  text: string;
};

export default function Label({ text }: LabelProps) {
  return <Text className="font-semibold text-slate-800 dark:text-slate-300">{text}</Text>;
}
