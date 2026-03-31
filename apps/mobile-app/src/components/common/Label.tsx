import React, { useMemo } from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';
import { TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type LabelProps = TextProps & {
  text: string;
};

export function Label({ text, style, ...rest }: LabelProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Text style={[styles.text, style]} {...rest}>
      {text}
    </Text>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    text: {
      ...TYPOGRAPHY.body,
      fontWeight: '700',
      color: colors.text,
    },
  });
}
