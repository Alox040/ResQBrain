import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { algorithmLookup } from '@/data/algorithms';
import { medicationLookup } from '@/data/medications';
import type { AlgorithmStackParamList, RootTabParamList } from '@/navigation/AppNavigator';
import { TAG_CONFIG } from '@/utils/tagConfig';

type Props = NativeStackScreenProps<AlgorithmStackParamList, 'AlgorithmDetail'>;

export function AlgorithmDetailScreen({ route, navigation }: Props) {
  const algorithm = algorithmLookup[route.params.algorithmId];

  if (!algorithm) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Algorithmus nicht gefunden.</Text>
      </View>
    );
  }

  const relatedMedications = algorithm.relatedMedicationIds
    .map((id) => medicationLookup[id])
    .filter((m): m is NonNullable<typeof m> => m != null);

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
          {algorithm.tags.map((tag) => {
            const cfg = TAG_CONFIG[tag];
            return (
              <View key={tag} style={[styles.tagBadge, { backgroundColor: cfg.backgroundColor }]}>
                <Text style={[styles.tagText, { color: cfg.textColor }]}>{cfg.label}</Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.label}>{algorithm.label}</Text>
        <Text style={styles.indication}>{algorithm.indication}</Text>
      </View>

      {/* ── Schritte ── */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Schritte</Text>
        <View style={styles.stepList}>
          {algorithm.steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Red Flags ── */}
      {algorithm.redFlags ? (
        <View style={styles.redFlagCard}>
          <Text style={styles.redFlagLabel}>Red Flags</Text>
          <Text style={styles.body}>{algorithm.redFlags}</Text>
        </View>
      ) : null}

      {/* ── Hinweise ── */}
      {algorithm.notes ? (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Hinweise</Text>
          <Text style={styles.body}>{algorithm.notes}</Text>
        </View>
      ) : null}

      {/* ── Verwandte Medikamente ── */}
      {relatedMedications.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Zugehörige Medikamente</Text>
          <View style={styles.relatedList}>
            {relatedMedications.map((med) => (
              <Pressable
                key={med.id}
                onPress={() =>
                  tabNav?.navigate('MedicationList', {
                    screen: 'MedicationDetail',
                    params: { medicationId: med.id },
                  })
                }
                style={({ pressed }) => [
                  styles.relatedRow,
                  pressed && styles.relatedRowPressed,
                ]}
              >
                <View style={styles.relatedRowInner}>
                  <View style={styles.relatedRowText}>
                    <Text style={styles.relatedLabel}>{med.label}</Text>
                    <Text style={styles.relatedIndication} numberOfLines={1}>
                      {med.indication}
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

  // Step list
  stepList: {
    gap: 10,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 23,
    color: '#111827',
  },

  // Red flag card
  redFlagCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
    gap: 8,
  },
  redFlagLabel: {
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
