import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type DetailContentHeroProps = {
  title: string;
  categoryLabel: string | null;
  indication: string;
};

/**
 * Detail screen lead block: title, optional category line, indication body.
 */
export function DetailContentHero({
  title,
  categoryLabel,
  indication,
}: DetailContentHeroProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.wrap} accessibilityRole="header">
      <Text style={styles.title}>{title}</Text>
      {categoryLabel ? (
        <Text style={styles.category}>{categoryLabel}</Text>
      ) : null}
      <Text style={styles.indication}>{indication}</Text>
    </View>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    wrap: {
      gap: SPACING.gapSm,
      marginBottom: SPACING.gapXs,
    },
    title: {
      ...TYPOGRAPHY.title,
      fontSize: 24,
      lineHeight: 30,
      letterSpacing: -0.4,
      color: colors.text,
    },
    category: {
      ...TYPOGRAPHY.sectionTitle,
      fontSize: 11,
      color: colors.textMuted,
    },
    indication: {
      ...TYPOGRAPHY.body,
      lineHeight: 26,
      color: colors.text,
    },
  });
}
