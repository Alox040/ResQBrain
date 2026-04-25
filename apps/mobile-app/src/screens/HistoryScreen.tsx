import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
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
import { resolveContentViewModel } from '@/data/adapters/resolveContentViewModel';
import {
  useHistorySorted,
  type HistoryRecord,
} from '@/features/history/historyStore';
import type {
  RootStackParamList,
  RootTabParamList,
} from '@/navigation/AppNavigator';
import type { HomeStackParamList } from '@/navigation/homeStackParamList';
import { SPACING } from '@/theme';

type HistoryScreenNav = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'History'>,
  CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList>,
    NativeStackNavigationProp<RootStackParamList>
  >
>;

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

function HistoryListHeader() {
  return (
    <View style={styles.listHeader}>
      <SectionHeader
        title="Verlauf"
        description="Zuletzt geöffnet - max. 30 Einträge, neueste oben."
        size="comfortable"
      />
    </View>
  );
}

export function HistoryScreen() {
  const navigation = useNavigation<HistoryScreenNav>();
  const history = useHistorySorted();
  const [labelsByKey, setLabelsByKey] = useState<Record<string, {
    title: string;
    subtitle: string;
  }>>({});

  const openItem = useCallback(
    (item: HistoryRecord) => {
      if (item.kind === 'medication') {
        navigation.navigate('MedicationDetail', { medicationId: item.id });
        return;
      }
      navigation.navigate('AlgorithmDetail', { algorithmId: item.id });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<HistoryRecord>) => {
      const badge =
        item.kind === 'medication' ? KIND_BADGE_MEDICATION : KIND_BADGE_ALGORITHM;
      const resolved = labelsByKey[`${item.kind}:${item.id}`];
      const title = resolved?.title ?? 'Eintrag nicht im Bundle';
      const subtitle = resolved?.subtitle ?? item.id;

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
    [labelsByKey, openItem],
  );

  const keyExtractor = useCallback(
    (item: HistoryRecord) => `${item.kind}:${item.id}`,
    [],
  );

  useEffect(() => {
    let cancelled = false;

    const loadHistoryLabels = async () => {
      try {
        const entries = await Promise.all(
          history.map(async (item) => {
            const vm = await resolveContentViewModel(item.id, item.kind);
            return [
              `${item.kind}:${item.id}`,
              {
                title: vm?.label ?? 'Eintrag nicht im Bundle',
                subtitle: vm?.listSubtitle ?? item.id,
              },
            ] as const;
          }),
        );

        if (!cancelled) {
          setLabelsByKey(Object.fromEntries(entries));
        }
      } catch {
        if (!cancelled) {
          setLabelsByKey({});
        }
      }
    };

    void loadHistoryLabels();

    return () => {
      cancelled = true;
    };
  }, [history]);

  if (history.length === 0) {
    return (
      <ScreenContainer>
        <View style={[styles.wrap, styles.contentEmpty]}>
          <HistoryListHeader />
          <EmptyState
            when={true}
            message="Noch kein Verlauf"
            hint="Öffne ein Medikament oder einen Algorithmus - der Verlauf erscheint hier automatisch."
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
          data={history}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={FlatListSeparator}
          ListHeaderComponent={HistoryListHeader}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </ScreenContainer>
  );
}

