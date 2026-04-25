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
import { FeedbackSheet } from '@/features/feedback';
import {
  loadAlgorithmDetailViewData,
  type LookupDetailViewData,
} from '@/features/lookup/detailData';
import { toLookupUiErrorState } from '@/lookup/lookupErrors';
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
  const [errorState, setErrorState] = React.useState<{
    message: string;
    hint: string;
  } | null>(null);
  const [feedbackVisible, setFeedbackVisible] = React.useState(false);
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
    setErrorState(null);

    try {
      const detail = await loadAlgorithmDetailViewData(route.params.algorithmId);
      setAlgorithm(detail);
    } catch (error) {
      setAlgorithm(null);
      setErrorState(toLookupUiErrorState(error));
    } finally {
      setIsLoading(false);
    }
  }, [route.params.algorithmId]);

  const headerRight = useCallback(() => {
    if (algorithm == null) {
      return undefined;
    }

    return (
      <View style={styles.headerActionsRow}>
        <Pressable
          onPress={() => {
            setFeedbackVisible(true);
          }}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Feedback zu diesem Algorithmus senden"
          style={styles.headerButton}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color={colors.navHeaderText}
          />
        </Pressable>
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
      </View>
    );
  }, [algorithm, colors.navHeaderText, isFavorite, onPressFavorite]);

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

  if (errorState || !algorithm) {
    return (
      <ScreenContainer>
        <View style={styles.stateWrap}>
          <EmptyState
            when={true}
            message={errorState?.message ?? 'Algorithmus konnte nicht geladen werden.'}
            hint={errorState?.hint ?? 'Bitte erneut versuchen oder die App neu starten.'}
            action={
              <ButtonSecondary
                label="Erneut versuchen"
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
    <>
      <ScreenContainer>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <DetailContentHero
            title={algorithm.title}
            categoryLabel={algorithm.categoryLabel}
            indication={algorithm.heroIndication}
          />

          <AccordionPanel title="Zusammenfassung" defaultExpanded>
            <DetailBodyText variant="relaxed">{algorithm.summary}</DetailBodyText>
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
      <FeedbackSheet
        visible={feedbackVisible}
        bundleId={algorithm.versionLabel}
        contextNote={`Algorithmus | ${algorithm.id} | ${algorithm.title}`}
        onClose={() => {
          setFeedbackVisible(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
