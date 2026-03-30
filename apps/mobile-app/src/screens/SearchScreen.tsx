import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
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
import { contentItems } from '@/data/contentIndex';
import type { RootTabParamList } from '@/navigation/AppNavigator';
import type { ContentItem, ContentListItem } from '@/types/content';
import { COLORS, SPACING } from '@/theme';

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
  const [kindFilter, setKindFilter] = useState<
    'all' | 'medication' | 'algorithm'
  >('all');
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

  const showResultsList = normalizedQuery.length > 0 && results.length > 0;
  const showNoHits = normalizedQuery.length > 0 && results.length === 0;

  return (
    <ScreenContainer>
      <View style={styles.inner}>
        <SectionHeader
          variant="screen"
          title="Suche"
          description="Volltext im lokalen Bundle — ideal für schnelle Kontexte unter Druck."
        />

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
              <Ionicons name="search" size={20} color={COLORS.textMuted} />
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

        {!normalizedQuery ? (
          <EmptyState
            when={true}
            message="Tippe mindestens einen Buchstaben, um Treffer aus Medikamenten und Algorithmen zu sehen."
          />
        ) : showNoHits ? (
          <EmptyState
            when={true}
            message={`Keine Treffer für „${query.trim()}“. Filter oder Schreibweise prüfen.`}
          />
        ) : showResultsList ? (
          <FlatList
            style={styles.resultsList}
            data={results}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isMed = item.kind === 'medication';
              return (
                <ContentListCard
                  title={item.label}
                  subtitle={item.subtitle}
                  onPress={() => handlePressResult(item)}
                  accessibilityLabel={`${isMed ? 'Medikament' : 'Algorithmus'}. ${item.label}`}
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
        ) : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    gap: SPACING.gapMd,
    paddingBottom: SPACING.screenPaddingBottom,
  },
  searchRow: {
    marginTop: SPACING.gapXs,
  },
  inputContainer: {
    marginBottom: 0,
  },
  inputInner: {
    borderRadius: SPACING.radius,
    paddingVertical: 14,
    fontSize: 16,
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
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  resultsList: {
    flex: 1,
  },
  listContent: {
    gap: SPACING.gapMd,
    paddingBottom: SPACING.screenPadding,
  },
});
