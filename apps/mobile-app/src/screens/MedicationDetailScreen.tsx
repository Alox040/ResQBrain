import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {
  DetailBodyText,
  DetailCrossRefList,
  DetailLinkRow,
  DetailSectionCard,
  DetailUnavailableRow,
  EmptyState,
  WarningCard,
} from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import { mapAlgorithmToViewModel } from '@/data/adapters/mapAlgorithmToViewModel';
import { mapMedicationToViewModel } from '@/data/adapters/mapMedicationToViewModel';
import { getAlgorithmById, getMedicationById } from '@/data/contentIndex';
import { useFavoriteToggle } from '@/state/favoritesStore';
import { addRecent, recentContentKey } from '@/state/recentStore';
import type { MedicationStackParamList, RootTabParamList } from '@/navigation/AppNavigator';
import { SPACING } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

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

const HEADER_HIT = 56;

export function MedicationDetailScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const themed = useMemo(() => createThemedDetailStyles(colors), [colors]);
  const medication = getMedicationById(route.params.medicationId);
  const tabNavigation =
    navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();
  const { isFavorite, toggleFavorite: toggleFavoriteItem } = useFavoriteToggle(
    medication?.id ?? route.params.medicationId,
    'medication',
  );
  const headerTitle = medication
    ? mapMedicationToViewModel(medication).label
    : 'Medikament';
  const onPressFavorite = useCallback(() => {
    void toggleFavoriteItem();
  }, [toggleFavoriteItem]);

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
    tabNavigation.navigate('AlgorithmTab', {
      screen: 'AlgorithmDetail',
      params: { algorithmId },
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: headerTitle,
      headerRight:
        medication != null
          ? () => (
              <Pressable
                onPress={onPressFavorite}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={
                  isFavorite
                    ? 'Aus Favoriten entfernen'
                    : 'Zu Favoriten hinzufügen'
                }
                style={{
                  marginRight: 4,
                  minWidth: HEADER_HIT,
                  minHeight: HEADER_HIT,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  name={isFavorite ? 'star' : 'star-outline'}
                  size={26}
                  color="#fbbf24"
                />
              </Pressable>
            )
          : undefined,
    });
  }, [navigation, headerTitle, medication?.id, isFavorite, onPressFavorite]);

  React.useEffect(() => {
    if (medication) {
      void addRecent(recentContentKey('medication', medication.id));
    }
  }, [medication?.id]);

  if (!medication) {
    return (
      <ScreenContainer>
        <View style={styles.notFound}>
          <EmptyState
            when={true}
            message="Medikament nicht gefunden oder nicht im Bundle."
            hint="Über die Tab-Leiste zur Suche oder Medikamentenliste wechseln — der Eintrag ist mit dieser ID nicht im lokalen Bundle."
          />
        </View>
      </ScreenContainer>
    );
  }

  const medicationVm = mapMedicationToViewModel(medication);

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <DetailSectionCard title="Indikation">
          <DetailBodyText variant="relaxed">
            {medicationVm.indication}
          </DetailBodyText>
        </DetailSectionCard>

        <DetailSectionCard title="Dosierung" style={themed.dosageSection}>
          <WarningCard
            title="Anwendung & Dosis"
            body={medicationVm.dosage}
            icon="warning-outline"
            tone="dosage"
            accessibilityRole="text"
          />
        </DetailSectionCard>

        {medicationVm.notes ? (
          <DetailSectionCard
            title="Notizen"
            hint="Ergänzende Hinweise — nach Dosierung und Indikation einordnen."
            tone="soft"
          >
            <DetailBodyText variant="relaxed">{medicationVm.notes}</DetailBodyText>
          </DetailSectionCard>
        ) : null}

        {medicationVm.relatedAlgorithmIds.length > 0 ? (
          <DetailSectionCard
            title="Verwandte Algorithmen"
            hint="Öffnet die Schrittfolge im gleichen Bundle."
          >
            <DetailCrossRefList>
              {medicationVm.relatedAlgorithmIds.map((algorithmId, index) => {
                const idOk = isValidContentId(algorithmId);
                const alg = idOk ? getAlgorithmById(algorithmId) : undefined;
                if (!idOk) {
                  warnBrokenRelatedAlgorithmOnce(
                    `#${index}:${String(algorithmId)}`,
                    'invalid_id',
                  );
                  return (
                    <DetailUnavailableRow
                      key={`related-alg-unavailable-${index}`}
                      message="Eintrag nicht verfügbar"
                      detailLine="Ungültige Referenz"
                    />
                  );
                }
                if (!alg) {
                  warnBrokenRelatedAlgorithmOnce(algorithmId, 'missing_item');
                  return (
                    <DetailUnavailableRow
                      key={`related-alg-missing-${index}-${algorithmId}`}
                      message="Eintrag nicht verfügbar"
                      detailLine={algorithmId}
                    />
                  );
                }
                const algVm = mapAlgorithmToViewModel(alg);
                return (
                  <DetailLinkRow
                    key={algorithmId}
                    contextLabel="Algorithmus"
                    label={algVm.label}
                    onPress={() => openAlgorithm(algorithmId)}
                    accessibilityLabel={`Algorithmus ${algVm.label} öffnen`}
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

function createThemedDetailStyles(colors: AppPalette) {
  return StyleSheet.create({
    dosageSection: {
      borderWidth: 3,
      borderColor: colors.dosagePanelBorder,
      backgroundColor: colors.dosagePanelBg,
    },
  });
}
