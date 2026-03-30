import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme';

export type DetailStepItem = {
  text: string;
};

export type DetailStepListProps = {
  steps: readonly DetailStepItem[];
};

const BADGE = 40;

/**
 * Nummerierte Schritte mit klarem Kartenrhythmus (Scanbarkeit im Einsatz).
 */
export function DetailStepList({ steps }: DetailStepListProps) {
  return (
    <View style={styles.wrap} accessibilityRole="list">
      {steps.map((step, index) => (
        <View
          key={index}
          style={styles.stepCard}
          accessibilityRole="none"
          accessibilityLabel={`Schritt ${index + 1}. ${step.text}`}
        >
          <View style={styles.row}>
            <View
              style={styles.badge}
              accessibilityElementsHidden
              importantForAccessibility="no"
            >
              <Text style={styles.badgeText}>{index + 1}</Text>
            </View>
            <Text style={styles.body}>{step.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: SPACING.screenPadding,
  },
  stepCard: {
    backgroundColor: '#f8fafc',
    borderRadius: SPACING.radiusSm,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: SPACING.screenPadding,
    paddingHorizontal: SPACING.gapMd,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.gapMd,
  },
  badge: {
    minWidth: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    backgroundColor: COLORS.primaryMutedBg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  badgeText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  body: {
    ...TYPOGRAPHY.body,
    flex: 1,
    fontSize: 17,
    lineHeight: 28,
    color: COLORS.text,
  },
});
