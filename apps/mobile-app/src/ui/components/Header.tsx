import React, { useMemo, type ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type HeaderProps = {
  title: string;
  subtitle?: string;
  rightAction?: ReactNode;
};

export function Header({
  title,
  subtitle,
  rightAction,
}: HeaderProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.root}>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightAction ? <View style={styles.actionWrap}>{rightAction}</View> : null}
    </View>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    root: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: SPACING.gapMd,
    },
    textWrap: {
      flex: 1,
      minWidth: 0,
      gap: 6,
    },
    title: {
      ...TYPOGRAPHY.title,
      color: colors.text,
      letterSpacing: -0.3,
    },
    subtitle: {
      ...TYPOGRAPHY.bodyMuted,
      color: colors.textMuted,
    },
    actionWrap: {
      flexShrink: 0,
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
    },
  });
}
