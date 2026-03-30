import clsx from 'clsx';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import colors from 'tailwindcss/colors';
import React from 'react';
import { useColorScheme } from 'nativewind';
import Label from './label';

type InputTextProps = {
  label?: string;
  placeholder: string;
  helpText?: string;
  className?: string;
  prefixIcon?: React.ReactNode;
  postfixIcon?: React.ReactNode;
  error?: string;
} & TextInputProps;

export default function InputText({
  label,
  placeholder,
  helpText,
  className,
  prefixIcon,
  postfixIcon,
  error,
  ...rest
}: InputTextProps) {
  const { colorScheme } = useColorScheme();

  return (
    <View className="gap-3 relative">
      {label && <Label text={label} />}

      {!!prefixIcon && (
        <View className="justify-center absolute inset-y-0 left-4 z-10">{prefixIcon}</View>
      )}

      <View className="relative justify-center">
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.slate[300]}
          selectionColor="#514DDF"
          cursorColor={colorScheme === 'light' ? '#514DDF' : colors.white}
          autoCapitalize="none"
          autoCorrect={false}
          className={clsx(
            `bg-white text-slate-800 dark:text-white dark:bg-slate-900 border rounded-full px-4 py-3 focus:bg-primary/5 dark:focus:bg-primary/10 font-sans`,
            !!error
              ? 'border-red-400  dark:bg-red-400/5 dark:border-red-800 focus:bg-red-400/5'
              : 'border-slate-200 dark:border-slate-800',
            className,
            !!prefixIcon && 'pl-12',
          )}
          {...rest}
        />

        {postfixIcon && postfixIcon}
      </View>

      {helpText && <Text className="text-sm text-slate-500">{helpText}</Text>}

      {error && <Text className="text-sm text-red-500 dark:text-red-500/80">{error}</Text>}
    </View>
  );
}
