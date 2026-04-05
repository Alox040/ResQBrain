import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';
import {
  CategoryFilterChips,
  ContentBadge,
  FlatListSeparator,
  ListRowFavoriteStar,
  ListScreenEmptyPlaceholder,
  LookupListRow,
  SectionHeader,
} from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import { mapAlgorithmToViewModel } from '@/data/adapters/mapAlgorithmToViewModel';
import type { AlgorithmViewModel } from '@/data/adapters/viewModels';
import { algorithms } from '@/data/contentIndex';
import type { AlgorithmStackParamList } from '@/navigation/AppNavigator';
import { TAG_CONFIG } from '@/utils/tagConfig';
import { SPACING } from '@/theme';
import {
  filterByListCategory,
  type ListCategoryFilter,
} from '@/utils/listCategoryFilter';

type Nav = NativeStackNavigationProp<
  AlgorithmStackParamList,
  'AlgorithmListScreen'
>;

type AlgorithmListRoute = RouteProp<
  AlgorithmStackParamList,
  'AlgorithmListScreen'
>;

const algorithmListKeyExtractor = (item: AlgorithmViewModel): string =>
  item.id;

const FLAT_LIST_INITIAL_NUM_TO_RENDER = 14;
const FLAT_LIST_WINDOW_SIZE = 7;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.screenPaddingBottom,
  },
  contentEmpty: {
    flexGrow: 1,
  },
  listHeader: {
    paddingBottom: SPACING.gapMd,
  },
});

export function AlgorithmListScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<AlgorithmListRoute>();
  const [categoryFilter, setCategoryFilter] = useState<ListCategoryFilter>(
    route.params?.category ?? 'all',
  );

  useEffect(() => {
    setCategoryFilter(route.params?.category ?? 'all');
  }, [route.params?.category]);

  const algorithmRows = useMemo(
    () => algorithms.map(mapAlgorithmToViewModel),
    [algorithms],
  );

  const filteredAlgorithmRows = useMemo(
    () => filterByListCategory(algorithmRows, categoryFilter),
    [algorithmRows, categoryFilter],
  );

  const listHeader = useMemo(
    () => (
      <View>
        <View style={styles.listHeader}>
          <SectionHeader
            title="Algorithmen"
            description="Antippen für alle Schritte und Warnhinweise."
            size="comfortable"
          />
        </View>
        <CategoryFilterChips
          selected={categoryFilter}
          onChange={setCategoryFilter}
        />
      </View>
    ),
    [categoryFilter],
  );

  const emptyMessage =
    algorithmRows.length === 0
      ? 'Keine Algorithmen im Bundle vorhanden.'
      : 'Für diese Kategorie sind keine Algorithmen im Bundle vorhanden.';

  const handlePress = useCallback(
    (algorithmId: string) => {
      navigation.navigate('AlgorithmDetail', { algorithmId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<AlgorithmViewModel>) => {
      const primaryTag = item.tags[0];
      const tagCfg = primaryTag ? TAG_CONFIG[primaryTag] : undefined;
      const leading = tagCfg ? (
        <ContentBadge
          label={tagCfg.label}
          backgroundColor={tagCfg.backgroundColor}
          textColor={tagCfg.textColor}
        />
      ) : undefined;

      return (
        <LookupListRow
          title={item.label}
          subtitle={item.listSubtitle}
          onPress={() => handlePress(item.id)}
          accessibilityLabel={`${item.label}. ${item.listSubtitle}`}
          leading={leading}
          favoriteSlot={
            <ListRowFavoriteStar kind="algorithm" id={item.id} />
          }
        />
      );
    },
    [handlePress],
  );

  return (
    <ScreenContainer>
      <View style={styles.wrap}>
        <FlatList
          style={styles.list}
          data={filteredAlgorithmRows}
          keyExtractor={algorithmListKeyExtractor}
          renderItem={renderItem}
          initialNumToRender={FLAT_LIST_INITIAL_NUM_TO_RENDER}
          windowSize={FLAT_LIST_WINDOW_SIZE}
          removeClippedSubviews
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            <ListScreenEmptyPlaceholder message={emptyMessage} />
          }
          ItemSeparatorComponent={FlatListSeparator}
          contentContainerStyle={[
            styles.content,
            filteredAlgorithmRows.length === 0 ? styles.contentEmpty : null,
          ]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenContainer>
  );
}
