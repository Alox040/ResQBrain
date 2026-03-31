import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SectionHeader } from '@/components/common';
import {
  QuickAccessGrid as QuickAccessGridView,
  type QuickAccessGridItem,
} from '@/components/QuickAccessGrid';
import { ScreenContainer } from '@/components/layout';
import { resolveContentViewModel } from '@/data/adapters/resolveContentViewModel';
import { getAlgorithmById } from '@/data/contentIndex';
import type { RootTabParamList } from '@/navigation/AppNavigator';
import type { HomeStackParamList } from '@/navigation/homeStackParamList';
import { parseFavoriteContentKey, useFavoritesStore } from '@/state/favoritesStore';
import { useRecentStore } from '@/state/recentStore';
import { CARD, LAYOUT, SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';
import type { ContentKind } from '@/types/content';
import { getBundleDebugInfo } from '@/lookup/bundleDebugInfo';

const MAX_QUICK = 4;
const REANIMATION_ALGORITHM_ID = 'alg-reanimation-erwachsene';

type HomeScreenNav = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>,
  BottomTabNavigationProp<RootTabParamList>
>;

type ActionCardItem = {
  key: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackground: string;
  onPress: () => void;
};

type ContentShortcutItem = {
  id: string;
  kind: ContentKind;
  label: string;
  source: 'favorite' | 'recent';
  onPress: () => void;
};

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    scroll: {
      flex: 1,
    },
    content: {
      paddingBottom: SPACING.screenPaddingBottom,
      gap: SPACING.sectionStackGap,
    },
    sectionBlock: {
      gap: SPACING.gapMd,
    },
    emptyStrip: {
      paddingVertical: 20,
      paddingHorizontal: SPACING.screenPadding,
      borderRadius: SPACING.radius,
      backgroundColor: colors.surfaceMuted,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyStripText: {
      ...TYPOGRAPHY.body,
      color: colors.text,
      lineHeight: 22,
    },
    cardList: {
      gap: SPACING.gapMd,
    },
    actionCard: {
      ...CARD.shell,
      minHeight: Math.max(124, LAYOUT.minTap + 56),
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: StyleSheet.hairlineWidth * 2,
      paddingVertical: 18,
      justifyContent: 'center',
    },
    actionCardPressed: {
      backgroundColor: colors.pressedRowBg,
      borderColor: colors.pressedRowBorder,
    },
    actionCardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.gapMd,
    },
    iconWrap: {
      width: 58,
      height: 58,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    actionTextCol: {
      flex: 1,
      gap: 4,
      minWidth: 0,
    },
    actionTitle: {
      ...TYPOGRAPHY.title,
      color: colors.text,
      lineHeight: 28,
    },
    actionSubtitle: {
      ...TYPOGRAPHY.bodyMuted,
      color: colors.textMuted,
      lineHeight: 22,
    },
    searchButton: {
      ...CARD.shell,
      minHeight: Math.max(88, LAYOUT.minTap + 40),
      borderWidth: 2,
      borderColor: colors.primary,
      backgroundColor: colors.primaryMutedBg,
      justifyContent: 'center',
      paddingVertical: 14,
    },
    searchButtonPressed: {
      backgroundColor: colors.pressedRowBg,
      borderColor: colors.pressedRowBorder,
    },
    searchButtonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.gapMd,
    },
    searchIconWrap: {
      width: 52,
      height: 52,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    searchTextCol: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    searchTitle: {
      ...TYPOGRAPHY.title,
      color: colors.text,
      lineHeight: 30,
    },
    searchSubtitle: {
      ...TYPOGRAPHY.bodyMuted,
      color: colors.textMuted,
      lineHeight: 21,
    },
    updateBadge: {
      borderRadius: SPACING.radius,
      borderWidth: 1,
      borderColor: '#f59e0b',
      backgroundColor: '#fffbeb',
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    updateBadgeText: {
      ...TYPOGRAPHY.body,
      color: '#92400e',
      fontWeight: '700',
    },
  });
}

