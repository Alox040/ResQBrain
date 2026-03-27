import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { getAlgorithmById } from '@/data/contentIndex';
import type { AlgorithmStackParamList } from '@/navigation/AppNavigator';

type Props = NativeStackScreenProps<AlgorithmStackParamList, 'AlgorithmDetail'>;

const ALGORITHM_SOURCES: Record<string, string[]> = {
  reanimation: ['ERC ALS Guidelines (Referenz, statischer Seed)'],
  anaphylaxie: ['S2k-Leitlinie Anaphylaxie (Referenz, statischer Seed)'],
  bradykardie: ['ERC Bradykardie-Abschnitt (Referenz, statischer Seed)'],
  tachykardie: ['ERC Tachykardie-Abschnitt (Referenz, statischer Seed)'],
  acs: ['ESC ACS Guidance (Referenz, statischer Seed)'],
  asthma: ['Nationale Versorgungsleitlinie Asthma (Referenz, statischer Seed)'],
  'copd-exazerbation': ['GOLD Guidance COPD (Referenz, statischer Seed)'],
  krampfanfall: ['DGfE / Notfallstandard Krampfanfall (Referenz, statischer Seed)'],
  hypoglykaemie: ['DDG Hypoglykämie-Standard (Referenz, statischer Seed)'],
  opioidintoxikation: ['BfArM / Naloxon-Hinweise (Referenz, statischer Seed)'],
};

export function AlgorithmDetailScreen({ navigation, route }: Props) {
  const algorithm = getAlgorithmById(route.params.algorithmId);

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: algorithm?.label ?? 'Algorithmus' });
  }, [navigation, algorithm?.label]);

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
        <Text style={styles.sectionTitle}>Title</Text>
        <Text style={styles.value}>{algorithm.label}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Indikation</Text>
        <Text style={styles.value}>{algorithm.indication}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Schritte</Text>
        <View style={styles.steps}>
          {algorithm.steps.map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <Text style={styles.stepLabel}>{index + 1}. Schritt</Text>
              <Text style={styles.value}>{step.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Hinweise</Text>
        {algorithm.warnings ? <Text style={styles.value}>{algorithm.warnings}</Text> : null}
        {algorithm.notes ? <Text style={styles.value}>{algorithm.notes}</Text> : null}
        {!algorithm.warnings && !algorithm.notes ? (
          <Text style={styles.value}>Keine zusätzlichen Hinweise hinterlegt.</Text>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quellen</Text>
        {(ALGORITHM_SOURCES[algorithm.id] ?? ['Keine Quelle hinterlegt.']).map((source) => (
          <Text key={source} style={styles.sourceItem}>
            - {source}
          </Text>
        ))}
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#2563eb',
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
  sourceItem: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
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
