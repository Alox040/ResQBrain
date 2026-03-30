import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
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
import { algorithms } from '@/data/contentIndex';
import type { AlgorithmStackParamList } from '@/navigation/AppNavigator';
import type { Algorithm } from '@/types/content';
import { TAG_CONFIG } from '@/utils/tagConfig';
import { SPACING } from '@/theme';

type Nav = NativeStackNavigationProp<AlgorithmStackParamList, 'AlgorithmList'>;

const algorithmListKeyExtractor = (item: Algorithm): string => item.id;

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
        description="Schrittfolgen mit klarer Einordnung — Tippen öffnet den kompletten Ablauf."
        size="compact"
      />
    </View>
  );
}

export function AlgorithmListScreen() {
  const navigation = useNavigation<Nav>();

  const handlePress = useCallback(
    (algorithmId: string) => {
      navigation.navigate('AlgorithmDetail', { algorithmId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Algorithm>) => {
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
          subtitle={item.indication}
          onPress={() => handlePress(item.id)}
          accessibilityLabel={`${item.label}. ${item.indication}`}
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
          data={algorithms}
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
            algorithms.length === 0 ? styles.contentEmpty : null,
          ]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenContainer>
  );
}
