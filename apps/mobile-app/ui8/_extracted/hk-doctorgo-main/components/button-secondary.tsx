import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ButtonSecondaryProps = TouchableOpacityProps & {
  prefixIcon?: React.ReactNode;
  postfixIcon?: React.ReactNode;
  text: string | undefined;
  disabled?: boolean;
};

export default function ButtonSecondary({
  prefixIcon,
  postfixIcon,
  text,
  className,
  disabled,
  ...rest
}: ButtonSecondaryProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.8}
      className={`flex-row justify-center items-center p-4 bg-indigo-100 dark:bg-slate-800 rounded-full gap-2 ${className}`}
      {...rest}>
      {prefixIcon}
      <Text className="text-center text-primary dark:text-white font-bold">{text}</Text>
      {postfixIcon}
    </TouchableOpacity>
  );
}
