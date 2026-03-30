import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native';
import { COLORS, SPACING } from '@/theme';
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
  placeholderTextColor = COLORS.textMuted,
  ...rest
}: InputTextProps) {
  const hasError = Boolean(error);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Label text={label} /> : null}

      <View style={styles.fieldRow}>
        {prefixIcon ? (
          <View style={styles.prefix}>{prefixIcon}</View>
        ) : null}
        <TextInput
          placeholderTextColor={placeholderTextColor}
          selectionColor={COLORS.primary}
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

const styles = StyleSheet.create({
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
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingHorizontal: SPACING.screenPadding,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  inputWithPrefix: {
    paddingLeft: 44,
  },
  inputError: {
    borderColor: '#f87171',
    backgroundColor: '#fef2f2',
  },
  help: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
  },
});
