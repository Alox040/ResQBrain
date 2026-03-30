import type { ReactNode } from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';
import { COLORS, TYPOGRAPHY } from '@/theme';

export type DetailBodyTextProps = TextProps & {
  children: ReactNode;
  /** Einsatz-Lesen: etwas größere Zeilenhöhe */
  variant?: 'default' | 'relaxed';
};

/** Fließtext in Detail-Screens — einheitliche Lesbarkeit. */
export function DetailBodyText({
  variant = 'default',
  style,
  children,
  ...rest
}: DetailBodyTextProps) {
  return (
    <Text
      style={[
        styles.base,
        variant === 'relaxed' ? styles.relaxed : styles.defaultSize,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flexShrink: 1,
  },
  defaultSize: {
    fontSize: 17,
    lineHeight: 26,
  },
  relaxed: {
    fontSize: 17,
    lineHeight: 28,
  },
});
