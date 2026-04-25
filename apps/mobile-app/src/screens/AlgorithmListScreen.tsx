import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  type ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ButtonSecondary,
  CategoryFilterChips,
  ContentBadge,
  EmptyState,
  FlatListSeparator,
  ListRowFavoriteStar,
  ListScreenEmptyPlaceholder,
  LookupListRow,
  SectionHeader,
} from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import {
  loadAlgorithmList,
  type LookupListRowItem,
} from '@/features/lookup/listData';
import { toLookupUiErrorState } from '@/lookup/lookupErrors';
import type { AlgorithmStackParamList } from '@/navigation/AppNavigator';
import { TAG_CONFIG } from '@/utils/tagConfig';
import { SPACING } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';
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

const algorithmListKeyExtractor = (item: LookupListRowItem): string =>
  item.id;

const FLAT_LIST_INITIAL_NUM_TO_RENDER = 14;
const FLAT_LIST_MAX_TO_RENDER_PER_BATCH = 10;
const FLAT_LIST_WINDOW_SIZE = 7;

type AlgorithmRowProps = {
  item: LookupListRowItem;
  onPressItem: (id: string) => void;
};

const AlgorithmRow = React.memo(function AlgorithmRow({
  item,
  onPressItem,
}: AlgorithmRowProps) {
  const handlePress = useCallback(() => {
    onPressItem(item.id);
  }, [item.id, onPressItem]);

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
      onPress={handlePress}
      accessibilityLabel={`${item.label}. ${item.listSubtitle}`}
      leading={leading}
      favoriteSlot={<ListRowFavoriteStar kind="algorithm" id={item.id} />}
    />
  );
});

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
  stateWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: SPACING.screenPaddingBottom,
  },
  loadingText: {
    marginTop: SPACING.gapMd,
    textAlign: 'center',
  },
});

export function AlgorithmListScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const route = useRoute<AlgorithmListRoute>();
  const [categoryFilter, setCategoryFilter] = useState<ListCategoryFilter>(
    route.params?.category ?? 'all',
  );
  const [algorithmRows, setAlgorithmRows] = useState<LookupListRowItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<{
    message: string;
    hint: string;
  } | null>(null);

  useEffect(() => {
    setCategoryFilter(route.params?.category ?? 'all');
  }, [route.params?.category]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorState(null);

    try {
      const items = await loadAlgorithmList();
      setAlgorithmRows(items);
    } catch (error) {
      setErrorState(toLookupUiErrorState(error));
      setAlgorithmRows([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

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
    ({ item }: ListRenderItemInfo<LookupListRowItem>) => (
      <AlgorithmRow item={item} onPressItem={handlePress} />
    ),
    [handlePress],
  );

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.stateWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Algorithmen werden geladen...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (errorState) {
    return (
      <ScreenContainer>
        <View style={styles.stateWrap}>
          <EmptyState
            when={true}
            message={errorState.message}
            hint={errorState.hint}
            action={
              <ButtonSecondary
                label="Erneut versuchen"
                onPress={() => {
                  void loadData();
                }}
              />
            }
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.wrap}>
        <FlatList
          style={styles.list}
          data={filteredAlgorithmRows}
          keyExtractor={algorithmListKeyExtractor}
          renderItem={renderItem}
          initialNumToRender={FLAT_LIST_INITIAL_NUM_TO_RENDER}
          maxToRenderPerBatch={FLAT_LIST_MAX_TO_RENDER_PER_BATCH}
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
