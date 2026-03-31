import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SectionHeader } from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import {
  QuickAccessGrid,
  type QuickAccessGridItem,
} from '@/components/QuickAccessGrid';
import { resolveContentViewModel } from '@/data/adapters/resolveContentViewModel';
import { algorithms, medications } from '@/data/contentIndex';
import { useFavoritesSorted } from '@/state/favoritesStore';
import { useRecent } from '@/state/recentStore';
import type { RootTabParamList } from '@/navigation/AppNavigator';
import type { HomeStackParamList } from '@/navigation/homeStackParamList';
import type { ContentKind } from '@/types/content';
import { CARD, LAYOUT, SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

const H_CARD_MIN_WIDTH = 292;
const H_CARD_MIN_HEIGHT = Math.max(124, 56);

function typeLabelDe(kind: ContentKind): string {
  return kind === 'medication' ? 'Medikament' : 'Algorithmus';
}

const QUICK_TILE_MIN = 96;

function createHomeStyles(colors: AppPalette) {
  return StyleSheet.create({
    scroll: {
      flex: 1,
    },
    content: {
      paddingBottom: SPACING.screenPaddingBottom,
      gap: SPACING.sectionStackGap,
    },
    heroCard: {
      ...CARD.shell,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      paddingVertical: SPACING.screenPadding + 2,
      gap: SPACING.gapMd,
      borderWidth: StyleSheet.hairlineWidth * 2,
    },
    eyebrow: {
      ...TYPOGRAPHY.sectionTitle,
      color: colors.primary,
    },
    title: {
      ...TYPOGRAPHY.title,
      color: colors.text,
      lineHeight: 28,
    },
    subtitle: {
      ...TYPOGRAPHY.bodyMuted,
      color: colors.textMuted,
      lineHeight: 24,
    },
    subtitleStrong: {
      fontWeight: '700',
      color: colors.text,
    },
    lookupHint: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      paddingVertical: 12,
      paddingHorizontal: 14,
      backgroundColor: colors.surfaceMuted,
      borderRadius: SPACING.radiusSm,
      borderWidth: StyleSheet.hairlineWidth * 2,
      borderColor: colors.border,
    },
    lookupHintIcon: {
      marginTop: 2,
    },
    lookupHintText: {
      ...TYPOGRAPHY.bodyMuted,
      lineHeight: 22,
      flex: 1,
      color: colors.textMuted,
    },
    lookupHintEmphasis: {
      fontWeight: '700',
      color: colors.primary,
    },
    sectionBlock: {
      gap: SPACING.gapMd,
      marginTop: SPACING.gapXs,
    },
    quickList: {
      gap: SPACING.gapMd,
    },
    quickTile: {
      position: 'relative',
      minHeight: Math.max(QUICK_TILE_MIN, LAYOUT.minTap + 40),
      ...CARD.shell,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      paddingVertical: 16,
      paddingTop: 20,
    },
    quickTileEmphasis: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    quickTilePressed: {
      backgroundColor: colors.pressedRowBg,
      borderColor: colors.pressedRowBorder,
    },
    emphasisPill: {
      position: 'absolute',
      top: 8,
      right: 12,
      zIndex: 1,
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
    },
    emphasisPillText: {
      color: '#ffffff',
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    quickTileInner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.gapMd,
    },
    quickTileInnerWithBadge: {
      paddingRight: 4,
    },
    quickIconWrap: {
      width: 52,
      height: 52,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickTextCol: {
      flex: 1,
      gap: 4,
    },
    quickTitle: {
      ...TYPOGRAPHY.title,
      color: colors.text,
      letterSpacing: -0.2,
    },
    quickSubtitle: {
      ...TYPOGRAPHY.bodyMuted,
      color: colors.textMuted,
      lineHeight: 22,
    },
    infoRow: {
      flexDirection: 'row',
      gap: SPACING.gapMd,
    },
    infoCard: {
      flex: 1,
      gap: SPACING.gapSm,
      paddingVertical: SPACING.screenPadding,
      ...CARD.shell,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    infoValue: {
      ...TYPOGRAPHY.title,
      color: colors.text,
    },
    infoLabel: {
      ...TYPOGRAPHY.body,
      color: colors.textMuted,
      lineHeight: 22,
    },
    hScrollContent: {
      flexDirection: 'row',
      alignItems: 'stretch',
      paddingVertical: SPACING.gapSm,
      paddingRight: SPACING.gapSm,
      gap: SPACING.gapMd,
    },
    hCard: {
      minWidth: H_CARD_MIN_WIDTH,
      minHeight: H_CARD_MIN_HEIGHT,
      padding: SPACING.screenPadding,
      paddingVertical: 18,
      borderRadius: SPACING.radius,
      backgroundColor: colors.surface,
      borderWidth: 2,
      justifyContent: 'space-between',
    },
    hCardPressed: {
      backgroundColor: colors.pressedRowBg,
    },
    hCardTypePill: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    hCardTypeText: {
      fontSize: 13,
      fontWeight: '800',
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    hCardLabel: {
      ...TYPOGRAPHY.title,
      color: colors.text,
      lineHeight: 26,
      marginTop: SPACING.gapSm,
      flexShrink: 1,
    },
    hCardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: SPACING.gapMd,
    },
    hCardCta: {
      ...TYPOGRAPHY.body,
      fontWeight: '700',
      color: colors.primary,
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
    },
    recentList: {
      gap: 8,
    },
    recentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      minHeight: LAYOUT.minTap,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: SPACING.radiusSm,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth * 2,
      borderColor: colors.border,
    },
    recentRowPressed: {
      backgroundColor: colors.pressedRowBg,
      borderColor: colors.pressedRowBorder,
    },
    recentKindPill: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      flexShrink: 0,
    },
    recentKindText: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.2,
    },
    recentRowTitle: {
      flex: 1,
      ...TYPOGRAPHY.body,
      fontWeight: '600',
      color: colors.text,
    },
  });
}

