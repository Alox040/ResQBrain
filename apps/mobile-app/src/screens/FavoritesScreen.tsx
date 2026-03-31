import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import React, { useCallback, useMemo } from 'react';
import {
  SectionList,
  type SectionListRenderItemInfo,
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
} from '@/state/favoritesStore';
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
  sectionHeader: { paddingTop: SPACING.gapMd, paddingBottom: SPACING.gapSm },
});

type FavoritesSection = {
  title: string;
  data: FavoriteRecord[];
};

function FavoritesListIntro() {
  return (
    <View style={styles.listHeader}>
      <SectionHeader
        title="Favoriten"
        description="Medikamente und Algorithmen — getrennt nach Typ, neueste zuerst."
        size="comfortable"
      />
    </View>
  );
}

export function FavoritesScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const favorites = useFavoritesSorted();

  const sections = useMemo((): FavoritesSection[] => {
    const medications = favorites.filter((f) => f.kind === 'medication');
    const algorithms = favorites.filter((f) => f.kind === 'algorithm');
    const out: FavoritesSection[] = [];
    if (medications.length > 0) {
      out.push({ title: 'Medikamente', data: medications });
    }
    if (algorithms.length > 0) {
      out.push({ title: 'Algorithmen', data: algorithms });
    }
    return out;
  }, [favorites]);

  const openItem = useCallback(
    (item: FavoriteRecord) => {
      if (item.kind === 'medication') {
        navigation.navigate('MedicationTab', {
          screen: 'MedicationDetail',
          params: { medicationId: item.id },
        });
        return;
      }
      navigation.navigate('AlgorithmTab', {
        screen: 'AlgorithmDetail',
        params: { algorithmId: item.id },
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: SectionListRenderItemInfo<FavoriteRecord, FavoritesSection>) => {
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

  const renderSectionHeader = useCallback(
    ({ section }: { section: FavoritesSection }) => (
      <View style={styles.sectionHeader}>
        <SectionHeader title={section.title} size="compact" />
      </View>
    ),
    [],
  );

  if (favorites.length === 0) {
    return (
      <ScreenContainer>
        <View style={[styles.wrap, styles.contentEmpty]}>
          <FavoritesListIntro />
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
        <SectionList
          style={styles.list}
          sections={sections}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          SectionSeparatorComponent={() => null}
          ItemSeparatorComponent={FlatListSeparator}
          ListHeaderComponent={FavoritesListIntro}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          stickySectionHeadersEnabled={false}
        />
      </View>
    </ScreenContainer>
  );
}
