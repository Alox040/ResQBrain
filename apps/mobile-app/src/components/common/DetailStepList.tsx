import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type DetailStepItem = {
  text: string;
};

export type DetailStepListProps = {
  steps: readonly DetailStepItem[];
};

const BADGE = 44;
const STEP_CARD_MIN_HEIGHT = 56;

/**
 * Nummerierte Schritte — klare Nummer, Einsatz-Lesegröße 16.
 */
export function DetailStepList({ steps }: DetailStepListProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.wrap} accessibilityRole="list">
      {steps.map((step, index) => (
        <View
          key={index}
          style={styles.stepCard}
          accessibilityRole="none"
          accessibilityLabel={`Schritt ${index + 1} von ${steps.length}. ${step.text}`}
        >
          <View style={styles.row}>
            <View
              style={styles.badge}
              accessibilityElementsHidden
              importantForAccessibility="no"
            >
              <Text style={styles.badgeText}>{index + 1}</Text>
            </View>
            <View style={styles.stepBody}>
              <Text style={styles.stepMeta}>
                Schritt {index + 1} / {steps.length}
              </Text>
              <Text style={styles.body}>{step.text}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    wrap: {
      gap: SPACING.gapMd,
    },
    stepCard: {
      backgroundColor: colors.stepCardBg,
      borderRadius: SPACING.radiusSm,
      borderWidth: 2,
      borderColor: colors.stepCardBorder,
      paddingVertical: SPACING.screenPadding,
      paddingHorizontal: SPACING.gapMd,
      minHeight: STEP_CARD_MIN_HEIGHT,
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
      backgroundColor: colors.primaryMutedBg,
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginTop: 2,
    },
    badgeText: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.primary,
    },
    stepBody: {
      flex: 1,
      gap: SPACING.gapXs,
    },
    stepMeta: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.4,
      color: colors.textMuted,
      textTransform: 'uppercase',
    },
    body: {
      ...TYPOGRAPHY.body,
      flex: 1,
      color: colors.text,
      fontWeight: '500',
    },
  });
}