type HomeStyles = ReturnType<typeof createHomeStyles>;

type HomeCarouselCardProps = {
  label: string;
  kind: ContentKind;
  onPress: () => void;
  sheet: HomeStyles;
  chevronColor: string;
};

function HomeCarouselCard({
  label,
  kind,
  onPress,
  sheet,
  chevronColor,
}: HomeCarouselCardProps) {
  const t = typeLabelDe(kind);
  const tone =
    kind === 'medication'
      ? { pillBg: '#dbeafe', pillFg: '#1e40af', ring: '#93c5fd' }
      : { pillBg: '#ede9fe', pillFg: '#5b21b6', ring: '#c4b5fd' };

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [
        sheet.hCard,
        { borderColor: tone.ring },
        pressed ? sheet.hCardPressed : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${t}. Detail öffnen.`}
    >
      <View
        style={[sheet.hCardTypePill, { backgroundColor: tone.pillBg }]}
        importantForAccessibility="no"
      >
        <Text style={[sheet.hCardTypeText, { color: tone.pillFg }]}>
          {t}
        </Text>
      </View>
      <Text style={sheet.hCardLabel} numberOfLines={2}>
        {label}
      </Text>
      <View style={sheet.hCardFooter} importantForAccessibility="no">
        <Text style={sheet.hCardCta}>Antippen zum Öffnen</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={chevronColor}
          accessibilityElementsHidden
        />
      </View>
    </Pressable>
  );
}

type HomeRecentRowProps = {
  label: string;
  kind: ContentKind;
  onPress: () => void;
  sheet: HomeStyles;
  chevronColor: string;
};

function HomeRecentRow({
  label,
  kind,
  onPress,
  sheet,
  chevronColor,
}: HomeRecentRowProps) {
  const t = typeLabelDe(kind);
  const tone =
    kind === 'medication'
      ? { pillBg: '#dbeafe', pillFg: '#1e40af' }
      : { pillBg: '#ede9fe', pillFg: '#5b21b6' };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${t}. Detail öffnen.`}
      style={({ pressed }) => [
        sheet.recentRow,
        pressed ? sheet.recentRowPressed : null,
      ]}
    >
      <View style={[sheet.recentKindPill, { backgroundColor: tone.pillBg }]}>
        <Text style={[sheet.recentKindText, { color: tone.pillFg }]}>
          {t}
        </Text>
      </View>
      <Text style={sheet.recentRowTitle} numberOfLines={1}>
        {label}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={chevronColor}
        accessibilityElementsHidden
      />
    </Pressable>
  );
}

type HomeScreenNav = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>,
  BottomTabNavigationProp<RootTabParamList>
>;

type QuickItem = {
  key: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  backgroundColor: string;
  navigate: () => void;
  emphasis?: boolean;
};

