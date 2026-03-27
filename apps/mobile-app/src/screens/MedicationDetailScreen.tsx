import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { algorithmLookup } from '@/data/algorithms';
import { medicationLookup } from '@/data/medications';
import type { MedicationStackParamList, RootTabParamList } from '@/navigation/AppNavigator';
import { TAG_CONFIG } from '@/utils/tagConfig';

type Props = NativeStackScreenProps<MedicationStackParamList, 'MedicationDetail'>;

export function MedicationDetailScreen({ route, navigation }: Props) {
  const medication = medicationLookup[route.params.medicationId];

  if (!medication) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Medikament nicht gefunden.</Text>
      </View>
    );
  }

  const relatedAlgorithms = medication.relatedAlgorithmIds
    .map((id) => algorithmLookup[id])
    .filter((a): a is NonNullable<typeof a> => a != null);

  const tabNav = navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.tagRow}>
          {medication.tags.map((tag) => {
            const cfg = TAG_CONFIG[tag];
            return (
              <View key={tag} style={[styles.tagBadge, { backgroundColor: cfg.backgroundColor }]}>
                <Text style={[styles.tagText, { color: cfg.textColor }]}>{cfg.label}</Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.label}>{medication.label}</Text>
        <Text style={styles.indication}>{medication.indication}</Text>
      </View>

      {/* ── Dosierung ── */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Dosierung</Text>
        <Text style={styles.body}>{medication.dosage}</Text>
      </View>

      {/* ── Applikation ── */}
      {medication.administration ? (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Applikation</Text>
          <Text style={styles.body}>{medication.administration}</Text>
        </View>
      ) : null}

      {/* ── Kontraindikationen ── */}
      {medication.contraindications ? (
        <View style={styles.cautionCard}>
          <Text style={styles.cautionLabel}>Kontraindikationen</Text>
          <Text style={styles.body}>{medication.contraindications}</Text>
        </View>
      ) : null}

      {/* ── Hinweise ── */}
      {medication.notes ? (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Hinweise</Text>
          <Text style={styles.body}>{medication.notes}</Text>
        </View>
      ) : null}

      {/* ── Verwandte Algorithmen ── */}
      {relatedAlgorithms.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Zugehörige Algorithmen</Text>
          <View style={styles.relatedList}>
            {relatedAlgorithms.map((alg) => (
              <Pressable
                key={alg.id}
                onPress={() =>
                  tabNav?.navigate('AlgorithmList', {
                    screen: 'AlgorithmDetail',
                    params: { algorithmId: alg.id },
                  })
                }
                style={({ pressed }) => [
                  styles.relatedRow,
                  pressed && styles.relatedRowPressed,
                ]}
              >
                <View style={styles.relatedRowInner}>
                  <View style={styles.relatedRowText}>
                    <Text style={styles.relatedLabel}>{alg.label}</Text>
                    <Text style={styles.relatedIndication} numberOfLines={1}>
                      {alg.indication}
                    </Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </View>
              </Pressable>
            ))}
          </View>
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
    paddingBottom: 32,
    gap: 10,
  },

  // Not-found state
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  notFoundText: {
    fontSize: 16,
    color: '#6b7280',
  },

  // Header
  header: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  label: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 32,
  },
  indication: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6b7280',
  },

  // Default card
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#2563eb',
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    color: '#111827',
  },

  // Caution card (contraindications)
  cautionCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
    gap: 8,
  },
  cautionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#c2410c',
  },

  // Related items
  relatedList: {
    gap: 8,
  },
  relatedRow: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  relatedRowPressed: {
    backgroundColor: '#eef2ff',
    borderColor: '#c7d2fe',
  },
  relatedRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  relatedRowText: {
    flex: 1,
    gap: 2,
  },
  relatedLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  relatedIndication: {
    fontSize: 13,
    color: '#9ca3af',
  },
  chevron: {
    fontSize: 20,
    color: '#9ca3af',
    lineHeight: 24,
  },
});
