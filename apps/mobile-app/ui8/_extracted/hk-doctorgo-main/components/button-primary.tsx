import { Text } from 'react-native';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ButtonPrimaryProps = TouchableOpacityProps & {
  prefixIcon?: JSX.Element;
  postfixIcon?: JSX.Element;
  text: string;
  className?: string;
  disabled?: boolean;
};

export default function ButtonPrimary({
  prefixIcon,
  postfixIcon,
  text,
  className,
  disabled,
  ...rest
}: ButtonPrimaryProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.8}
      className={`flex-row justify-center items-center p-4 bg-primary dark:bg-indigo-700 rounded-full gap-2 ${className} disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:opacity-50`}
      {...rest}>
      {prefixIcon}

      <Text
        disabled={disabled}
        className="text-center text-white font-bold disabled:text-slate-800 dark:disabled:text-slate-200">
        {text}
      </Text>

      {postfixIcon}
    </TouchableOpacity>
  );
}