export function HomeScreen() {
  const { colors } = useTheme();
  const sheet = useMemo(() => createHomeStyles(colors), [colors]);
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

  const medCount = medications.length;
  const algoCount = algorithms.length;

  const quickItems: QuickItem[] = useMemo(
    () => [
    {
      key: 'search',
      title: 'Suche',
      subtitle:
        'Stichwortsuche im mitgelieferten Bundle — Namen, Indikationen, Freitext',
      icon: 'search',
      iconColor: colors.primary,
      backgroundColor: colors.primaryMutedBg,
      emphasis: true,
      navigate: () => navigation.navigate('Search'),
    },
    {
      key: 'vitals',
      title: 'Vitalwerte',
      subtitle:
        'Offline-Referenz: HF, AF, RR, Blutdruck, SpO₂, Temperatur — nach Altersgruppe',
      icon: 'pulse',
      iconColor: '#b91c1c',
      backgroundColor: '#fee2e2',
      navigate: () => navigation.navigate('VitalReference'),
    },
    {
      key: 'meds',
      title: 'Medikamente',
      subtitle:
        'Dosierung, Hinweise — mit Querverweisen zu relevanten Algorithmen',
      icon: 'medical',
      iconColor: '#0f766e',
      backgroundColor: '#ccfbf1',
      navigate: () =>
        navigation.navigate('MedicationTab', { screen: 'MedicationListScreen' }),
    },
    {
      key: 'dose',
      title: 'Dosisrechner',
      subtitle:
        'Gewicht in kg — Orientierung aus mg/kg- oder µg/kg-Zeilen im Dosistext',
      icon: 'calculator-outline',
      iconColor: '#6d28d9',
      backgroundColor: '#ede9fe',
      navigate: () =>
        navigation.navigate('MedicationTab', { screen: 'DoseCalculator' }),
    },
    {
      key: 'algo',
      title: 'Algorithmen',
      subtitle: 'Schritte und Warnhinweise — strukturiert nach Organisation',
      icon: 'git-network-outline',
      iconColor: '#9a3412',
      backgroundColor: '#ffedd5',
      navigate: () =>
        navigation.navigate('AlgorithmTab', { screen: 'AlgorithmListScreen' }),
    },
    ],
    [colors.primary, colors.primaryMutedBg, navigation],
  );

  const bundleLine =
    medCount === 0 && algoCount === 0
      ? 'Aktuell sind keine Einträge im lokalen Bundle geladen.'
      : `${medCount} Medikament${medCount === 1 ? '' : 'e'}, ${algoCount} Algorithmus${algoCount === 1 ? '' : 'en'} auf diesem Gerät.`;

  const quickAccessItems = useMemo((): QuickAccessGridItem[] => {
    const MAX_QUICK = 4;
    const seen = new Set<string>();
    const out: QuickAccessGridItem[] = [];

    for (const f of favorites) {
      if (out.length >= MAX_QUICK) break;
      const k = `${f.kind}:${f.id}`;
      seen.add(k);
      out.push({
        reactKey: `qa-fav-${k}`,
        kind: f.kind,
        label:
          resolveContentViewModel(f.id, f.kind)?.label ?? 'Nicht im Bundle',
        onPress: () => openContentDetail(f.kind, f.id),
        source: 'favorite',
      });
    }

    for (const r of recentItems) {
      if (out.length >= MAX_QUICK) break;
      const k = `${r.kind}:${r.id}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({
        reactKey: `qa-rec-${k}`,
        kind: r.kind,
        label:
          resolveContentViewModel(r.id, r.kind)?.label ?? 'Nicht im Bundle',
        onPress: () => openContentDetail(r.kind, r.id),
        source: 'recent',
      });
    }

    return out;
  }, [favorites, recentItems, openContentDetail]);

  return (
    <ScreenContainer>
      <ScrollView
        style={sheet.scroll}
        contentContainerStyle={sheet.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={sheet.heroCard}>
          <Text style={sheet.eyebrow}>ResQBrain · Lookup</Text>
          <Text style={sheet.title}>
            Notfallwissen der Organisation — griffbereit
          </Text>
          <Text style={sheet.subtitle}>
            Für den Einsatz: schnell finden. Für die Nachbereitung: dieselben
            Inhalte in Ruhe nachlesen. Alles arbeitet mit dem{' '}
            <Text style={sheet.subtitleStrong}>
              auf diesem Gerät bereitgestellten Inhaltsbundle
            </Text>
            — keine zusätzlichen Produktbereiche.
          </Text>
          <View style={sheet.lookupHint} accessibilityRole="text">
            <Ionicons
              name="flash-outline"
              size={18}
              color={colors.primary}
              style={sheet.lookupHintIcon}
            />
            <Text style={sheet.lookupHintText}>
              <Text style={sheet.lookupHintEmphasis}>Lookup-first:</Text> Wer
              unter Zeitdruck ist, startet oft über die Suche; Listen helfen,
              wenn du den Bereich schon kennst.
            </Text>
          </View>
        </View>

        <View style={sheet.sectionBlock}>
          <SectionHeader
            title="Schnellzugriff"
            size="comfortable"
            description="Bis zu vier Inhalte: zuerst Favoriten, ergänzt durch zuletzt verwendete. Große Antippflächen im Raster."
          />
          {quickAccessItems.length === 0 ? (
            <View style={sheet.emptyStrip}>
              <Text style={sheet.emptyStripText}>
                Noch keine Einträge für den Schnellzugriff. Stern setzen oder
                Medikamente und Algorithmen öffnen — dann erscheinen sie hier.
              </Text>
            </View>
          ) : (
            <QuickAccessGrid items={quickAccessItems} />
          )}
        </View>

        <View style={sheet.sectionBlock}>
          <SectionHeader
            title="Favoriten"
            size="comfortable"
            description="Alle Favoriten — horizontal wischen, große Kacheln zum Antippen."
          />
          {favorites.length === 0 ? (
            <View style={sheet.emptyStrip}>
              <Text style={sheet.emptyStripText}>
                Noch keine Favoriten. Auf der Detailseite den Stern in der
                Kopfzeile nutzen.
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={sheet.hScrollContent}
              accessibilityRole="list"
            >
              {favorites.map((item) => (
                <HomeCarouselCard
                  key={`fav-${item.kind}-${item.id}`}
                  label={
                    resolveContentViewModel(item.id, item.kind)?.label ??
                    'Nicht im Bundle'
                  }
                  kind={item.kind}
                  onPress={() => openContentDetail(item.kind, item.id)}
                  sheet={sheet}
                  chevronColor={colors.primary}
                />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={sheet.sectionBlock}>
          <SectionHeader
            title="Zuletzt verwendet"
            size="comfortable"
            description="Kompakte Liste — ein Tipp öffnet die Detailseite."
          />
          {recentItems.length === 0 ? (
            <View style={sheet.emptyStrip}>
              <Text style={sheet.emptyStripText}>
                Noch keine Einträge. Öffne ein Medikament oder einen Algorithmus
                — es erscheint dann hier.
              </Text>
            </View>
          ) : (
            <View
              style={sheet.recentList}
              accessibilityRole="list"
            >
              {recentItems.map((item) => (
                <HomeRecentRow
                  key={`recent-${item.kind}-${item.id}`}
                  label={
                    resolveContentViewModel(item.id, item.kind)?.label ??
                    'Nicht im Bundle'
                  }
                  kind={item.kind}
                  onPress={() => openContentDetail(item.kind, item.id)}
                  sheet={sheet}
                  chevronColor={colors.textMuted}
                />
              ))}
            </View>
          )}
        </View>

        <View style={sheet.sectionBlock}>
          <SectionHeader
            title="Kurzwege"
            size="comfortable"
            description="Suche, Vitalwerte, Listen, Dosisrechner — oft dieselben Ziele wie in der Tab-Leiste."
          />

          <View style={sheet.quickList}>
            {quickItems.map((item) => (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}. ${item.subtitle}`}
                onPress={item.navigate}
                style={({ pressed }) => [
                  sheet.quickTile,
                  item.emphasis ? sheet.quickTileEmphasis : null,
                  pressed && sheet.quickTilePressed,
                ]}
              >
                {item.emphasis ? (
                  <View
                    style={sheet.emphasisPill}
                    importantForAccessibility="no"
                  >
                    <Text style={sheet.emphasisPillText}>Zuerst</Text>
                  </View>
                ) : null}
                <View
                  style={[
                    sheet.quickTileInner,
                    item.emphasis ? sheet.quickTileInnerWithBadge : null,
                  ]}
                >
                  <View
                    style={[
                      sheet.quickIconWrap,
                      { backgroundColor: item.backgroundColor },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={26}
                      color={item.iconColor}
                    />
                  </View>
                  <View style={sheet.quickTextCol}>
                    <Text style={sheet.quickTitle}>{item.title}</Text>
                    <Text style={sheet.quickSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color={colors.textMuted}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={sheet.infoRow}>
          <View style={sheet.infoCard}>
            <Ionicons name="archive-outline" size={24} color={colors.primary} />
            <Text style={sheet.infoValue}>Lokales Bundle</Text>
            <Text style={sheet.infoLabel}>{bundleLine}</Text>
          </View>
          <View style={sheet.infoCard}>
            <Ionicons name="book-outline" size={24} color={colors.primary} />
            <Text style={sheet.infoValue}>Nachbereitung</Text>
            <Text style={sheet.infoLabel}>
              Gleiche Inhalte wie im Einsatz — zum Nachlesen, Querverweise
              prüfen, ohne neue Funktionen.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
