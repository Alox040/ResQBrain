import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { AlgorithmStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<AlgorithmStackParamList, 'AlgorithmDetail'>;

export function AlgorithmDetailScreen({ route }: Props) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.label}>Algorithmus</Text>
        <Text style={styles.value}>{route.params.algorithmId}</Text>
      </View>
    </ScrollView>
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
    gap: 10,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#2563eb',
  },
  value: {
    fontSize: 17,
    lineHeight: 25,
    color: '#111827',
  },
});

