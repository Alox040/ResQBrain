import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING } from '@/theme';

const DEFAULT_HEIGHT = SPACING.gapMd;

export type FlatListSeparatorProps = {
  height?: number;
};

export function FlatListSeparator({ height = DEFAULT_HEIGHT }: FlatListSeparatorProps) {
  return <View style={[styles.rule, { height }]} />;
}

const styles = StyleSheet.create({
  rule: {
    width: '100%',
  },
});
