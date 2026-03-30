import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native';
import { COLORS, SPACING } from '@/theme';

export type ButtonPrimaryProps = TouchableOpacityProps & {
  label: string;
  prefixIcon?: React.ReactNode;
  postfixIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
};

export function ButtonPrimary({
  label,
  prefixIcon,
  postfixIcon,
  disabled,
  containerStyle,
  style,
  ...rest
}: ButtonPrimaryProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        disabled ? styles.disabled : null,
        style,
        containerStyle,
      ]}
      {...rest}
    >
      {prefixIcon}
      <Text style={[styles.label, disabled ? styles.labelDisabled : null]}>
        {label}
      </Text>
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
    backgroundColor: COLORS.primary,
  },
  disabled: {
    backgroundColor: '#e5e7eb',
    opacity: 0.7,
  },
  label: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  labelDisabled: {
    color: COLORS.textMuted,
  },
});
