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
  getAlgorithmById,
  getMedicationById,
} from '@/data/contentIndex';
import {
  useHistorySorted,
  type HistoryRecord,
} from '@/features/history/historyStore';
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

function HistoryListHeader() {
  return (
    <View style={styles.listHeader}>
      <SectionHeader
        title="Verlauf"
        description="Zuletzt geöffnete Inhalte — bis zu 30 Einträge, die neuesten oben."
        size="compact"
      />
    </View>
  );
}

export function HistoryScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const history = useHistorySorted();

  const openItem = useCallback(
    (item: HistoryRecord) => {
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
    ({ item }: ListRenderItemInfo<HistoryRecord>) => {
      const badge =
        item.kind === 'medication' ? KIND_BADGE_MEDICATION : KIND_BADGE_ALGORITHM;
      const entity =
        item.kind === 'medication'
          ? getMedicationById(item.id)
          : getAlgorithmById(item.id);
      const title = entity?.label ?? 'Eintrag nicht im Bundle';
      const subtitle = entity?.indication ?? item.id;

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
    (item: HistoryRecord) => `${item.kind}:${item.id}`,
    [],
  );

  if (history.length === 0) {
    return (
      <ScreenContainer>
        <View style={[styles.wrap, styles.contentEmpty]}>
          <HistoryListHeader />
          <EmptyState
            when={true}
            message="Noch kein Verlauf"
            hint="Öffne ein Medikament oder einen Algorithmus — der Verlauf erscheint hier automatisch."
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
