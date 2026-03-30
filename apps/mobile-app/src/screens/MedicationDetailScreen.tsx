import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import { getAlgorithmById, getMedicationById } from '@/data/contentIndex';
import type { MedicationStackParamList, RootTabParamList } from '@/navigation/AppNavigator';
import { CARD, COLORS, SPACING, TYPOGRAPHY } from '@/theme';

type Props = NativeStackScreenProps<
  MedicationStackParamList,
  'MedicationDetail'
>;

const warnedBrokenRelatedAlgorithmIds = new Set<string>();

function isValidContentId(id: unknown): id is string {
  return typeof id === 'string' && id.trim().length > 0;
}

function warnBrokenRelatedAlgorithmOnce(
  algorithmId: string,
  reason: 'invalid_id' | 'missing_item',
): void {
  if (warnedBrokenRelatedAlgorithmIds.has(algorithmId)) return;
  warnedBrokenRelatedAlgorithmIds.add(algorithmId);
  console.warn(
    `[MedicationDetail] Related algorithm not navigable (${reason}):`,
    algorithmId,
  );
}

const LINK_ROW_MIN = 52;

export function MedicationDetailScreen({ navigation, route }: Props) {
  const medication = getMedicationById(route.params.medicationId);
  const tabNavigation =
    navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();

  const openAlgorithm = (algorithmId: string) => {
    if (!isValidContentId(algorithmId)) {
      console.warn('[MedicationDetail] openAlgorithm: invalid or empty id', algorithmId);
      return;
    }
    const target = getAlgorithmById(algorithmId);
    if (!target) {
      console.warn('[MedicationDetail] openAlgorithm: no item for id', algorithmId);
      return;
    }
    if (!tabNavigation) {
      console.warn('[MedicationDetail] openAlgorithm: tab navigation unavailable');
      return;
    }
    tabNavigation.navigate('AlgorithmList', {
      screen: 'AlgorithmDetail',
      params: { algorithmId },
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: medication?.label ?? 'Medikament' });
  }, [navigation, medication?.label]);

  if (!medication) {
    return (
      <ScreenContainer>
        <View style={styles.notFound}>
          <EmptyState when message="Medikament nicht gefunden oder nicht im Bundle." />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Indikation</Text>
          <Text style={styles.bodyText}>{medication.indication}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Dosierung</Text>
          <View style={styles.dosageWarningBox} accessibilityRole="text">
            <View style={styles.dosageTitleRow}>
              <Ionicons name="warning-outline" size={18} color="#b45309" />
              <Text style={styles.dosageLabel}>Anwendung & Dosis</Text>
            </View>
            <Text style={styles.dosageText}>{medication.dosage}</Text>
          </View>
        </View>

        {medication.notes ? (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Notizen</Text>
            <Text style={styles.bodyText}>{medication.notes}</Text>
          </View>
        ) : null}

        {medication.relatedAlgorithmIds.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Verwandte Algorithmen</Text>
            <Text style={styles.sectionHint}>
              Direkt zur passenden Schrittfolge springen.
            </Text>
            <View style={styles.crossRefList}>
              {medication.relatedAlgorithmIds.map((algorithmId, index) => {
                const idOk = isValidContentId(algorithmId);
                const alg = idOk ? getAlgorithmById(algorithmId) : undefined;
                if (!idOk) {
                  warnBrokenRelatedAlgorithmOnce(
                    `#${index}:${String(algorithmId)}`,
                    'invalid_id',
                  );
                  return (
                    <View
                      key={`related-alg-unavailable-${index}`}
                      style={styles.crossRefUnavailableRow}
                    >
                      <Text style={styles.crossRefUnavailableText}>
                        nicht verfügbar
                      </Text>
                    </View>
                  );
                }
                if (!alg) {
                  warnBrokenRelatedAlgorithmOnce(algorithmId, 'missing_item');
                  return (
                    <View
                      key={`related-alg-missing-${index}-${algorithmId}`}
                      style={styles.crossRefUnavailableRow}
                    >
                      <Text style={styles.crossRefMissingId}>{algorithmId}</Text>
                      <Text style={styles.crossRefUnavailableText}>
                        nicht verfügbar
                      </Text>
                    </View>
                  );
                }
                return (
                  <Pressable
                    key={algorithmId}
                    onPress={() => openAlgorithm(algorithmId)}
                    style={({ pressed }) => [
                      styles.crossRefRow,
                      pressed && styles.crossRefRowPressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Algorithmus ${alg.label} öffnen`}
                  >
                    <Text style={styles.crossRefLabel}>{alg.label}</Text>
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
  card: {
    ...CARD.base,
    gap: SPACING.gapMd,
  },
  sectionLabel: {
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
  dosageWarningBox: {
    borderRadius: SPACING.radiusSm,
    paddingVertical: SPACING.screenPadding,
    paddingHorizontal: SPACING.screenPadding,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#f59e0b',
    gap: SPACING.gapSm,
  },
  dosageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dosageLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#b45309',
  },
  dosageText: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: '#78350f',
    flexShrink: 1,
  },
  crossRefList: {
    marginHorizontal: -4,
    marginTop: 4,
  },
  crossRefRow: {
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
  crossRefRowPressed: {
    backgroundColor: COLORS.primaryMutedBg,
  },
  crossRefLabel: {
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
