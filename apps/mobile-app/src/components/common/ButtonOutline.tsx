import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native';
import { COLORS, SPACING } from '@/theme';

export type ButtonOutlineVariant = 'default' | 'danger';

export type ButtonOutlineProps = Omit<TouchableOpacityProps, 'onPress'> & {
  onPress: () => void;
  label?: string;
  prefixIcon?: React.ReactNode;
  postfixIcon?: React.ReactNode;
  square?: boolean;
  variant?: ButtonOutlineVariant;
  containerStyle?: ViewStyle;
};

export function ButtonOutline({
  label,
  onPress,
  prefixIcon,
  postfixIcon,
  square = false,
  variant = 'default',
  containerStyle,
  style,
  ...rest
}: ButtonOutlineProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.base,
        square ? styles.paddingSquare : styles.paddingDefault,
        variant === 'danger' ? styles.borderDanger : styles.borderDefault,
        style,
        containerStyle,
      ]}
      {...rest}
    >
      {prefixIcon}
      {label ? (
        <Text
          style={[
            styles.label,
            variant === 'danger' ? styles.labelDanger : null,
          ]}
        >
          {label}
        </Text>
      ) : null}
      {postfixIcon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  paddingDefault: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  paddingSquare: {
    padding: 6,
  },
  borderDefault: {
    borderColor: COLORS.text,
  },
  borderDanger: {
    borderColor: '#ef4444',
  },
  label: {
    fontWeight: '700',
    fontSize: 15,
    color: COLORS.text,
  },
  labelDanger: {
    color: '#b91c1c',
  },
});
