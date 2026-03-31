import React, { useMemo } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type SectionHeaderSize = 'default' | 'compact' | 'comfortable' | 'detail';

export type SectionHeaderVariant = 'section' | 'screen';

export type SectionHeaderProps = {
  title: string;
  description?: string;
  size?: SectionHeaderSize;
  variant?: SectionHeaderVariant;
  style?: ViewStyle;
};

/**
 * Titled block: section eyebrows, list intros, or screen title + lead.
 */
export function SectionHeader({
  title,
  description,
  size = 'default',
  variant = 'section',
  style,
}: SectionHeaderProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (variant === 'screen') {
    return (
      <View style={[styles.wrapScreen, style]} accessibilityRole="header">
        <Text style={styles.screenTitle}>{title}</Text>
        {description ? (
          <Text style={styles.screenLead}>{description}</Text>
        ) : null}
      </View>
    );
  }

  const titleStyle =
    size === 'compact'
      ? styles.titleCompact
      : size === 'comfortable'
        ? styles.titleComfortable
        : size === 'detail'
          ? styles.titleDetail
          : styles.titleDefault;

  return (
    <View style={[styles.wrap, style]} accessibilityRole="header">
      <Text style={titleStyle}>{title}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </View>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    wrap: {
      gap: 6,
    },
    wrapScreen: {
      gap: SPACING.gapSm,
      marginBottom: SPACING.gapXs,
    },
    titleDefault: {
      ...TYPOGRAPHY.sectionTitle,
      color: colors.primary,
    },
    titleCompact: {
      ...TYPOGRAPHY.sectionTitle,
      fontSize: 11,
      color: colors.primary,
    },
    titleComfortable: {
      ...TYPOGRAPHY.sectionTitle,
      fontSize: 13,
      marginBottom: 2,
      color: colors.primary,
    },
    titleDetail: {
      ...TYPOGRAPHY.title,
      color: colors.text,
      letterSpacing: -0.3,
    },
    description: {
      ...TYPOGRAPHY.bodyMuted,
      lineHeight: 22,
      color: colors.textMuted,
    },
    screenTitle: {
      ...TYPOGRAPHY.title,
      color: colors.text,
    },
    screenLead: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.textMuted,
      fontWeight: '500',
      maxWidth: 560,
    },
  });
}
