import { clsx } from 'clsx';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ButtonOutlineProps = TouchableOpacityProps & {
  text?: string;
  onPress: () => void;
  prefixIcon?: JSX.Element;
  postfixIcon?: JSX.Element;
  className?: string;
  square?: boolean;
  variant?: string;
};

export default function ButtonOutline({
  text,
  onPress,
  prefixIcon,
  postfixIcon,
  className,
  square = false,
  variant = 'default',
  ...rest
}: ButtonOutlineProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={clsx(
        'flex-row items-center justify-center border rounded-full gap-1',
        square ? 'p-1.5' : 'px-3 py-1.5',
        variant === 'danger' ? 'border-red-500' : 'border-slate-800 dark:border-slate-700',
        className,
      )}
      onPress={onPress}
      {...rest}>
      {prefixIcon}

      {text && <Text className="font-bold text-slate-800 dark:text-slate-100">{text}</Text>}

      {postfixIcon}
    </TouchableOpacity>
  );
}
