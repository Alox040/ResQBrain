import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native';
import { COLORS, SPACING } from '@/theme';

export type ButtonSecondaryProps = TouchableOpacityProps & {
  label: string;
  prefixIcon?: React.ReactNode;
  postfixIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
};

export function ButtonSecondary({
  label,
  prefixIcon,
  postfixIcon,
  disabled,
  containerStyle,
  style,
  ...rest
}: ButtonSecondaryProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.base, style, containerStyle]}
      {...rest}
    >
      {prefixIcon}
      <Text style={styles.label}>{label}</Text>
      {postfixIcon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.gapSm,
    paddingVertical: 16,
    paddingHorizontal: SPACING.screenPadding,
    borderRadius: 999,
    backgroundColor: COLORS.primaryMutedBg,
  },
  label: {
    textAlign: 'center',
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 16,
  },
});
