import React from 'react';
import { StyleSheet, View } from 'react-native';
import { EmptyState } from '@/components/common/EmptyState';

export type ListScreenEmptyPlaceholderProps = {
  message: string;
};

/**
 * Centers {@link EmptyState} for FlatList `ListEmptyComponent`.
 */
export function ListScreenEmptyPlaceholder({
  message,
}: ListScreenEmptyPlaceholderProps) {
  return (
    <View style={styles.wrap}>
      <EmptyState when={true} message={message} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 48,
  },
});
