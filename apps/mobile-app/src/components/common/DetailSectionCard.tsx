import React, { useMemo } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SectionHeader } from './SectionHeader';
import { CARD, SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type DetailSectionTone = 'default' | 'soft';

export type DetailSectionCardProps = {
  title: string;
  hint?: string;
  children: React.ReactNode;
  tone?: DetailSectionTone;
  style?: ViewStyle;
};

/**
 * Detail screen block: card + Abschnittstitel (20px) + optional hint + content.
 */
export function DetailSectionCard({
  title,
  hint,
  children,
  style,
  tone = 'default',
}: DetailSectionCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={[
        styles.card,
        tone === 'soft' ? styles.cardSoft : null,
        style,
      ]}
    >
      <SectionHeader title={title} size="detail" />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      {children}
    </View>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    card: {
      ...CARD.shell,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      gap: SPACING.gapMd,
      paddingVertical: SPACING.screenPadding + 2,
    },
    cardSoft: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
    },
    hint: {
      ...TYPOGRAPHY.bodyMuted,
      lineHeight: 22,
      marginTop: -4,
      color: colors.textMuted,
    },
  });
}
