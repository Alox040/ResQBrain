import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {
  DetailBodyText,
  DetailCrossRefList,
  DetailLinkRow,
  DetailSectionCard,
  DetailStepList,
  DetailUnavailableRow,
  EmptyState,
  WarningCard,
} from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import { getAlgorithmById, getMedicationById } from '@/data/contentIndex';
import { useFavoriteToggle } from '@/features/favorites/favoritesStore';
import { recordHistoryOpen } from '@/features/history/historyStore';
import type { AlgorithmStackParamList, RootTabParamList } from '@/navigation/AppNavigator';
import { SPACING } from '@/theme';

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

export function AlgorithmDetailScreen({ navigation, route }: Props) {
  const algorithm = getAlgorithmById(route.params.algorithmId);
  const tabNavigation =
    navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();
  const { isFavorite, toggleFavorite: toggleFavoriteItem } = useFavoriteToggle(
    algorithm?.id ?? route.params.algorithmId,
    'algorithm',
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: algorithm?.label ?? 'Algorithmus',
      headerRight:
        algorithm != null
          ? () => (
              <Pressable
                onPress={() => void toggleFavoriteItem()}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={
                  isFavorite
                    ? 'Aus Favoriten entfernen'
                    : 'Zu Favoriten hinzufügen'
                }
                style={{ marginRight: 4 }}
              >
                <Ionicons
                  name={isFavorite ? 'star' : 'star-outline'}
                  size={24}
                  color="#fbbf24"
                />
              </Pressable>
            )
          : undefined,
    });
  }, [navigation, algorithm, isFavorite, toggleFavoriteItem]);

  React.useEffect(() => {
    if (algorithm) {
      void recordHistoryOpen(algorithm.id, 'algorithm');
    }
  }, [algorithm?.id]);

  if (!algorithm) {
    return (
      <ScreenContainer>
        <View style={styles.notFound}>
          <EmptyState
            when={true}
            message="Algorithmus nicht gefunden oder nicht im Bundle."
            hint="Über die Tab-Leiste zur Suche oder Algorithmenliste wechseln — der Eintrag ist mit dieser ID nicht im lokalen Bundle."
          />
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
          <WarningCard
            title="Warnhinweis"
            body={algorithm.warnings}
            prominent
          />
        ) : null}

        <DetailSectionCard title="Indikation">
          <DetailBodyText variant="relaxed">{algorithm.indication}</DetailBodyText>
        </DetailSectionCard>

        <DetailSectionCard
          title="Schritte"
          hint="Reihenfolge einhalten — jeder Block ist ein Arbeitsschritt."
        >
          <DetailStepList steps={algorithm.steps} />
        </DetailSectionCard>

        {algorithm.notes ? (
          <DetailSectionCard
            title="Notizen"
            hint="Zusatz zum Ablauf — unterhalb der Schritte einordnen."
            tone="soft"
          >
            <DetailBodyText variant="relaxed">{algorithm.notes}</DetailBodyText>
          </DetailSectionCard>
        ) : null}

        {algorithm.relatedMedicationIds.length > 0 ? (
          <DetailSectionCard
            title="Verwandte Medikamente"
            hint="Öffnet Dosierung und Hinweise im gleichen Bundle."
          >
            <DetailCrossRefList>
              {algorithm.relatedMedicationIds.map((medicationId, index) => {
                const idOk = isValidContentId(medicationId);
                const med = idOk ? getMedicationById(medicationId) : undefined;
                if (!idOk) {
                  warnBrokenRelatedMedicationOnce(
                    `#${index}:${String(medicationId)}`,
                    'invalid_id',
                  );
                  return (
                    <DetailUnavailableRow
                      key={`related-med-unavailable-${index}`}
                      message="Eintrag nicht verfügbar"
                      detailLine="Ungültige Referenz"
                    />
                  );
                }
                if (!med) {
                  warnBrokenRelatedMedicationOnce(medicationId, 'missing_item');
                  return (
                    <DetailUnavailableRow
                      key={`related-med-missing-${index}-${medicationId}`}
                      message="Eintrag nicht verfügbar"
                      detailLine={medicationId}
                    />
                  );
                }
                return (
                  <DetailLinkRow
                    key={medicationId}
                    contextLabel="Medikament"
                    label={med.label}
                    onPress={() => openMedication(medicationId)}
                    accessibilityLabel={`Medikament ${med.label} öffnen`}
                  />
                );
              })}
            </DetailCrossRefList>
          </DetailSectionCard>
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
    paddingBottom: SPACING.screenPaddingBottom + SPACING.gapSm,
    gap: SPACING.detailBlockGap,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 300,
    paddingHorizontal: SPACING.screenPadding,
  },
});
