import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import { getAlgorithmById, getMedicationById } from '@/data/contentIndex';
import type { AlgorithmStackParamList, RootTabParamList } from '@/navigation/AppNavigator';
import { CARD, COLORS, SPACING, TYPOGRAPHY } from '@/theme';

type Props = NativeStackScreenProps<AlgorithmStackParamList, 'AlgorithmDetail'>;

const warnedBrokenRelatedMedicationIds = new Set<string>();

function isValidContentId(id: unknown): id is string {
  return typeof id === 'string' && id.trim().length > 0;
}

function warnBrokenRelatedMedicationOnce(
  medicationId: string,
  reason: 'invalid_id' | 'missing_item',
): void {
  if (warnedBrokenRelatedMedicationIds.has(medicationId)) return;
  warnedBrokenRelatedMedicationIds.add(medicationId);
  console.warn(
    `[AlgorithmDetail] Related medication not navigable (${reason}):`,
    medicationId,
  );
}

const LINK_ROW_MIN = 52;
const STEP_BADGE = 36;

export function AlgorithmDetailScreen({ navigation, route }: Props) {
  const algorithm = getAlgorithmById(route.params.algorithmId);
  const tabNavigation =
    navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: algorithm?.label ?? 'Algorithmus' });
  }, [navigation, algorithm?.label]);

  if (!algorithm) {
    return (
      <ScreenContainer>
        <View style={styles.notFound}>
          <EmptyState when message="Algorithmus nicht gefunden oder nicht im Bundle." />
        </View>
      </ScreenContainer>
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
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {algorithm.warnings ? (
          <View style={styles.warningCard} accessibilityRole="alert">
            <View style={styles.warningTitleRow}>
              <Ionicons name="alert-circle" size={22} color="#b45309" />
              <Text style={styles.warningTitle}>Warnhinweis</Text>
            </View>
            <Text style={styles.warningBody}>{algorithm.warnings}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Indikation</Text>
          <Text style={styles.bodyText}>{algorithm.indication}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Schritte</Text>
          <Text style={styles.sectionHint}>
            Nummerierte Reihenfolge — von oben nach unten abarbeiten.
          </Text>
          <View style={styles.steps}>
            {algorithm.steps.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <View
                  style={styles.stepNumberBadge}
                  accessibilityLabel={`Schritt ${index + 1}`}
                >
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
            <Text style={styles.sectionHint}>
              Öffnet das Medikament im gleichen Bundle.
            </Text>
            <View style={styles.crossRefList}>
              {algorithm.relatedMedicationIds.map((medicationId, index) => {
                const idOk = isValidContentId(medicationId);
                const med = idOk ? getMedicationById(medicationId) : undefined;
                if (!idOk) {
                  warnBrokenRelatedMedicationOnce(
                    `#${index}:${String(medicationId)}`,
                    'invalid_id',
                  );
                  return (
                    <View
                      key={`related-med-unavailable-${index}`}
                      style={styles.crossRefUnavailableRow}
                    >
                      <Text style={styles.crossRefUnavailableText}>
                        nicht verfügbar
                      </Text>
                    </View>
                  );
                }
                if (!med) {
                  warnBrokenRelatedMedicationOnce(medicationId, 'missing_item');
                  return (
                    <View
                      key={`related-med-missing-${index}-${medicationId}`}
                      style={styles.crossRefUnavailableRow}
                    >
                      <Text style={styles.crossRefMissingId}>{medicationId}</Text>
                      <Text style={styles.crossRefUnavailableText}>
                        nicht verfügbar
                      </Text>
                    </View>
                  );
                }
                return (
                  <Pressable
                    key={medicationId}
                    onPress={() => openMedication(medicationId)}
                    style={({ pressed }) => [
                      styles.medLink,
                      pressed && styles.medLinkPressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Medikament ${med.label} öffnen`}
                  >
                    <Text style={styles.medLinkText}>{med.label}</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={22}
                      color={COLORS.textMuted}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.screenPaddingBottom,
    gap: SPACING.screenPadding,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 280,
  },
  warningCard: {
    borderRadius: SPACING.radius,
    padding: SPACING.screenPadding,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#f59e0b',
    gap: SPACING.gapSm,
  },
  warningTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#b45309',
  },
  warningBody: {
    ...TYPOGRAPHY.body,
    color: '#78350f',
    flexShrink: 1,
    fontSize: 17,
    lineHeight: 26,
  },
  card: {
    ...CARD.base,
    gap: SPACING.gapMd,
  },
  sectionTitle: {
    ...TYPOGRAPHY.sectionTitle,
  },
  sectionHint: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 14,
    marginTop: -6,
  },
  bodyText: {
    ...TYPOGRAPHY.body,
    flexShrink: 1,
    fontSize: 17,
    lineHeight: 26,
  },
  steps: {
    gap: SPACING.screenPadding,
    marginTop: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.gapMd,
  },
  stepNumberBadge: {
    minWidth: STEP_BADGE,
    height: STEP_BADGE,
    borderRadius: STEP_BADGE / 2,
    backgroundColor: COLORS.primaryMutedBg,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
  },
  stepBody: {
    ...TYPOGRAPHY.body,
    flex: 1,
    flexShrink: 1,
    fontSize: 17,
    lineHeight: 26,
  },
  crossRefList: {
    marginHorizontal: -4,
    marginTop: 4,
  },
  medLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: LINK_ROW_MIN,
    paddingVertical: 14,
    paddingHorizontal: 6,
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
    fontSize: 17,
  },
  crossRefUnavailableRow: {
    paddingVertical: 12,
    paddingHorizontal: 6,
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
});
