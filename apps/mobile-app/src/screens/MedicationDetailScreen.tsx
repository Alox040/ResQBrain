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
import type { MedicationStackParamList, RootTabParamList } from '@/navigation/AppNavigator';
import { SPACING } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';
import { labelForContentCategory } from '@/utils/listCategoryFilter';

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
const HEADER_ICON_SIZE = 28;

export function MedicationDetailScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const themed = useMemo(() => createThemedDetailStyles(colors), [colors]);
  const medication = getMedicationById(route.params.medicationId);
  const tabNavigation =
    navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const contentKey = favoriteContentKey(
    'medication',
    medication?.id ?? route.params.medicationId,
  );
  const isFavorite = favoriteIds.includes(contentKey);
  const headerTitle = medication
    ? mapMedicationToViewModel(medication).label
    : 'Medikament';
  const onPressFavorite = useCallback(() => {
    toggleFavorite(contentKey);
  }, [toggleFavorite, contentKey]);

  const headerRight = useCallback(() => {
    if (medication == null) return undefined;
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
  }, [medication, isFavorite, onPressFavorite]);

  const openAlgorithm = useCallback(
    (algorithmId: string) => {
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
    },
    [tabNavigation],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: headerTitle,
      headerRight,
    });
  }, [navigation, headerTitle, headerRight]);

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
  const categoryLabel = labelForContentCategory(medicationVm.category);

  const relatedAlgorithmRows = useMemo(
    () =>
      medicationVm.relatedAlgorithmIds.map((algorithmId, index) => {
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
      }),
    [medicationVm.relatedAlgorithmIds, openAlgorithm],
  );

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <DetailContentHero
          title={medicationVm.label}
          categoryLabel={categoryLabel}
          indication={medicationVm.indication}
        />

        <AccordionPanel title="Dosierung" defaultExpanded={false} style={themed.dosageAccordion}>
          <WarningCard
            title="Anwendung & Dosis"
            body={medicationVm.dosage}
            icon="warning-outline"
            tone="dosage"
            accessibilityRole="text"
          />
        </AccordionPanel>

        <AccordionPanel title="Warnungen" defaultExpanded={false}>
          <DetailBodyText variant="relaxed" style={{ color: colors.textMuted }}>
            Für dieses Medikament sind keine gesonderten Warnhinweise im Bundle
            hinterlegt.
          </DetailBodyText>
        </AccordionPanel>

        <AccordionPanel title="Notizen" defaultExpanded={false}>
          {medicationVm.notes ? (
            <DetailBodyText variant="relaxed">{medicationVm.notes}</DetailBodyText>
          ) : (
            <DetailBodyText variant="relaxed" style={{ color: colors.textMuted }}>
              Keine Notizen hinterlegt.
            </DetailBodyText>
          )}
        </AccordionPanel>

        <AccordionPanel title="Verwandte Algorithmen" defaultExpanded={false}>
          {medicationVm.relatedAlgorithmIds.length > 0 ? (
            <DetailCrossRefList>{relatedAlgorithmRows}</DetailCrossRefList>
          ) : (
            <DetailBodyText variant="relaxed" style={{ color: colors.textMuted }}>
              Keine verknüpften Algorithmen im Bundle.
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

function createThemedDetailStyles(colors: AppPalette) {
  return StyleSheet.create({
    dosageAccordion: {
      borderWidth: 3,
      borderColor: colors.dosagePanelBorder,
      backgroundColor: colors.dosagePanelBg,
    },
  });
}
