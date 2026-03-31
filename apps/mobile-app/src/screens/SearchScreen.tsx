import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  Badge,
  ContentListCard,
  EmptyState,
  InputText,
  SectionHeader,
  Tag,
} from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import { resolveContentViewModel } from '@/data/adapters/resolveContentViewModel';
import { contentItems } from '@/data/contentIndex';
import type { RootTabParamList } from '@/navigation/AppNavigator';
import type { ContentListItem } from '@/types/content';
import {
  rankContentItemsForSearch,
  type ScoredContentListItem,
} from '@/utils/searchRanking';
import { COLORS, LAYOUT, SPACING } from '@/theme';

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<
    'all' | 'medication' | 'algorithm'
  >('all');
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(
    () =>
      normalizedQuery
        ? rankContentItemsForSearch(contentItems, query, kindFilter)
        : [],
    [normalizedQuery, query, kindFilter],
  );

  const resultRows = useMemo(
    () =>
      results.map((r) => {
        const vm = resolveContentViewModel(r.id, r.kind);
        return { ...r, vm };
      }),
    [results],
  );

  const handlePressResult = (item: ContentListItem) => {
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
  };

  const showResultsList = normalizedQuery.length > 0 && resultRows.length > 0;
  const showNoHits = normalizedQuery.length > 0 && resultRows.length === 0;
  const filterLabel =
    kindFilter === 'all'
      ? 'Alle Inhalte'
      : kindFilter === 'medication'
        ? 'Nur Medikamente'
        : 'Nur Algorithmen';

  const listKeyExtractor = (item: ScoredContentListItem) =>
    `${item.kind}:${item.id}`;

  const renderResults = () => {
    if (!normalizedQuery) {
      return (
        <View style={styles.emptyWrap}>
          <EmptyState
            when={true}
            message="Noch keine Suche"
            hint="Tippe einen Begriff — Treffer kommen aus Medikamenten und Algorithmen des lokalen Bundles. Der Inhalt-Filter schränkt die Ergebnisse mit ein."
          />
        </View>
      );
    }
    if (showNoHits) {
      return (
        <View style={styles.emptyWrap}>
          <EmptyState
            when={true}
            message="Keine Treffer"
            hint={`Für „${query.trim()}“ unter „${filterLabel}“ nichts gefunden. Filter zurücksetzen oder andere Schreibweise probieren (z. B. Synonym in den Suchbegriffen).`}
          />
        </View>
      );
    }
    if (showResultsList) {
      return (
        <FlatList
          style={styles.resultsList}
          data={resultRows}
          keyboardShouldPersistTaps="handled"
          keyExtractor={listKeyExtractor}
          renderItem={({ item }) => {
            const isMed = item.kind === 'medication';
            const title = item.vm?.label ?? item.label;
            const subtitle = item.vm?.listSubtitle ?? item.subtitle;
            return (
              <ContentListCard
                title={title}
                subtitle={subtitle}
                onPress={() => handlePressResult(item)}
                accessibilityLabel={`${isMed ? 'Medikament' : 'Algorithmus'}. ${title}`}
                metaStart={
                  <Badge
                    label={isMed ? 'Medikament' : 'Algorithmus'}
                    variant={isMed ? 'primary' : 'muted'}
                  />
                }
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      );
    }
    return null;
  };

  return (
    <ScreenContainer>
      <View style={styles.root}>
        <SectionHeader
          variant="screen"
          title="Suche"
          description="Lokales Bundle — Begriff tippen, Filter optional."
        />

        <View style={styles.stickyControls}>
          <View style={styles.searchRow}>
            <InputText
              value={query}
              onChangeText={setQuery}
              placeholder="Name, Indikation oder Stichwort"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              containerStyle={styles.inputContainer}
              style={styles.inputInner}
              prefixIcon={
                <Ionicons name="search" size={22} color={COLORS.textMuted} />
              }
            />
          </View>

          <View style={styles.filterBlock}>
            <SectionHeader title="Inhalt" size="compact" />
            <View style={styles.filterRow}>
              <Tag
                label="Alle"
                selected={kindFilter === 'all'}
                onPress={() => setKindFilter('all')}
                style={styles.filterTag}
              />
              <Tag
                label="Medikamente"
                selected={kindFilter === 'medication'}
                onPress={() => setKindFilter('medication')}
                style={styles.filterTag}
              />
              <Tag
                label="Algorithmen"
                selected={kindFilter === 'algorithm'}
                onPress={() => setKindFilter('algorithm')}
                style={styles.filterTag}
              />
            </View>
            <View style={styles.filterStatus} accessibilityRole="text">
              <Ionicons
                name="funnel-outline"
                size={20}
                color={COLORS.primary}
                style={styles.filterStatusIcon}
              />
              <Text style={styles.filterStatusText}>
                Aktiver Filter:{' '}
                <Text style={styles.filterStatusEmphasis}>{filterLabel}</Text>
              </Text>
              {kindFilter !== 'all' ? (
                <Pressable
                  onPress={() => setKindFilter('all')}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel="Filter auf alle Inhalte zurücksetzen"
                  style={({ pressed }) => [
                    styles.filterClearBtn,
                    pressed && styles.filterClearBtnPressed,
                  ]}
                >
                  <Text style={styles.filterClearLabel}>Alle anzeigen</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.resultsPane}>{renderResults()}</View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  stickyControls: {
    backgroundColor: COLORS.bg,
    paddingBottom: SPACING.gapMd,
    marginBottom: SPACING.gapSm,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: COLORS.border,
    gap: SPACING.gapMd,
  },
  searchRow: {
    marginTop: 0,
  },
  inputContainer: {
    marginBottom: 0,
  },
  inputInner: {
    borderRadius: SPACING.radius,
    minHeight: LAYOUT.minTap + 8,
    paddingVertical: 16,
    fontSize: 17,
  },
  filterBlock: {
    gap: SPACING.gapSm,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.gapSm,
  },
  filterTag: {
    minHeight: LAYOUT.minTap,
  },
  filterStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.gapSm,
    paddingVertical: 12,
    paddingHorizontal: SPACING.screenPadding,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterStatusIcon: {
    marginRight: -4,
  },
  filterStatusText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textMuted,
    minWidth: 120,
  },
  filterStatusEmphasis: {
    fontWeight: '800',
    color: COLORS.text,
  },
  filterClearBtn: {
    minHeight: LAYOUT.minTap,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: SPACING.radiusSm,
    backgroundColor: COLORS.primaryMutedBg,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    justifyContent: 'center',
  },
  filterClearBtnPressed: {
    opacity: 0.88,
  },
  filterClearLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  resultsPane: {
    flex: 1,
  },
  resultsList: {
    flex: 1,
  },
  listContent: {
    gap: SPACING.gapMd,
    paddingBottom: SPACING.screenPadding,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 220,
  },
});
