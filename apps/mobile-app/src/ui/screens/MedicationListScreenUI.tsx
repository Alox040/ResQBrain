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

export default function MedicationListScreenUI({
  items,
  categoryFilter,
  onCategoryFilterChange,
  emptyMessage,
}: MedicationListScreenUIProps) {
  const renderItem = ({ item }: ListRenderItemInfo<MedicationListScreenRowViewModel>) => (
    <MedicationListItem
      onPress={item.onPress}
      subtitle={item.subtitle}
      tag={item.tag}
      title={item.title}
    />
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <SectionHeader
            title="Medikamentenliste"
            description="Antippen fuer Dosierung, Hinweise und Algorithmen."
            size="comfortable"
          />
        </View>

        <View style={styles.filters}>
          <CategoryFilterChips
            selected={categoryFilter}
            onChange={onCategoryFilterChange}
          />
        </View>

        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          initialNumToRender={14}
          windowSize={7}
          removeClippedSubviews
          contentContainerStyle={[
            styles.contentContainer,
            items.length === 0 ? styles.contentEmpty : null,
          ]}
          ListEmptyComponent={<ListScreenEmptyPlaceholder message={emptyMessage} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.base,
  },
  container: {
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
