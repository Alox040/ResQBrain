import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { contentItems } from '@/data/contentIndex';
import type { RootTabParamList } from '@/navigation/AppNavigator';
import type { ContentItem, ContentListItem } from '@/types/content';
import { CARD, COLORS, SPACING, TYPOGRAPHY } from '@/ui/theme';

/**
 * Phase-0 lookup: case-insensitive substring on statischen Bundle-Texten.
 * Kein Fuzzy-Matching, keine KI — nur includes() auf Freitextfeldern.
 */
function matchesLookupBundleItem(item: ContentItem, q: string): boolean {
  const haystacks: string[] = [
    item.label,
    item.indication,
    ...item.searchTerms,
  ];

  if (item.kind === 'medication') {
    haystacks.push(item.dosage);
    if (item.notes) haystacks.push(item.notes);
  } else {
    if (item.notes) haystacks.push(item.notes);
    if (item.warnings) haystacks.push(item.warnings);
    for (const step of item.steps) {
      haystacks.push(step.text);
    }
  }

  return haystacks.some((text) => text.toLowerCase().includes(q));
}

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<'all' | 'medication' | 'algorithm'>('all');
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const normalizedQuery = query.trim().toLowerCase();
  const results: ContentListItem[] = normalizedQuery
    ? contentItems
        .filter(
          (item) =>
            (kindFilter === 'all' || item.kind === kindFilter) &&
            matchesLookupBundleItem(item, normalizedQuery),
        )
        .map((item) => ({
          id: item.id,
          kind: item.kind,
          label: item.label,
          subtitle: item.indication,
        }))
    : [];

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

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Suche</Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Medikament oder Algorithmus suchen"
          placeholderTextColor="#6b7280"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />

        <View style={styles.filterRow}>
          <Pressable
            onPress={() => setKindFilter('all')}
            style={[
              styles.filterChip,
              kindFilter === 'all' ? styles.filterChipActive : null,
            ]}
          >
            <Text
              style={[
                styles.filterChipLabel,
                kindFilter === 'all' ? styles.filterChipLabelActive : null,
              ]}
            >
              Alle
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setKindFilter('medication')}
            style={[
              styles.filterChip,
              kindFilter === 'medication' ? styles.filterChipActive : null,
            ]}
          >
            <Text
              style={[
                styles.filterChipLabel,
                kindFilter === 'medication' ? styles.filterChipLabelActive : null,
              ]}
            >
              Medikamente
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setKindFilter('algorithm')}
            style={[
              styles.filterChip,
              kindFilter === 'algorithm' ? styles.filterChipActive : null,
            ]}
          >
            <Text
              style={[
                styles.filterChipLabel,
                kindFilter === 'algorithm' ? styles.filterChipLabelActive : null,
              ]}
            >
              Algorithmen
            </Text>
          </Pressable>
        </View>

        {!normalizedQuery ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Suche starten</Text>
            <Text style={styles.emptyText}>
              Gib einen Medikamenten- oder Algorithmusnamen ein.
            </Text>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Keine Treffer</Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const kindLabel =
                item.kind === 'medication' ? 'Medikament' : 'Algorithmus';

              return (
                <Pressable
                  onPress={() => handlePressResult(item)}
                  style={styles.resultRow}
                >
                  <Text style={styles.resultKind}>{kindLabel}</Text>
                  <Text style={styles.resultTitle}>{item.label}</Text>
                  <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
                </Pressable>
              );
            }}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.screenPaddingBottom,
    gap: SPACING.gapMd,
  },
  title: {
    ...TYPOGRAPHY.title,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SPACING.radius,
    paddingHorizontal: SPACING.screenPadding,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  emptyState: {
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SPACING.radius,
    paddingHorizontal: SPACING.screenPadding,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  emptyText: {
    ...TYPOGRAPHY.bodyMuted,
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: COLORS.surface,
  },
  filterChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryMutedBg,
  },
  filterChipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  filterChipLabelActive: {
    color: '#1d4ed8',
  },
  listContent: {
    gap: 10,
  },
  resultRow: {
    minHeight: 84,
    ...CARD.base,
    justifyContent: 'center',
  },
  resultKind: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  resultTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: COLORS.text,
  },
  resultSubtitle: {
    ...TYPOGRAPHY.bodyMuted,
    color: '#4b5563',
    marginTop: 6,
  },
});
