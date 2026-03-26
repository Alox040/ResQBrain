import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { medications } from '@/features/medication/mockData';
import type { MedicationStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<
  MedicationStackParamList,
  'MedicationDetail'
>;

export function MedicationDetailScreen({ route }: Props) {
  const medication = medications.find(
    (item) => item.id === route.params.medicationId,
  );

  if (!medication) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Medikament nicht gefunden</Text>
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
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{medication.name}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Indikation</Text>
        <Text style={styles.value}>{medication.indication}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>DosageText</Text>
        <Text style={styles.value}>{medication.dosageText}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Notes</Text>
        <Text style={styles.value}>{medication.notes}</Text>
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f3f4f6',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
});
