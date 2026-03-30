import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { EmptyState } from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import { algorithms } from '@/data/contentIndex';
import type { AlgorithmStackParamList } from '@/navigation/AppNavigator';
import type { Algorithm } from '@/types/content';
import { TAG_CONFIG } from '@/utils/tagConfig';
import { CARD, COLORS, SPACING, TYPOGRAPHY } from '@/theme';

type Nav = NativeStackNavigationProp<AlgorithmStackParamList, 'AlgorithmList'>;

const algorithmListKeyExtractor = (item: Algorithm): string => item.id;

const FLAT_LIST_INITIAL_NUM_TO_RENDER = 14;
const FLAT_LIST_WINDOW_SIZE = 7;

const ROW_MIN_HEIGHT = 96;

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
    gap: 6,
  },
  listHeaderTitle: {
    ...TYPOGRAPHY.sectionTitle,
    fontSize: 11,
  },
  listHeaderBody: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  separator: {
    height: SPACING.gapMd,
  },
  row: {
    ...CARD.base,
    minHeight: ROW_MIN_HEIGHT,
    paddingVertical: SPACING.screenPadding,
    gap: SPACING.gapSm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBody: {
    flex: 1,
    gap: 6,
  },
  rowPressed: {
    backgroundColor: COLORS.primaryMutedBg,
    borderColor: '#bfdbfe',
  },
  tagBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  indication: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textMuted,
  },
  emptyWrap: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 48,
  },
});

function AlgorithmListSeparator() {
  return <View style={styles.separator} />;
}

type AlgorithmListRowProps = {
  item: Algorithm;
  onPress: (algorithmId: string) => void;
};

const AlgorithmListRow = React.memo(function AlgorithmListRow({
  item,
  onPress,
}: AlgorithmListRowProps) {
  const primaryTag = item.tags[0];
  const tag = primaryTag ? TAG_CONFIG[primaryTag] : undefined;
  return (
    <Pressable
      onPress={() => onPress(item.id)}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${item.label}. ${item.indication}`}
    >
      <View style={styles.rowBody}>
        {tag ? (
          <View style={[styles.tagBadge, { backgroundColor: tag.backgroundColor }]}>
            <Text style={[styles.tagText, { color: tag.textColor }]}>
              {tag.label}
            </Text>
          </View>
        ) : null}
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.indication} numberOfLines={3}>
          {item.indication}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={COLORS.textMuted} />
    </Pressable>
  );
});

function AlgorithmListHeader() {
  return (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderTitle}>Algorithmen</Text>
      <Text style={styles.listHeaderBody}>
        Schrittfolgen mit klarer Einordnung — Tippen öffnet den kompletten Ablauf.
      </Text>
    </View>
  );
}

function AlgorithmListEmpty() {
  return (
    <View style={styles.emptyWrap}>
      <EmptyState when message="Keine Algorithmen im Bundle vorhanden." />
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
    ({ item }: ListRenderItemInfo<Algorithm>) => (
      <AlgorithmListRow item={item} onPress={handlePress} />
    ),
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
          ListEmptyComponent={AlgorithmListEmpty}
          ItemSeparatorComponent={AlgorithmListSeparator}
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
