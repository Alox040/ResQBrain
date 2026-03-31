import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import React, { useCallback } from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';
import {
  ContentBadge,
  EmptyState,
  FlatListSeparator,
  LookupListRow,
  SectionHeader,
} from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import {
  useFavoritesSorted,
  type FavoriteRecord,
} from '@/features/favorites/favoritesStore';
import { resolveContentViewModel } from '@/data/adapters/resolveContentViewModel';
import type { RootTabParamList } from '@/navigation/AppNavigator';
import { SPACING } from '@/theme';

const KIND_BADGE_MEDICATION = {
  label: 'Medikament',
  backgroundColor: '#dbeafe',
  textColor: '#1e40af',
} as const;

const KIND_BADGE_ALGORITHM = {
  label: 'Algorithmus',
  backgroundColor: '#ede9fe',
  textColor: '#5b21b6',
} as const;

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  list: { flex: 1 },
  content: { paddingBottom: SPACING.screenPaddingBottom },
  contentEmpty: { flexGrow: 1 },
  listHeader: { paddingBottom: SPACING.gapMd },
});

function FavoritesListHeader() {
  return (
    <View style={styles.listHeader}>
      <SectionHeader
        title="Favoriten"
        description="Markierte Inhalte — neueste zuerst."
        size="comfortable"
      />
    </View>
  );
}

export function FavoritesScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const favorites = useFavoritesSorted();

  const openItem = useCallback(
    (item: FavoriteRecord) => {
      if (item.kind === 'medication') {
        navigation.navigate('MedicationList', {
          screen: 'MedicationDetail',
          params: { medicationId: item.id },
        });
        return;
      }
      navigation.navigate('AlgorithmList', {
        screen: 'AlgorithmDetail',
        params: { algorithmId: item.id },
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<FavoriteRecord>) => {
      const badge =
        item.kind === 'medication' ? KIND_BADGE_MEDICATION : KIND_BADGE_ALGORITHM;
      const vm = resolveContentViewModel(item.id, item.kind);
      const title = vm?.label ?? 'Eintrag nicht im Bundle';
      const subtitle = vm?.listSubtitle ?? item.id;

      return (
        <LookupListRow
          title={title}
          subtitle={subtitle}
          onPress={() => openItem(item)}
          accessibilityLabel={`${title}. ${subtitle}`}
          leading={
            <ContentBadge
              label={badge.label}
              backgroundColor={badge.backgroundColor}
              textColor={badge.textColor}
            />
          }
        />
      );
    },
    [openItem],
  );

  const keyExtractor = useCallback(
    (item: FavoriteRecord) => `${item.kind}:${item.id}`,
    [],
  );

  if (favorites.length === 0) {
    return (
      <ScreenContainer>
        <View style={[styles.wrap, styles.contentEmpty]}>
          <FavoritesListHeader />
          <EmptyState
            when={true}
            message="Noch keine Favoriten"
            hint="Öffne ein Medikament oder einen Algorithmus und tippe auf den Stern in der Kopfzeile."
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
          data={favorites}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={FlatListSeparator}
          ListHeaderComponent={FavoritesListHeader}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </ScreenContainer>
  );
}
