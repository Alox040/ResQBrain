import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { COLORS, SPACING } from '@/theme';

export type DetailCrossRefListProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

/**
 * Querverweise mit linker Akzentlinie — konsistent in Medikament- und Algorithmus-Detail.
 */
export function DetailCrossRefList({ children, style }: DetailCrossRefListProps) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.accent} accessibilityElementsHidden />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: SPACING.gapSm,
  },
  accent: {
    width: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.gapMd,
    alignSelf: 'stretch',
    minHeight: 48,
  },
  content: {
    flex: 1,
  },
});
