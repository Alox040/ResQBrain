import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { algorithms } from '@/data/contentIndex';
import type { AlgorithmStackParamList } from '@/navigation/AppNavigator';
import { TAG_CONFIG } from '@/utils/tagConfig';
import { CARD, COLORS, SPACING } from '@/ui/theme';

type Nav = NativeStackNavigationProp<AlgorithmStackParamList, 'AlgorithmList'>;

export function AlgorithmListScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <FlatList
      style={styles.screen}
      data={algorithms}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const primaryTag = item.tags[0];
        const tag = primaryTag ? TAG_CONFIG[primaryTag] : undefined;
        return (
          <Pressable
            onPress={() => navigation.navigate('AlgorithmDetail', { algorithmId: item.id })}
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
      }}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Keine Algorithmen vorhanden.</Text>
        </View>
      }
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
    />
  );
}

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
