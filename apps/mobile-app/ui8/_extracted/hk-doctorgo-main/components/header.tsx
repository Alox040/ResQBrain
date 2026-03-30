import clsx from 'clsx';
import React from 'react';
import { IconArrowLeft } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import colors from 'tailwindcss/colors';
import { useColorScheme } from 'nativewind';

type HeaderProps = {
  goBack?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  name?: string;
  postfixIcon?: React.ReactNode | boolean;
  className?: string;
  textBig?: boolean;
};

export default function Header({
  goBack = true,
  onPress,
  icon,
  name,
  postfixIcon,
  className,
  textBig,
}: HeaderProps) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  return (
    <View className={clsx('flex-row items-center gap-4', className)}>
      <View className="flex-row items-center gap-4">
        {goBack && router.canGoBack() && (
          <TouchableOpacity activeOpacity={0.8} onPress={router.back}>
            {icon || (
              <IconArrowLeft
                stroke={colorScheme === 'light' ? colors.slate[800] : colors.slate[100]}
              />
            )}
          </TouchableOpacity>
        )}

        {name && (
          <Text
            className={clsx(
              'text-slate-800 dark:text-slate-100',
              textBig ? 'font-semibold text-2xl' : 'font-medium text-xl',
            )}>
            {name}
          </Text>
        )}
      </View>

      {postfixIcon && (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
          {postfixIcon}
        </TouchableOpacity>
      )}
    </View>
  );
}
