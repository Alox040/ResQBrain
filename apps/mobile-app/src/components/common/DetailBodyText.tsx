import type { ReactNode } from 'react';
import React, { useMemo } from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';
import { TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type DetailBodyTextProps = TextProps & {
  children: ReactNode;
  variant?: 'default' | 'relaxed';
};

/** Fließtext in Detail-Screens — 16px, Dark-Mode-tauglich */
export function DetailBodyText({
  variant = 'default',
  style,
  children,
  ...rest
}: DetailBodyTextProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Text
      style={[
        styles.base,
        variant === 'relaxed' ? styles.relaxed : styles.compact,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    base: {
      ...TYPOGRAPHY.body,
      color: colors.text,
      flexShrink: 1,
    },
    compact: {
      lineHeight: 24,
    },
    relaxed: {
      lineHeight: 26,
    },
  });
}
