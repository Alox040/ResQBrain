import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { algorithmLookup } from '@/features/lookup';
import type { AlgorithmStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<AlgorithmStackParamList, 'AlgorithmDetail'>;

export function AlgorithmDetailScreen({ route }: Props) {
  const algorithm = algorithmLookup[route.params.algorithmId];

  if (!algorithm) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Algorithmus nicht gefunden</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.label}>Title</Text>
        <Text style={styles.value}>{algorithm.title}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Indikation</Text>
        <Text style={styles.value}>{algorithm.indication}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Steps</Text>
        <View style={styles.steps}>
          {algorithm.steps.map((step, index) => (
            <View key={step.id} style={styles.stepCard}>
              <Text style={styles.stepLabel}>Step {index + 1}</Text>
              <Text style={styles.value}>{step.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {algorithm.notes ? (
        <View style={styles.card}>
          <Text style={styles.label}>Notes</Text>
          <Text style={styles.value}>{algorithm.notes}</Text>
        </View>
      ) : null}

      {algorithm.warnings ? (
        <View style={styles.warningCard}>
          <Text style={styles.warningLabel}>Warnings</Text>
          <Text style={styles.value}>{algorithm.warnings}</Text>
        </View>
      ) : null}
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
    gap: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  warningCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fdba74',
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#2563eb',
  },
  warningLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#c2410c',
  },
  value: {
    fontSize: 16,
    lineHeight: 24,
    color: '#111827',
  },
  steps: {
    gap: 8,
  },
  stepCard: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    gap: 6,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#1d4ed8',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f3f4f6',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
});
