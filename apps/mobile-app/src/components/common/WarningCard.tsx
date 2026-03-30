import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SPACING, TYPOGRAPHY } from '@/theme';

export type WarningCardProps = {
  title: string;
  body: string;
  icon?: keyof typeof Ionicons.glyphMap;
  accessibilityRole?: 'alert' | 'text';
  /** dosage callout uses stronger body typography */
  tone?: 'default' | 'dosage';
  /** stärkere optische Priorität (z. B. Algorithmus-Warnung oben) */
  prominent?: boolean;
  style?: ViewStyle;
};

export function WarningCard({
  title,
  body,
  icon = 'alert-circle',
  accessibilityRole = 'alert',
  tone = 'default',
  prominent = false,
  style,
}: WarningCardProps) {
  const iconSize = tone === 'dosage' ? 18 : 22;

  return (
    <View
      style={[
        styles.card,
        tone === 'dosage' ? styles.cardDosage : null,
        prominent && tone !== 'dosage' ? styles.cardProminent : null,
        style,
      ]}
      accessibilityRole={accessibilityRole}
    >
      <View style={styles.titleRow}>
        <Ionicons name={icon} size={iconSize} color="#b45309" />
        <Text style={tone === 'dosage' ? styles.titleDosage : styles.title}>
          {title}
        </Text>
      </View>
      <Text
        style={tone === 'dosage' ? styles.bodyDosage : styles.bodyDefault}
      >
        {body}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: SPACING.radius,
    padding: SPACING.screenPadding,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#f59e0b',
    gap: SPACING.gapSm,
  },
  cardDosage: {
    borderRadius: SPACING.radiusSm,
  },
  cardProminent: {
    paddingVertical: SPACING.screenPadding + 2,
    paddingHorizontal: SPACING.screenPadding + 2,
    borderWidth: 2,
    borderColor: '#d97706',
    backgroundColor: '#fffbeb',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.gapSm,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#b45309',
  },
  titleDosage: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#b45309',
  },
  bodyDefault: {
    ...TYPOGRAPHY.body,
    color: '#78350f',
    flexShrink: 1,
    fontSize: 17,
    lineHeight: 26,
  },
  bodyDosage: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: '#78350f',
    flexShrink: 1,
  },
});
