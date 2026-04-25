import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { FeedbackSheet } from '@/features/feedback';
import {
  loadMedicationDetailViewData,
  type LookupDetailViewData,
} from '@/features/lookup/detailData';
import { toLookupUiErrorState } from '@/lookup/lookupErrors';
import type { MedicationStackParamList } from '@/navigation/AppNavigator';
import { favoriteContentKey, useFavoritesStore } from '@/state/favoritesStore';
import { addRecent, recentContentKey } from '@/state/recentStore';
import { MedicationDetailHeaderActions } from '@/ui/components/MedicationDetailHeaderActions';
import MedicationDetailScreenUI, {
  type MedicationDetailSection,
} from '@/ui/screens/MedicationDetailScreenUI';

type Props = NativeStackScreenProps<
  MedicationStackParamList,
  'MedicationDetail'
>;

function buildSections(medication: LookupDetailViewData): MedicationDetailSection[] {
  return [
    {
      title: 'Zusammenfassung',
      content: medication.summary,
      defaultExpanded: true,
    },
    {
      title: 'Quelle',
      content: 'Freigegebener Referenzeintrag ohne operative Anleitung.',
      defaultExpanded: true,
    },
    {
      title: 'Tags',
      content:
        medication.tags.length > 0
          ? medication.tags.join(', ')
          : 'Keine Tags hinterlegt.',
      defaultExpanded: false,
      muted: medication.tags.length === 0,
    },
  ];
}

export function MedicationDetailScreen({ navigation, route }: Props) {
  const [medication, setMedication] = React.useState<LookupDetailViewData | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorState, setErrorState] = React.useState<{
    message: string;
    hint: string;
  } | null>(null);
  const [feedbackVisible, setFeedbackVisible] = React.useState(false);
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const contentKey = favoriteContentKey(
    'medication',
    medication?.id ?? route.params.medicationId,
  );
  const isFavorite = favoriteIds.includes(contentKey);
  const headerTitle = medication?.title ?? 'Medikament';

  const onPressFavorite = useCallback(() => {
    toggleFavorite(contentKey);
  }, [contentKey, toggleFavorite]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorState(null);

    try {
      const detail = await loadMedicationDetailViewData(route.params.medicationId);
      setMedication(detail);
    } catch (error) {
      setMedication(null);
      setErrorState(toLookupUiErrorState(error));
    } finally {
      setIsLoading(false);
    }
  }, [route.params.medicationId]);

  const headerRight = useCallback(() => {
    if (medication == null) {
      return undefined;
    }

    return (
      <MedicationDetailHeaderActions
        isFavorite={isFavorite}
        onOpenFeedback={() => {
          setFeedbackVisible(true);
        }}
        onToggleFavorite={onPressFavorite}
      />
    );
  }, [isFavorite, medication, onPressFavorite]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: headerTitle,
      headerRight,
    });
  }, [headerRight, headerTitle, navigation]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  React.useEffect(() => {
    if (medication) {
      void addRecent(recentContentKey('medication', medication.id));
    }
  }, [medication]);

  return (
    <>
      <MedicationDetailScreenUI
        title={medication?.title ?? 'Medikament'}
        description={medication?.heroIndication ?? ''}
        categoryLabel={medication?.categoryLabel ?? null}
        sections={medication ? buildSections(medication) : []}
        isLoading={isLoading}
        error={errorState}
        onRetry={() => {
          void loadData();
        }}
      />
      {medication ? (
        <FeedbackSheet
          visible={feedbackVisible}
          bundleId={medication.versionLabel}
          contextNote={`Medikament | ${medication.id} | ${medication.title}`}
          onClose={() => {
            setFeedbackVisible(false);
          }}
        />
      ) : null}
    </>
  );
}
