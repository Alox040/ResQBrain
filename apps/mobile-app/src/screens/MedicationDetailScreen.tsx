import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  AccordionPanel,
  ButtonSecondary,
  DetailBodyText,
  DetailContentHero,
  EmptyState,
} from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import {
  loadMedicationDetailViewData,
  type LookupDetailViewData,
} from '@/features/lookup/detailData';
import type { MedicationStackParamList } from '@/navigation/AppNavigator';
import { favoriteContentKey, useFavoritesStore } from '@/state/favoritesStore';
import { addRecent, recentContentKey } from '@/state/recentStore';
import { SPACING } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';

type Props = NativeStackScreenProps<
  MedicationStackParamList,
  'MedicationDetail'
>;

const HEADER_HIT = 56;
const HEADER_ICON_SIZE = 28;

export function MedicationDetailScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const [medication, setMedication] = React.useState<LookupDetailViewData | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
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
    setErrorMessage(null);

    try {
      const detail = await loadMedicationDetailViewData(route.params.medicationId);
      setMedication(detail);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Medikament konnte nicht geladen werden.';
      setMedication(null);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [route.params.medicationId]);

  const headerRight = useCallback(() => {
    if (medication == null) {
      return undefined;
    }

    return (
      <Pressable
        onPress={onPressFavorite}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={
          isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'
        }
        style={styles.headerButton}
      >
        <Ionicons
          name={isFavorite ? 'star' : 'star-outline'}
          size={HEADER_ICON_SIZE}
          color="#fbbf24"
        />
      </Pressable>
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

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.stateWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Medikament wird geladen...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (errorMessage || !medication) {
    return (
      <ScreenContainer>
        <View style={styles.stateWrap}>
          <EmptyState
            when={true}
            message={errorMessage ?? 'Medikament konnte nicht geladen werden.'}
            hint="Pruefe die Lookup-API und den gesetzten Organization-Kontext."
            action={
              <ButtonSecondary
                label="Erneut laden"
                onPress={() => {
                  void loadData();
                }}
              />
            }
          />
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
        <DetailContentHero
          title={medication.title}
          categoryLabel={medication.categoryLabel}
          indication={medication.summary}
        />

        <AccordionPanel title="Zusammenfassung" defaultExpanded={false}>
          <DetailBodyText variant="relaxed">{medication.summary}</DetailBodyText>
        </AccordionPanel>

        <AccordionPanel title="Freigabe" defaultExpanded={false}>
          <DetailBodyText variant="relaxed">
            {`Version: ${medication.versionLabel ?? 'Nicht angegeben'}\nRelease-ID: ${medication.currentReleasedVersionId}\nFreigegeben: ${medication.releasedAtLabel ?? 'Nicht angegeben'}`}
          </DetailBodyText>
        </AccordionPanel>

        <AccordionPanel title="Metadaten" defaultExpanded={false}>
          <DetailBodyText variant="relaxed">
            {`Sichtbarkeit: ${medication.visibility ?? 'Nicht angegeben'}\nScope: ${medication.scope ?? 'Nicht angegeben'}`}
          </DetailBodyText>
        </AccordionPanel>

        <AccordionPanel title="Tags" defaultExpanded={false}>
          {medication.tags.length > 0 ? (
            <DetailBodyText variant="relaxed">
              {medication.tags.join(', ')}
            </DetailBodyText>
          ) : (
            <DetailBodyText variant="relaxed" style={{ color: colors.textMuted }}>
              Keine Tags hinterlegt.
            </DetailBodyText>
          )}
        </AccordionPanel>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 4,
    minWidth: HEADER_HIT,
    minHeight: HEADER_HIT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.screenPaddingBottom + SPACING.gapSm,
    gap: SPACING.detailBlockGap,
  },
  stateWrap: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 300,
    paddingHorizontal: SPACING.screenPadding,
  },
  loadingText: {
    marginTop: SPACING.gapMd,
    textAlign: 'center',
  },
});
