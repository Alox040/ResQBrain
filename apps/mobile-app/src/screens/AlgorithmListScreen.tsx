import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { algorithms } from '@/data/algorithms';
import type { AlgorithmStackParamList } from '@/navigation/AppNavigator';
import { TAG_CONFIG } from '@/utils/tagConfig';

type Nav = NativeStackNavigationProp<AlgorithmStackParamList, 'AlgorithmList'>;

export function AlgorithmListScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <FlatList
      style={styles.screen}
      data={algorithms}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const tag = TAG_CONFIG[item.tags[0]];
        return (
          <Pressable
            onPress={() => navigation.navigate('AlgorithmDetail', { algorithmId: item.id })}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <View style={[styles.tagBadge, { backgroundColor: tag.backgroundColor }]}>
              <Text style={[styles.tagText, { color: tag.textColor }]}>{tag.label}</Text>
            </View>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.indication} numberOfLines={2}>{item.indication}</Text>
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
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  separator: {
    height: 10,
  },
  row: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    color: '#111827',
  },
  indication: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6b7280',
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
