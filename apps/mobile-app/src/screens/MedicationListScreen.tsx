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
import { medications } from '@/data/contentIndex';
import type { MedicationStackParamList } from '@/navigation/AppNavigator';
import type { Medication } from '@/types/content';
import { TAG_CONFIG } from '@/utils/tagConfig';
import { CARD, COLORS, SPACING, TYPOGRAPHY } from '@/theme';

type Nav = NativeStackNavigationProp<MedicationStackParamList, 'MedicationList'>;

const medicationListKeyExtractor = (item: Medication): string => item.id;

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

function MedicationListSeparator() {
  return <View style={styles.separator} />;
}

type MedicationListRowProps = {
  item: Medication;
  onPress: (medicationId: string) => void;
};

const MedicationListRow = React.memo(function MedicationListRow({
  item,
  onPress,
}: MedicationListRowProps) {
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

function MedicationListHeader() {
  return (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderTitle}>Medikamentenliste</Text>
      <Text style={styles.listHeaderBody}>
        Tippen für Details zu Dosierung, Hinweisen und verknüpften Algorithmen.
      </Text>
    </View>
  );
}

function MedicationListEmpty() {
  return (
    <View style={styles.emptyWrap}>
      <EmptyState when message="Keine Medikamente im Bundle vorhanden." />
    </View>
  );
}

export function MedicationListScreen() {
  const navigation = useNavigation<Nav>();

  const handlePress = useCallback(
    (medicationId: string) => {
      navigation.navigate('MedicationDetail', { medicationId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Medication>) => (
      <MedicationListRow item={item} onPress={handlePress} />
    ),
    [handlePress],
  );

  return (
    <ScreenContainer>
      <View style={styles.wrap}>
        <FlatList
          style={styles.list}
          data={medications}
          keyExtractor={medicationListKeyExtractor}
          renderItem={renderItem}
          initialNumToRender={FLAT_LIST_INITIAL_NUM_TO_RENDER}
          windowSize={FLAT_LIST_WINDOW_SIZE}
          removeClippedSubviews
          ListHeaderComponent={MedicationListHeader}
          ListEmptyComponent={MedicationListEmpty}
          ItemSeparatorComponent={MedicationListSeparator}
          contentContainerStyle={[
            styles.content,
            medications.length === 0 ? styles.contentEmpty : null,
          ]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenContainer>
  );
}
