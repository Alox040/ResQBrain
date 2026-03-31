import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type WarningCardProps = {
  title: string;
  body: string;
  icon?: keyof typeof Ionicons.glyphMap;
  accessibilityRole?: 'alert' | 'text';
  tone?: 'default' | 'dosage';
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
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const iconSize = tone === 'dosage' ? 24 : 26;

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
        <Ionicons name={icon} size={iconSize} color={colors.warningIcon} />
        <Text
          style={
            tone === 'dosage' ? styles.titleDosage : styles.title
          }
        >
          {title}
        </Text>
      </View>
      <Text
        style={
          tone === 'dosage' ? styles.bodyDosage : styles.bodyDefault
        }
      >
        {body}
      </Text>
    </View>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    card: {
      borderRadius: SPACING.radius,
      padding: SPACING.screenPadding,
      backgroundColor: colors.warningBg,
      borderWidth: 2,
      borderColor: colors.warningBorder,
      gap: SPACING.gapSm,
    },
    cardDosage: {
      paddingVertical: SPACING.screenPadding + 4,
    },
    cardProminent: {
      paddingVertical: SPACING.screenPadding + 4,
      paddingHorizontal: SPACING.screenPadding + 2,
      borderWidth: 3,
      borderColor: colors.warningBorderStrong,
      backgroundColor: colors.warningBgProminent,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.gapSm,
    },
    title: {
      ...TYPOGRAPHY.sectionTitle,
      flex: 1,
      fontSize: 13,
      color: colors.warningTitle,
    },
    titleDosage: {
      ...TYPOGRAPHY.sectionTitle,
      flex: 1,
      fontSize: 13,
      color: colors.warningTitle,
    },
    bodyDefault: {
      ...TYPOGRAPHY.body,
      color: colors.warningBody,
      flexShrink: 1,
      fontWeight: '600',
    },
    bodyDosage: {
      fontSize: 22,
      lineHeight: 32,
      fontWeight: '700',
      color: colors.warningBody,
      flexShrink: 1,
      letterSpacing: -0.2,
    },
  });
}
