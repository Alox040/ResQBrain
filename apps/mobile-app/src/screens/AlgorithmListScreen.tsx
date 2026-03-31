import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';
import {
  ContentBadge,
  FlatListSeparator,
  ListScreenEmptyPlaceholder,
  LookupListRow,
  SectionHeader,
} from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import { mapAlgorithmToViewModel } from '@/data/adapters/mapAlgorithmToViewModel';
import type { AlgorithmViewModel } from '@/data/adapters/viewModels';
import { algorithms } from '@/data/contentIndex';
import type { AlgorithmStackParamList } from '@/navigation/AppNavigator';
import { TAG_CONFIG } from '@/utils/tagConfig';
import { SPACING } from '@/theme';

type Nav = NativeStackNavigationProp<
  AlgorithmStackParamList,
  'AlgorithmListScreen'
>;

const algorithmListKeyExtractor = (item: AlgorithmViewModel): string =>
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
});

function AlgorithmListHeader() {
  return (
    <View style={styles.listHeader}>
      <SectionHeader
        title="Algorithmen"
        description="Antippen für alle Schritte und Warnhinweise."
        size="comfortable"
      />
    </View>
  );
}

export function AlgorithmListScreen() {
  const navigation = useNavigation<Nav>();

  const algorithmRows = useMemo(
    () => algorithms.map(mapAlgorithmToViewModel),
    [algorithms],
  );

  const handlePress = useCallback(
    (algorithmId: string) => {
      navigation.navigate('AlgorithmDetail', { algorithmId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<AlgorithmViewModel>) => {
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
        />
      );
    },
    [handlePress],
  );

  return (
    <ScreenContainer>
      <View style={styles.wrap}>
        <FlatList
          style={styles.list}
          data={algorithmRows}
          keyExtractor={algorithmListKeyExtractor}
          renderItem={renderItem}
          initialNumToRender={FLAT_LIST_INITIAL_NUM_TO_RENDER}
          windowSize={FLAT_LIST_WINDOW_SIZE}
          removeClippedSubviews
          ListHeaderComponent={AlgorithmListHeader}
          ListEmptyComponent={
            <ListScreenEmptyPlaceholder message="Keine Algorithmen im Bundle vorhanden." />
          }
          ItemSeparatorComponent={FlatListSeparator}
          contentContainerStyle={[
            styles.content,
            algorithmRows.length === 0 ? styles.contentEmpty : null,
          ]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenContainer>
  );
}