function ActionCard({ item }: { item: ActionCardItem }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. ${item.subtitle}`}
      onPress={item.onPress}
      style={({ pressed }) => [
        styles.actionCard,
        pressed ? styles.actionCardPressed : null,
      ]}
    >
      <View style={styles.actionCardRow}>
        <View style={[styles.iconWrap, { backgroundColor: item.iconBackground }]}>
          <Ionicons name={item.icon} size={28} color={item.iconColor} />
        </View>
        <View style={styles.actionTextCol}>
          <Text style={styles.actionTitle}>{item.title}</Text>
          <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={22}
          color={colors.textMuted}
          accessibilityElementsHidden
        />
      </View>
    </Pressable>
  );
}

function SearchButton({ onPress }: { onPress: () => void }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Search öffnen. Stichwortsuche im lokalen Bundle."
      onPress={onPress}
      style={({ pressed }) => [
        styles.searchButton,
        pressed ? styles.searchButtonPressed : null,
      ]}
    >
      <View style={styles.searchButtonRow}>
        <View style={styles.searchIconWrap}>
          <Ionicons name="search" size={26} color={colors.onPrimary} />
        </View>
        <View style={styles.searchTextCol}>
          <Text style={styles.searchTitle}>Search</Text>
          <Text style={styles.searchSubtitle}>Direkt finden, ohne Listen-Navigation</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

function QuickAccessGrid({
  items,
}: {
  items: QuickAccessGridItem[];
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.sectionBlock}>
      <SectionHeader title="Quick Access" size="comfortable" />
      {items.length === 0 ? (
        <View style={styles.emptyStrip}>
          <Text style={styles.emptyStripText}>
            Noch keine Einträge. Favoriten und zuletzt geöffnete Inhalte erscheinen hier automatisch.
          </Text>
        </View>
      ) : (
        <QuickAccessGridView items={items} />
      )}
    </View>
  );
}

function RecentSection({
  items,
}: {
  items: ContentShortcutItem[];
}) {
  const cards = useMemo(
    () =>
      items.slice(0, 4).map<ActionCardItem>((item) => ({
        key: `recent-${item.kind}:${item.id}`,
        title: item.label,
        subtitle: item.kind === 'medication' ? 'Zuletzt geöffnetes Medikament' : 'Zuletzt geöffneter Algorithmus',
        icon: item.kind === 'medication' ? 'time' : 'time-outline',
        iconColor: '#0f766e',
        iconBackground: '#ccfbf1',
        onPress: item.onPress,
      })),
    [items],
  );

  return (
    <View style={{ gap: SPACING.gapMd }}>
      {cards.map((item) => (
        <ActionCard key={item.key} item={item} />
      ))}
    </View>
  );
}

function FavoritesSection({
  items,
}: {
  items: ContentShortcutItem[];
}) {
  const cards = useMemo(
    () =>
      items.slice(0, 4).map<ActionCardItem>((item) => ({
        key: `favorite-${item.kind}:${item.id}`,
        title: item.label,
        subtitle: item.kind === 'medication' ? 'Favorisiertes Medikament' : 'Favorisierter Algorithmus',
        icon: 'star',
        iconColor: '#a16207',
        iconBackground: '#fef9c3',
        onPress: item.onPress,
      })),
    [items],
  );

  return (
    <View style={{ gap: SPACING.gapMd }}>
      {cards.map((item) => (
        <ActionCard key={item.key} item={item} />
      ))}
    </View>
  );
}

export function HomeScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<HomeScreenNav>();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const recentItems = useRecentStore((state) => state.recentItems);
  const [showUpdateBadge, setShowUpdateBadge] = useState(false);

  const refreshUpdateBadge = useCallback(async () => {
    const info = await getBundleDebugInfo();
    setShowUpdateBadge(info?.pendingUpdate === true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshUpdateBadge();
    }, [refreshUpdateBadge]),
  );

  const favorites = useMemo(() => {
    return favoriteIds
      .map((contentKey, index) => {
        const parsed = parseFavoriteContentKey(contentKey);
        if (!parsed) return null;
        return {
          id: parsed.id,
          kind: parsed.kind,
          timestamp: favoriteIds.length - index,
        };
      })
      .filter((record): record is { id: string; kind: ContentKind; timestamp: number } =>
        record != null,
      );
  }, [favoriteIds]);

  const openContentDetail = useCallback(
    (kind: ContentKind, id: string) => {
      if (kind === 'medication') {
        navigation.navigate('MedicationTab', {
          screen: 'MedicationDetail',
          params: { medicationId: id },
        });
        return;
      }

      navigation.navigate('AlgorithmTab', {
        screen: 'AlgorithmDetail',
        params: { algorithmId: id },
      });
    },
    [navigation],
  );

  const favoriteShortcuts = useMemo((): ContentShortcutItem[] => {
    return favorites.map((favorite) => ({
      id: favorite.id,
      kind: favorite.kind,
      label: resolveContentViewModel(favorite.id, favorite.kind)?.label ?? 'Nicht im Bundle',
      source: 'favorite',
      onPress: () => openContentDetail(favorite.kind, favorite.id),
    }));
  }, [favorites, openContentDetail]);

  const recentShortcuts = useMemo((): ContentShortcutItem[] => {
    return recentItems.map((recent) => ({
      id: recent.id,
      kind: recent.kind,
      label: resolveContentViewModel(recent.id, recent.kind)?.label ?? 'Nicht im Bundle',
      source: 'recent',
      onPress: () => openContentDetail(recent.kind, recent.id),
    }));
  }, [recentItems, openContentDetail]);

  const quickAccessItems = useMemo((): QuickAccessGridItem[] => {
    const seen = new Set<string>();
    const out: QuickAccessGridItem[] = [];

    for (const favorite of favoriteShortcuts) {
      if (out.length >= MAX_QUICK) break;
      const key = `${favorite.kind}:${favorite.id}`;
      seen.add(key);
      out.push({
        reactKey: `qa-fav-${key}`,
        kind: favorite.kind,
        label: favorite.label,
        onPress: favorite.onPress,
        source: 'favorite',
      });
    }

    for (const recent of recentShortcuts) {
      if (out.length >= MAX_QUICK) break;
      const key = `${recent.kind}:${recent.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        reactKey: `qa-rec-${key}`,
        kind: recent.kind,
        label: recent.label,
        onPress: recent.onPress,
        source: 'recent',
      });
    }

    return out;
  }, [favoriteShortcuts, recentShortcuts]);

  const modeCards = useMemo((): ActionCardItem[] => {
    const hasReanimation = getAlgorithmById(REANIMATION_ALGORITHM_ID) != null;

    return [
      {
        key: 'mode-reanimation',
        title: 'Reanimation',
        subtitle: hasReanimation
          ? 'ALS Überblick direkt öffnen'
          : 'Zu den Algorithmen wechseln',
        icon: 'heart',
        iconColor: '#991b1b',
        iconBackground: '#fee2e2',
        onPress: () => {
          if (hasReanimation) {
            navigation.navigate('AlgorithmTab', {
              screen: 'AlgorithmDetail',
              params: { algorithmId: REANIMATION_ALGORITHM_ID },
            });
            return;
          }

          navigation.navigate('AlgorithmTab', {
            screen: 'AlgorithmListScreen',
          });
        },
      },
      {
        key: 'mode-trauma',
        title: 'Trauma',
        subtitle: 'Algorithmenliste für traumabezogene Abläufe',
        icon: 'bandage',
        iconColor: '#9a3412',
        iconBackground: '#ffedd5',
        onPress: () =>
          navigation.navigate('AlgorithmTab', {
            screen: 'AlgorithmListScreen',
          }),
      },
    ];
  }, [navigation]);

  const navigationCards = useMemo((): ActionCardItem[] => [
    {
      key: 'nav-medications',
      title: 'Medications',
      subtitle: 'Listen, Dosierungen und Hinweise',
      icon: 'medkit',
      iconColor: '#0f766e',
      iconBackground: '#ccfbf1',
      onPress: () =>
        navigation.navigate('MedicationTab', {
          screen: 'MedicationListScreen',
        }),
    },
    {
      key: 'nav-algorithms',
      title: 'Algorithms',
      subtitle: 'Abläufe und Warnhinweise öffnen',
      icon: 'git-branch',
      iconColor: '#5b21b6',
      iconBackground: '#ede9fe',
      onPress: () =>
        navigation.navigate('AlgorithmTab', {
          screen: 'AlgorithmListScreen',
        }),
    },
  ], [navigation]);

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionBlock}>
          <SearchButton onPress={() => navigation.navigate('Search')} />
        </View>

        {showUpdateBadge ? (
          <View style={styles.updateBadge}>
            <Text style={styles.updateBadgeText}>Neue Inhalte verfügbar</Text>
          </View>
        ) : null}

        <QuickAccessGrid items={quickAccessItems} />

        <View style={styles.sectionBlock}>
          <SectionHeader title="Favoriten" size="comfortable" />
          {favoriteShortcuts.length === 0 ? (
            <View style={styles.emptyStrip}>
              <Text style={styles.emptyStripText}>
                Noch keine Favoriten gesetzt. In Details mit dem Stern markieren, dann erscheinen sie hier.
              </Text>
            </View>
          ) : (
            <FavoritesSection items={favoriteShortcuts} />
          )}
        </View>

        <View style={styles.sectionBlock}>
          <SectionHeader title="Zuletzt verwendet" size="comfortable" />
          {recentShortcuts.length === 0 ? (
            <View style={styles.emptyStrip}>
              <Text style={styles.emptyStripText}>
                Noch keine zuletzt verwendeten Inhalte. Geöffnete Inhalte werden automatisch gelistet.
              </Text>
            </View>
          ) : (
            <RecentSection items={recentShortcuts} />
          )}
        </View>

        <View style={styles.sectionBlock}>
          <SectionHeader title="Einsatzmodus" size="comfortable" />
          <View style={styles.cardList}>
            {modeCards.map((item) => (
              <ActionCard key={item.key} item={item} />
            ))}
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <SectionHeader title="Navigation" size="comfortable" />
          <View style={styles.cardList}>
            {navigationCards.map((item) => (
              <ActionCard key={item.key} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
