import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme';

export type DetailUnavailableRowProps = {
  message: string;
  detailLine?: string;
};

export function DetailUnavailableRow({
  message,
  detailLine,
}: DetailUnavailableRowProps) {
  return (
    <View style={styles.row}>
      {detailLine ? (
        <Text style={styles.detail}>{detailLine}</Text>
      ) : null}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.gapXs,
    backgroundColor: '#fafafa',
  },
  detail: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 13,
  },
  message: {
    ...TYPOGRAPHY.bodyMuted,
    fontStyle: 'italic',
  },
});
