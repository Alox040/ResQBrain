import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SPACING, TYPOGRAPHY } from '@/theme';

export type SectionHeaderSize = 'default' | 'compact' | 'comfortable';

export type SectionHeaderVariant = 'section' | 'screen';

export type SectionHeaderProps = {
  title: string;
  description?: string;
  /** List/filter eyebrows */
  size?: SectionHeaderSize;
  /** Screen-level title + lead (e.g. Search) */
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

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  wrapScreen: {
    gap: SPACING.gapXs,
  },
  titleDefault: {
    ...TYPOGRAPHY.sectionTitle,
  },
  titleCompact: {
    ...TYPOGRAPHY.sectionTitle,
    fontSize: 11,
  },
  titleComfortable: {
    ...TYPOGRAPHY.sectionTitle,
    fontSize: 13,
    marginBottom: 2,
  },
  description: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  screenTitle: {
    ...TYPOGRAPHY.title,
  },
  screenLead: {
    ...TYPOGRAPHY.bodyMuted,
    marginTop: -4,
  },
});
