import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SectionHeader } from '@/components/common';
import { QuickAccessGrid, type QuickAccessGridItem } from '@/components/QuickAccessGrid';
import { ScreenContainer } from '@/components/layout';
import { resolveContentViewModel } from '@/data/adapters/resolveContentViewModel';
import { getAlgorithmById } from '@/data/contentIndex';
import type { RootTabParamList } from '@/navigation/AppNavigator';
import type { HomeStackParamList } from '@/navigation/homeStackParamList';
import { useFavoritesSorted } from '@/state/favoritesStore';
import { useRecent } from '@/state/recentStore';
import { CARD, LAYOUT, SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';
import type { ContentKind } from '@/types/content';

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

export function HomeScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<HomeScreenNav>();
  const favorites = useFavoritesSorted();
  const recentItems = useRecent();

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

  const quickAccessItems = useMemo((): QuickAccessGridItem[] => {
    const seen = new Set<string>();
    const out: QuickAccessGridItem[] = [];

    for (const favorite of favorites) {
      if (out.length >= MAX_QUICK) break;
      const key = `${favorite.kind}:${favorite.id}`;
      seen.add(key);
      out.push({
        reactKey: `qa-fav-${key}`,
        kind: favorite.kind,
        label:
          resolveContentViewModel(favorite.id, favorite.kind)?.label ?? 'Nicht im Bundle',
        onPress: () => openContentDetail(favorite.kind, favorite.id),
        source: 'favorite',
      });
    }

    for (const recent of recentItems) {
      if (out.length >= MAX_QUICK) break;
      const key = `${recent.kind}:${recent.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        reactKey: `qa-rec-${key}`,
        kind: recent.kind,
        label:
          resolveContentViewModel(recent.id, recent.kind)?.label ?? 'Nicht im Bundle',
        onPress: () => openContentDetail(recent.kind, recent.id),
        source: 'recent',
      });
    }

    return out;
  }, [favorites, recentItems, openContentDetail]);

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
      key: 'nav-search',
      title: 'Search',
      subtitle: 'Stichwortsuche im lokalen Bundle',
      icon: 'search',
      iconColor: colors.primary,
      iconBackground: colors.primaryMutedBg,
      onPress: () => navigation.navigate('Search'),
    },
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
  ], [colors.primary, colors.primaryMutedBg, navigation]);

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionBlock}>
          <SectionHeader title="Quick Access" size="comfortable" />
          {quickAccessItems.length === 0 ? (
            <View style={styles.emptyStrip}>
              <Text style={styles.emptyStripText}>
                Noch keine Einträge. Favoriten und zuletzt geöffnete Inhalte erscheinen hier automatisch.
              </Text>
            </View>
          ) : (
            <QuickAccessGrid items={quickAccessItems} />
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
