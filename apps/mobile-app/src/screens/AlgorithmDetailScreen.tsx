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
  loadAlgorithmDetailViewData,
  type LookupDetailViewData,
} from '@/features/lookup/detailData';
import type { AlgorithmStackParamList } from '@/navigation/AppNavigator';
import { favoriteContentKey, useFavoritesStore } from '@/state/favoritesStore';
import { addRecent, recentContentKey } from '@/state/recentStore';
import { SPACING } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';

type Props = NativeStackScreenProps<AlgorithmStackParamList, 'AlgorithmDetail'>;

const HEADER_HIT = 56;
const HEADER_ICON_SIZE = 28;

export function AlgorithmDetailScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const [algorithm, setAlgorithm] = React.useState<LookupDetailViewData | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const contentKey = favoriteContentKey(
    'algorithm',
    algorithm?.id ?? route.params.algorithmId,
  );
  const isFavorite = favoriteIds.includes(contentKey);
  const headerTitle = algorithm?.title ?? 'Algorithmus';

  const onPressFavorite = useCallback(() => {
    toggleFavorite(contentKey);
  }, [contentKey, toggleFavorite]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const detail = await loadAlgorithmDetailViewData(route.params.algorithmId);
      setAlgorithm(detail);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Algorithmus konnte nicht geladen werden.';
      setAlgorithm(null);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [route.params.algorithmId]);

  const headerRight = useCallback(() => {
    if (algorithm == null) {
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
  }, [algorithm, isFavorite, onPressFavorite]);

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
    if (algorithm) {
      void addRecent(recentContentKey('algorithm', algorithm.id));
    }
  }, [algorithm]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.stateWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Algorithmus wird geladen...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (errorMessage || !algorithm) {
    return (
      <ScreenContainer>
        <View style={styles.stateWrap}>
          <EmptyState
            when={true}
            message={errorMessage ?? 'Algorithmus konnte nicht geladen werden.'}
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
          title={algorithm.title}
          categoryLabel={algorithm.categoryLabel}
          indication={algorithm.summary}
        />

        <AccordionPanel title="Zusammenfassung" defaultExpanded={false}>
          <DetailBodyText variant="relaxed">{algorithm.summary}</DetailBodyText>
        </AccordionPanel>

        <AccordionPanel title="Freigabe" defaultExpanded={false}>
          <DetailBodyText variant="relaxed">
            {`Version: ${algorithm.versionLabel ?? 'Nicht angegeben'}\nRelease-ID: ${algorithm.currentReleasedVersionId}\nFreigegeben: ${algorithm.releasedAtLabel ?? 'Nicht angegeben'}`}
          </DetailBodyText>
        </AccordionPanel>

        <AccordionPanel title="Metadaten" defaultExpanded={false}>
          <DetailBodyText variant="relaxed">
            {`Sichtbarkeit: ${algorithm.visibility ?? 'Nicht angegeben'}\nScope: ${algorithm.scope ?? 'Nicht angegeben'}`}
          </DetailBodyText>
        </AccordionPanel>

        <AccordionPanel title="Tags" defaultExpanded={false}>
          {algorithm.tags.length > 0 ? (
            <DetailBodyText variant="relaxed">
              {algorithm.tags.join(', ')}
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
