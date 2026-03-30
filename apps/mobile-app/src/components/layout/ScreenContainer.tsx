import React from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '@/theme';

export type ScreenContainerProps = {
  children: React.ReactNode;
  /** Include bottom safe area (default true) */
  insetBottom?: boolean;
  /** Screen background (default `COLORS.bg`) */
  backgroundColor?: string;
  style?: ViewStyle;
};

export function ScreenContainer({
  children,
  insetBottom = true,
  backgroundColor = COLORS.bg,
  style,
}: ScreenContainerProps) {
  const edges: Edge[] = insetBottom ? ['top', 'bottom'] : ['top'];

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.root, { backgroundColor }, style]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: SPACING.screenPadding,
  },
});
