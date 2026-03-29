import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getAlgorithmById, getMedicationById } from '@/data/contentIndex';
import type { AlgorithmStackParamList, RootTabParamList } from '@/navigation/AppNavigator';
import { CARD, COLORS, SPACING, TYPOGRAPHY } from '@/ui/theme';

type Props = NativeStackScreenProps<AlgorithmStackParamList, 'AlgorithmDetail'>;

const warnedBrokenRelatedMedicationIds = new Set<string>();

function isValidContentId(id: unknown): id is string {
  return typeof id === 'string' && id.trim().length > 0;
}

function warnBrokenRelatedMedicationOnce(medicationId: string, reason: 'invalid_id' | 'missing_item'): void {
  if (warnedBrokenRelatedMedicationIds.has(medicationId)) return;
  warnedBrokenRelatedMedicationIds.add(medicationId);
  console.warn(`[AlgorithmDetail] Related medication not navigable (${reason}):`, medicationId);
}

export function AlgorithmDetailScreen({ navigation, route }: Props) {
  const algorithm = getAlgorithmById(route.params.algorithmId);
  const tabNavigation = navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();

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

  const openMedication = (medicationId: string) => {
    if (!isValidContentId(medicationId)) {
      console.warn('[AlgorithmDetail] openMedication: invalid or empty id', medicationId);
      return;
    }
    const target = getMedicationById(medicationId);
    if (!target) {
      console.warn('[AlgorithmDetail] openMedication: no item for id', medicationId);
      return;
    }
    if (!tabNavigation) {
      console.warn('[AlgorithmDetail] openMedication: tab navigation unavailable');
      return;
    }
    tabNavigation.navigate('MedicationList', {
      screen: 'MedicationDetail',
      params: { medicationId },
    });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {algorithm.warnings ? (
        <View style={styles.warningCard} accessibilityRole="alert">
          <Text style={styles.warningTitle}>Warnhinweis</Text>
          <Text style={styles.warningBody}>{algorithm.warnings}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Indikation</Text>
        <Text style={styles.bodyText}>{algorithm.indication}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Schritte</Text>
        <View style={styles.steps}>
          {algorithm.steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumberBadge} accessibilityLabel={`Schritt ${index + 1}`}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepBody}>{step.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {algorithm.notes ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notizen</Text>
          <Text style={styles.bodyText}>{algorithm.notes}</Text>
        </View>
      ) : null}

      {algorithm.relatedMedicationIds.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Verwandte Medikamente</Text>
          <View style={styles.crossRefList}>
            {algorithm.relatedMedicationIds.map((medicationId, index) => {
              const idOk = isValidContentId(medicationId);
              const med = idOk ? getMedicationById(medicationId) : undefined;
              if (!idOk) {
                warnBrokenRelatedMedicationOnce(`#${index}:${String(medicationId)}`, 'invalid_id');
                return (
                  <View key={`related-med-unavailable-${index}`} style={styles.crossRefUnavailableRow}>
                    <Text style={styles.crossRefUnavailableText}>nicht verfügbar</Text>
                  </View>
                );
              }
              if (!med) {
                warnBrokenRelatedMedicationOnce(medicationId, 'missing_item');
                return (
                  <View key={`related-med-missing-${index}-${medicationId}`} style={styles.crossRefUnavailableRow}>
                    <Text style={styles.crossRefMissingId}>{medicationId}</Text>
                    <Text style={styles.crossRefUnavailableText}>nicht verfügbar</Text>
                  </View>
                );
              }
              return (
                <Pressable
                  key={medicationId}
                  onPress={() => openMedication(medicationId)}
                  style={({ pressed }) => [styles.medLink, pressed && styles.medLinkPressed]}
                  accessibilityRole="button"
                  accessibilityLabel={`Medikament ${med.label} öffnen`}
                >
                  <Text style={styles.medLinkText}>{med.label}</Text>
                  <Text style={styles.medLinkChevron}>›</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
    </ScrollView>
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
    gap: SPACING.gapMd,
  },
  warningCard: {
    borderRadius: SPACING.radius,
    padding: SPACING.screenPadding,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#f59e0b',
    gap: 8,
  },
  warningTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#b45309',
  },
  warningBody: {
    ...TYPOGRAPHY.body,
    color: '#78350f',
    flexShrink: 1,
  },
  card: {
    ...CARD.base,
    gap: 8,
  },
  sectionTitle: {
    ...TYPOGRAPHY.sectionTitle,
  },
  bodyText: {
    ...TYPOGRAPHY.body,
    flexShrink: 1,
  },
  steps: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumberBadge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryMutedBg,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  stepBody: {
    ...TYPOGRAPHY.body,
    flex: 1,
    flexShrink: 1,
  },
  crossRefList: {
    marginHorizontal: -4,
  },
  medLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  medLinkPressed: {
    backgroundColor: COLORS.primaryMutedBg,
  },
  medLinkText: {
    ...TYPOGRAPHY.body,
    flex: 1,
    flexShrink: 1,
    color: COLORS.primary,
    fontWeight: '600',
  },
  medLinkChevron: {
    fontSize: 20,
    color: COLORS.textMuted,
    flexShrink: 0,
  },
  crossRefUnavailableRow: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 4,
  },
  crossRefMissingId: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 13,
  },
  crossRefUnavailableText: {
    ...TYPOGRAPHY.bodyMuted,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.bg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
});
