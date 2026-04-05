import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {
  AccordionPanel,
  DetailBodyText,
  DetailContentHero,
  DetailCrossRefList,
  DetailLinkRow,
  DetailStepList,
  DetailUnavailableRow,
  EmptyState,
  WarningCard,
} from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import { mapAlgorithmToViewModel } from '@/data/adapters/mapAlgorithmToViewModel';
import { mapMedicationToViewModel } from '@/data/adapters/mapMedicationToViewModel';
import { getAlgorithmById, getMedicationById } from '@/data/contentIndex';
import { favoriteContentKey, useFavoritesStore } from '@/state/favoritesStore';
import { addRecent, recentContentKey } from '@/state/recentStore';
import type { AlgorithmStackParamList, RootTabParamList } from '@/navigation/AppNavigator';
import { SPACING } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';
import { labelForContentCategory } from '@/utils/listCategoryFilter';

type Props = NativeStackScreenProps<AlgorithmStackParamList, 'AlgorithmDetail'>;

const warnedBrokenRelatedMedicationIds = new Set<string>();
const HEADER_HIT = 56;
const HEADER_ICON_SIZE = 28;

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
  const { colors } = useTheme();
  const algorithm = getAlgorithmById(route.params.algorithmId);
  const tabNavigation =
    navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const contentKey = favoriteContentKey(
    'algorithm',
    algorithm?.id ?? route.params.algorithmId,
  );
  const isFavorite = favoriteIds.includes(contentKey);
  const headerTitle = algorithm
    ? mapAlgorithmToViewModel(algorithm).label
    : 'Algorithmus';
  const onPressFavorite = useCallback(() => {
    toggleFavorite(contentKey);
  }, [toggleFavorite, contentKey]);

  const headerRight = useCallback(() => {
    if (algorithm == null) return undefined;
    return (
      <Pressable
        onPress={onPressFavorite}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={
          isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'
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
          size={HEADER_ICON_SIZE}
          color="#fbbf24"
        />
      </Pressable>
    );
  }, [algorithm, isFavorite, onPressFavorite]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: headerTitle,
      headerRight,
    });
  }, [navigation, headerTitle, headerRight]);

  React.useEffect(() => {
    if (algorithm) {
      void addRecent(recentContentKey('algorithm', algorithm.id));
    }
  }, [algorithm?.id]);

  const openMedication = useCallback(
    (medicationId: string) => {
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
      tabNavigation.navigate('MedicationTab', {
        screen: 'MedicationDetail',
        params: { medicationId },
      });
    },
    [tabNavigation],
  );

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

  const algorithmVm = mapAlgorithmToViewModel(algorithm);
  const categoryLabel = labelForContentCategory(algorithmVm.category);

  const relatedMedicationRows = useMemo(
    () =>
      algorithmVm.relatedMedicationIds.map((medicationId, index) => {
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
        const medVm = mapMedicationToViewModel(med);
        return (
          <DetailLinkRow
            key={medicationId}
            contextLabel="Medikament"
            label={medVm.label}
            onPress={() => openMedication(medicationId)}
            accessibilityLabel={`Medikament ${medVm.label} öffnen`}
          />
        );
      }),
    [algorithmVm.relatedMedicationIds, openMedication],
  );

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <DetailContentHero
          title={algorithmVm.label}
          categoryLabel={categoryLabel}
          indication={algorithmVm.indication}
        />

        <AccordionPanel title="Schritte" defaultExpanded={false}>
          <DetailStepList steps={algorithmVm.steps} />
        </AccordionPanel>

        <AccordionPanel title="Warnungen" defaultExpanded={false}>
          {algorithmVm.warnings ? (
            <WarningCard
              title="Warnhinweis"
              body={algorithmVm.warnings}
              prominent
            />
          ) : (
            <DetailBodyText variant="relaxed" style={{ color: colors.textMuted }}>
              Keine Warnhinweise hinterlegt.
            </DetailBodyText>
          )}
        </AccordionPanel>

        <AccordionPanel title="Notizen" defaultExpanded={false}>
          {algorithmVm.notes ? (
            <DetailBodyText variant="relaxed">{algorithmVm.notes}</DetailBodyText>
          ) : (
            <DetailBodyText variant="relaxed" style={{ color: colors.textMuted }}>
              Keine Notizen hinterlegt.
            </DetailBodyText>
          )}
        </AccordionPanel>

        <AccordionPanel title="Verwandte Medikamente" defaultExpanded={false}>
          {algorithmVm.relatedMedicationIds.length > 0 ? (
            <DetailCrossRefList>{relatedMedicationRows}</DetailCrossRefList>
          ) : (
            <DetailBodyText variant="relaxed" style={{ color: colors.textMuted }}>
              Keine verknüpften Medikamente im Bundle.
            </DetailBodyText>
          )}
        </AccordionPanel>
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
