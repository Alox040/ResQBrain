import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { FlatList, type ListRenderItemInfo, Pressable, StyleSheet, Text, View } from 'react-native';
import { medications } from '@/data/contentIndex';
import type { MedicationStackParamList } from '@/navigation/AppNavigator';
import type { Medication } from '@/types/content';
import { TAG_CONFIG } from '@/utils/tagConfig';
import { CARD, COLORS, SPACING } from '@/ui/theme';

type Nav = NativeStackNavigationProp<MedicationStackParamList, 'MedicationList'>;

const medicationListKeyExtractor = (item: Medication): string => item.id;

const FLAT_LIST_INITIAL_NUM_TO_RENDER = 14;
const FLAT_LIST_WINDOW_SIZE = 7;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.screenPaddingBottom,
  },
  separator: {
    height: 10,
  },
  row: {
    ...CARD.base,
    paddingVertical: 14,
    gap: 6,
  },
  rowPressed: {
    backgroundColor: '#eef2ff',
    borderColor: '#c7d2fe',
  },
  tagBadge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  label: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.text,
  },
  indication: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textMuted,
  },
  empty: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#9ca3af',
  },
});

function MedicationListSeparator() {
  return <View style={styles.separator} />;
}

function MedicationListEmpty() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>Keine Medikamente vorhanden.</Text>
    </View>
  );
}

type MedicationListRowProps = {
  item: Medication;
  onPress: (medicationId: string) => void;
};

const MedicationListRow = React.memo(function MedicationListRow({ item, onPress }: MedicationListRowProps) {
  const primaryTag = item.tags[0];
  const tag = primaryTag ? TAG_CONFIG[primaryTag] : undefined;
  return (
    <Pressable
      onPress={() => onPress(item.id)}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${item.label}. ${item.indication}`}
    >
      {tag ? (
        <View style={[styles.tagBadge, { backgroundColor: tag.backgroundColor }]}>
          <Text style={[styles.tagText, { color: tag.textColor }]}>{tag.label}</Text>
        </View>
      ) : null}
      <Text style={styles.label}>{item.label}</Text>
      <Text style={styles.indication} numberOfLines={3}>
        {item.indication}
      </Text>
    </Pressable>
  );
});

export function MedicationListScreen() {
  const navigation = useNavigation<Nav>();

  const handlePress = useCallback(
    (medicationId: string) => {
      navigation.navigate('MedicationDetail', { medicationId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Medication>) => <MedicationListRow item={item} onPress={handlePress} />,
    [handlePress],
  );

  return (
    <FlatList
      style={styles.screen}
      data={medications}
      keyExtractor={medicationListKeyExtractor}
      renderItem={renderItem}
      initialNumToRender={FLAT_LIST_INITIAL_NUM_TO_RENDER}
      windowSize={FLAT_LIST_WINDOW_SIZE}
      removeClippedSubviews
      ListEmptyComponent={MedicationListEmpty}
      ItemSeparatorComponent={MedicationListSeparator}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    />
  );
}
