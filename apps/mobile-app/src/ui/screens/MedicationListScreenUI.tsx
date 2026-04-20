import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryFilterChips, ListScreenEmptyPlaceholder, SectionHeader } from '@/components/common';
import { MedicationListItem } from '@/ui/components/MedicationListItem';
import { colors } from '@/ui/theme/colors';
import { spacing } from '@/ui/theme/spacing';
import type { ListCategoryFilter } from '@/utils/listCategoryFilter';

export type MedicationListScreenRowViewModel = {
  id: string;
  title: string;
  subtitle?: string;
  tag?: string;
  onPress: () => void;
};

export type MedicationListScreenUIProps = {
  items: MedicationListScreenRowViewModel[];
  categoryFilter: ListCategoryFilter;
  onCategoryFilterChange: (value: ListCategoryFilter) => void;
  emptyMessage: string;
};

const keyExtractor = (item: MedicationListScreenRowViewModel): string => item.id;

const INITIAL_RENDER = 10;
const WINDOW_SIZE = 8;
const MAX_BATCH = 12;

export default function MedicationListScreenUI({
  items,
  categoryFilter,
  onCategoryFilterChange,
  emptyMessage,
}: MedicationListScreenUIProps) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MedicationListScreenRowViewModel>) => (
      <MedicationListItem
        onPress={item.onPress}
        subtitle={item.subtitle}
        tag={item.tag}
        title={item.title}
      />
    ),
    [],
  );

  const listEmpty = useMemo(
    () => <ListScreenEmptyPlaceholder message={emptyMessage} />,
    [emptyMessage],
  );

  const contentContainerStyle = useMemo(
    () => [styles.contentContainer, items.length === 0 ? styles.contentEmpty : null],
    [items.length],
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <SectionHeader
        title="Medikamentenliste"
        description="Antippen fuer Dosierung, Hinweise und Algorithmen."
        size="comfortable"
        style={styles.header}
      />

      <View style={styles.filters}>
        <CategoryFilterChips selected={categoryFilter} onChange={onCategoryFilterChange} />
      </View>

      <FlatList
        style={styles.list}
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        initialNumToRender={INITIAL_RENDER}
        maxToRenderPerBatch={MAX_BATCH}
        updateCellsBatchingPeriod={50}
        windowSize={WINDOW_SIZE}
        removeClippedSubviews
        contentContainerStyle={contentContainerStyle}
        ListEmptyComponent={listEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.base,
  },
  list: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.screenPaddingH,
    paddingTop: spacing.itemGap,
    paddingBottom: spacing.itemGap,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDeep,
    gap: spacing.badgeToText,
  },
  filters: {
    paddingTop: spacing.sectionGap,
  },
  contentContainer: {
    paddingHorizontal: spacing.screenPaddingH,
    paddingTop: spacing.sectionGap,
    paddingBottom: spacing.screenPaddingBottom,
    gap: spacing.itemGap,
  },
  contentEmpty: {
    flexGrow: 1,
  },
});
