import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import {
  FlatList,
  type ListRenderItemInfo,
  StyleSheet,
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
  loadMedicationList,
  type LookupListRowItem,
} from '@/features/lookup/listData';
import type { MedicationStackParamList } from '@/navigation/AppNavigator';
import { TAG_CONFIG } from '@/utils/tagConfig';
import { SPACING } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';
import {
  filterByListCategory,
  type ListCategoryFilter,
} from '@/utils/listCategoryFilter';

type Nav = NativeStackNavigationProp<
  MedicationStackParamList,
  'MedicationListScreen'
>;

const medicationListKeyExtractor = (item: LookupListRowItem): string =>
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

export function MedicationListScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const [categoryFilter, setCategoryFilter] =
    useState<ListCategoryFilter>('all');
  const [medicationRows, setMedicationRows] = useState<LookupListRowItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const items = await loadMedicationList();
      setMedicationRows(items);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Medikamente konnten nicht geladen werden.';
      setErrorMessage(message);
      setMedicationRows([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredMedicationRows = useMemo(
    () => filterByListCategory(medicationRows, categoryFilter),
    [medicationRows, categoryFilter],
  );

  const listHeader = useMemo(
    () => (
      <View>
        <View style={styles.listHeader}>
          <SectionHeader
            title="Medikamentenliste"
            description="Antippen für Dosierung, Hinweise und Algorithmen."
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
    medicationRows.length === 0
      ? 'Keine Medikamente im Bundle vorhanden.'
      : 'Für diese Kategorie sind keine Medikamente im Bundle vorhanden.';

  const handlePress = useCallback(
    (medicationId: string) => {
      navigation.navigate('MedicationDetail', { medicationId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<LookupListRowItem>) => {
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
            <ListRowFavoriteStar kind="medication" id={item.id} />
          }
        />
      );
    },
    [handlePress],
  );

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.stateWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Medikamente werden geladen...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (errorMessage) {
    return (
      <ScreenContainer>
        <View style={styles.stateWrap}>
          <EmptyState
            when={true}
            message={errorMessage}
            hint="Offline-Bundle pruefen oder App neu starten."
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
          data={filteredMedicationRows}
          keyExtractor={medicationListKeyExtractor}
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
            filteredMedicationRows.length === 0 ? styles.contentEmpty : null,
          ]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenContainer>
  );
}
