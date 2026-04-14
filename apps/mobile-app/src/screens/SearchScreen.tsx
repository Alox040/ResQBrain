import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Badge,
  ButtonSecondary,
  ContentListCard,
  EmptyState,
  InputText,
  SectionHeader,
  Tag,
} from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import {
  loadLookupSearchResults,
  type LookupSearchViewItem,
} from '@/features/lookup/searchData';
import type { RootTabParamList } from '@/navigation/AppNavigator';
import { LAYOUT, SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

function createSearchStyles(colors: AppPalette) {
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    stickyControls: {
      backgroundColor: colors.bg,
      paddingBottom: SPACING.gapMd,
      marginBottom: SPACING.gapSm,
      borderBottomWidth: StyleSheet.hairlineWidth * 2,
      borderBottomColor: colors.border,
      gap: SPACING.gapMd,
    },
    searchRow: {
      marginTop: 0,
    },
    inputContainer: {
      marginBottom: 0,
    },
    inputInner: {
      borderRadius: 16,
      minHeight: LAYOUT.minTap,
      paddingVertical: 14,
      ...TYPOGRAPHY.body,
      color: colors.text,
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
    loadingWrap: {
      flex: 1,
      justifyContent: 'center',
      minHeight: 220,
    },
    loadingText: {
      marginTop: SPACING.gapMd,
      textAlign: 'center',
      color: colors.textMuted,
    },
    emptyWrap: {
      flex: 1,
      justifyContent: 'center',
      minHeight: 220,
    },
  });
}

export function SearchScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createSearchStyles(colors), [colors]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<
    'all' | 'medication' | 'algorithm'
  >('all');
  const [results, setResults] = useState<LookupSearchViewItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(handle);
  }, [query]);

  const normalizedQuery = debouncedQuery.trim();

  useEffect(() => {
    if (normalizedQuery.length === 0) {
      setResults([]);
      setIsLoading(false);
      setErrorMessage(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const nextResults = await loadLookupSearchResults(normalizedQuery);
        if (!cancelled) {
          setResults(nextResults);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Suche konnte nicht geladen werden.';
        if (!cancelled) {
          setResults([]);
          setErrorMessage(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [normalizedQuery]);

  const filteredResults = useMemo(() => {
    if (kindFilter === 'all') {
      return results;
    }

    return results.filter((item) => item.kind === kindFilter);
  }, [kindFilter, results]);

  const handlePressResult = (item: LookupSearchViewItem) => {
    if (item.kind === 'medication') {
      navigation.navigate('MedicationTab', {
        screen: 'MedicationDetail',
        params: { medicationId: item.id },
      });
      return;
    }

    if (item.kind === 'algorithm') {
      navigation.navigate('AlgorithmTab', {
        screen: 'AlgorithmDetail',
        params: { algorithmId: item.id },
      });
    }
  };

  const showResultsList =
    normalizedQuery.length > 0 && filteredResults.length > 0;
  const showNoHits =
    normalizedQuery.length > 0 &&
    !isLoading &&
    !errorMessage &&
    filteredResults.length === 0;
  const filterLabel =
    kindFilter === 'all'
      ? 'Alle Inhalte'
      : kindFilter === 'medication'
        ? 'Nur Medikamente'
        : 'Nur Algorithmen';

  const listKeyExtractor = (item: LookupSearchViewItem) =>
    `${item.kind ?? 'unknown'}:${item.id}`;

  const renderResults = () => {
    if (!normalizedQuery) {
      return (
        <View style={styles.emptyWrap}>
          <EmptyState
            when={true}
            message="Noch keine Suche"
            hint="Tippe einen Begriff. Es wird im lokalen Inhalts-Bundle gesucht."
          />
        </View>
      );
    }

    if (isLoading) {
      return (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Suche wird geladen...</Text>
        </View>
      );
    }

    if (errorMessage) {
      return (
        <View style={styles.emptyWrap}>
          <EmptyState
            when={true}
            message={errorMessage}
            hint="Offline-Bundle pruefen oder App neu starten."
            action={
              <ButtonSecondary
                label="Erneut versuchen"
                onPress={() => {
                  setDebouncedQuery(query);
                }}
              />
            }
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
            hint={`Fuer „${query.trim()}“ unter „${filterLabel}“ nichts gefunden.`}
          />
        </View>
      );
    }

    if (showResultsList) {
      return (
        <FlatList
          style={styles.resultsList}
          data={filteredResults}
          keyboardShouldPersistTaps="handled"
          keyExtractor={listKeyExtractor}
          renderItem={({ item }) => {
            const isMed = item.kind === 'medication';
            const badgeLabel = item.kind
              ? isMed
                ? 'Medikament'
                : 'Algorithmus'
              : 'Treffer';

            return (
              <ContentListCard
                title={item.title}
                subtitle={item.summary}
                onPress={
                  item.kind
                    ? () => {
                        handlePressResult(item);
                      }
                    : undefined
                }
                accessibilityLabel={`${badgeLabel}. ${item.title}`}
                metaStart={
                  <Badge
                    label={badgeLabel}
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
          description="Lokales Bundle durchsuchen, Filter optional."
        />

        <View style={styles.stickyControls}>
          <View style={styles.searchRow}>
            <InputText
              value={query}
              onChangeText={setQuery}
              placeholder="Name, Indikation oder Stichwort"
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              containerStyle={styles.inputContainer}
              style={styles.inputInner}
              prefixIcon={
                <Ionicons name="search" size={22} color={colors.textMuted} />
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
          </View>
        </View>

        <View style={styles.resultsPane}>{renderResults()}</View>
      </View>
    </ScreenContainer>
  );
}
