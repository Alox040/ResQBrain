import React, { useMemo } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { LAYOUT, SPACING } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type DetailCrossRefListProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function DetailCrossRefList({ children, style }: DetailCrossRefListProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.row, style]}>
      <View style={styles.accent} accessibilityElementsHidden />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'stretch',
      marginTop: SPACING.gapSm,
    },
    accent: {
      width: 4,
      borderRadius: 2,
      backgroundColor: colors.primary,
      marginRight: SPACING.gapMd,
      alignSelf: 'stretch',
      minHeight: LAYOUT.minTap,
    },
    content: {
      flex: 1,
    },
  });
}
