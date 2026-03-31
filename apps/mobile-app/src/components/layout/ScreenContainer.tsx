import React from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { SPACING } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';

export type ScreenContainerProps = {
  children: React.ReactNode;
  /** Include bottom safe area (default true) */
  insetBottom?: boolean;
  /** Overrides theme screen background when set */
  backgroundColor?: string;
  style?: ViewStyle;
};

export function ScreenContainer({
  children,
  insetBottom = true,
  backgroundColor,
  style,
}: ScreenContainerProps) {
  const { colors } = useTheme();
  const edges: Edge[] = insetBottom ? ['top', 'bottom'] : ['top'];
  const bg = backgroundColor ?? colors.bg;

  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: bg }, style]}>
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
