import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type DetailUnavailableRowProps = {
  message: string;
  detailLine?: string;
};

export function DetailUnavailableRow({
  message,
  detailLine,
}: DetailUnavailableRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      {detailLine ? (
        <Text style={styles.detail}>{detailLine}</Text>
      ) : null}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    row: {
      paddingVertical: SPACING.gapMd,
      paddingHorizontal: SPACING.gapSm + 2,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: SPACING.gapXs,
      backgroundColor: colors.surfaceMuted,
      minHeight: LAYOUT_MIN,
    },
    detail: {
      ...TYPOGRAPHY.bodyMuted,
      color: colors.textMuted,
    },
    message: {
      ...TYPOGRAPHY.bodyMuted,
      fontStyle: 'italic',
      color: colors.textMuted,
    },
  });
}

const LAYOUT_MIN = 56;
