import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native';
import { SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';
import { Label } from './Label';

export type InputTextProps = TextInputProps & {
  label?: string;
  helpText?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  postfixIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
};

export function InputText({
  label,
  helpText,
  error,
  prefixIcon,
  postfixIcon,
  containerStyle,
  style,
  placeholderTextColor: placeholderTextColorProp,
  ...rest
}: InputTextProps) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const hasError = Boolean(error);
  const placeholderTextColor = placeholderTextColorProp ?? colors.textMuted;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Label text={label} /> : null}

      <View style={styles.fieldRow}>
        {prefixIcon ? (
          <View style={styles.prefix}>{prefixIcon}</View>
        ) : null}
        <TextInput
          placeholderTextColor={placeholderTextColor}
          selectionColor={colors.primary}
          autoCapitalize="none"
          autoCorrect={false}
          style={[
            styles.input,
            prefixIcon ? styles.inputWithPrefix : null,
            hasError ? styles.inputError : null,
            style,
          ]}
          {...rest}
        />
        {postfixIcon ? <View style={styles.postfix}>{postfixIcon}</View> : null}
      </View>

      {helpText && !hasError ? (
        <Text style={styles.help}>{helpText}</Text>
      ) : null}
      {hasError ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function createStyles(colors: AppPalette, isDark: boolean) {
  return StyleSheet.create({
    wrapper: {
      gap: SPACING.gapSm,
    },
    fieldRow: {
      position: 'relative',
    },
    prefix: {
      position: 'absolute',
      left: 14,
      top: 0,
      bottom: 0,
      zIndex: 1,
      justifyContent: 'center',
    },
    postfix: {
      position: 'absolute',
      right: 12,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 999,
      paddingHorizontal: SPACING.screenPadding,
      paddingVertical: 12,
      ...TYPOGRAPHY.body,
      color: colors.text,
      minHeight: 56,
    },
    inputWithPrefix: {
      paddingLeft: 44,
    },
    inputError: {
      borderColor: '#f87171',
      backgroundColor: isDark ? '#450a0a' : '#fef2f2',
    },
    help: {
      ...TYPOGRAPHY.bodyMuted,
      color: colors.textMuted,
    },
    errorText: {
      fontSize: 14,
      color: '#f87171',
      fontWeight: '600',
    },
  });
}
