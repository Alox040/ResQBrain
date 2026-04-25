import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { FeedbackSheet } from '@/features/feedback';
import {
  loadMedicationDetailViewData,
  type LookupDetailViewData,
} from '@/features/lookup/detailData';
import { toLookupUiErrorState } from '@/lookup/lookupErrors';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import { favoriteContentKey, useFavoritesStore } from '@/state/favoritesStore';
import { addRecent, recentContentKey } from '@/state/recentStore';
import { MedicationDetailHeaderActions } from '@/ui/components/MedicationDetailHeaderActions';
import MedicationDetailScreenUI from '@/ui/screens/MedicationDetailScreenUI';

type Props = NativeStackScreenProps<RootStackParamList, 'MedicationDetail'>;
const EMPTY_SECTIONS = Object.freeze([]);

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

  const handleOpenFeedback = useCallback(() => {
    setFeedbackVisible(true);
  }, []);

  const handleCloseFeedback = useCallback(() => {
    setFeedbackVisible(false);
  }, []);

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
        onOpenFeedback={handleOpenFeedback}
        onToggleFavorite={onPressFavorite}
      />
    );
  }, [handleOpenFeedback, isFavorite, medication, onPressFavorite]);

  const handleRetry = useCallback(() => {
    void loadData();
  }, [loadData]);

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
        sections={medication?.sections ?? EMPTY_SECTIONS}
        isLoading={isLoading}
        error={errorState}
        onRetry={handleRetry}
      />
      {medication ? (
        <FeedbackSheet
          visible={feedbackVisible}
          bundleId={medication.versionLabel}
          contextNote={`Medikament | ${medication.id} | ${medication.title}`}
          onClose={handleCloseFeedback}
        />
      ) : null}
    </>
  );
}
