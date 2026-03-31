import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
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
import { resolveContentViewModel } from '@/data/adapters/resolveContentViewModel';
import { algorithms, medications } from '@/data/contentIndex';
import { useFavoritesSorted } from '@/features/favorites/favoritesStore';
import { useHistorySorted } from '@/features/history/historyStore';
import type { RootTabParamList } from '@/navigation/AppNavigator';
import type { HomeStackParamList } from '@/navigation/homeStackParamList';
import type { ContentKind } from '@/types/content';
import { CARD, COLORS, LAYOUT, SPACING, TYPOGRAPHY } from '@/theme';

const H_CARD_MIN_WIDTH = 292;
const H_CARD_MIN_HEIGHT = 124;

function typeLabelDe(kind: ContentKind): string {
  return kind === 'medication' ? 'Medikament' : 'Algorithmus';
}

type HomeCarouselCardProps = {
  label: string;
  kind: ContentKind;
  onPress: () => void;
};

function HomeCarouselCard({ label, kind, onPress }: HomeCarouselCardProps) {
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
        styles.hCard,
        { borderColor: tone.ring },
        pressed ? styles.hCardPressed : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${t}. Detail öffnen.`}
    >
      <View
        style={[styles.hCardTypePill, { backgroundColor: tone.pillBg }]}
        importantForAccessibility="no"
      >
        <Text style={[styles.hCardTypeText, { color: tone.pillFg }]}>
          {t}
        </Text>
      </View>
      <Text style={styles.hCardLabel} numberOfLines={2}>
        {label}
      </Text>
      <View style={styles.hCardFooter} importantForAccessibility="no">
        <Text style={styles.hCardCta}>Antippen zum Öffnen</Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={COLORS.primary}
          accessibilityElementsHidden
        />
      </View>
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
  const navigation = useNavigation<HomeScreenNav>();
  const favorites = useFavoritesSorted();
  const recentHistory = useHistorySorted();

  const openContentDetail = useCallback(
    (kind: ContentKind, id: string) => {
      if (kind === 'medication') {
        navigation.navigate('MedicationList', {
          screen: 'MedicationDetail',
          params: { medicationId: id },
        });
        return;
      }
      navigation.navigate('AlgorithmList', {
        screen: 'AlgorithmDetail',
        params: { algorithmId: id },
      });
    },
    [navigation],
  );

  const medCount = medications.length;
  const algoCount = algorithms.length;

  const quickItems: QuickItem[] = [
    {
      key: 'search',
      title: 'Suche',
      subtitle:
        'Stichwortsuche im mitgelieferten Bundle — Namen, Indikationen, Freitext',
      icon: 'search',
      iconColor: COLORS.primary,
      backgroundColor: COLORS.primaryMutedBg,
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
        navigation.navigate('MedicationList', { screen: 'MedicationList' }),
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
        navigation.navigate('MedicationList', { screen: 'DoseCalculator' }),
    },
    {
      key: 'algo',
      title: 'Algorithmen',
      subtitle: 'Schritte und Warnhinweise — strukturiert nach Organisation',
      icon: 'git-network-outline',
      iconColor: '#9a3412',
      backgroundColor: '#ffedd5',
      navigate: () =>
        navigation.navigate('AlgorithmList', { screen: 'AlgorithmList' }),
    },
  ];

  const bundleLine =
    medCount === 0 && algoCount === 0
      ? 'Aktuell sind keine Einträge im lokalen Bundle geladen.'
      : `${medCount} Medikament${medCount === 1 ? '' : 'e'}, ${algoCount} Algorithmus${algoCount === 1 ? '' : 'en'} auf diesem Gerät.`;

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>ResQBrain · Lookup</Text>
          <Text style={styles.title}>
            Notfallwissen der Organisation — griffbereit
          </Text>
          <Text style={styles.subtitle}>
            Für den Einsatz: schnell finden. Für die Nachbereitung: dieselben
            Inhalte in Ruhe nachlesen. Alles arbeitet mit dem{' '}
            <Text style={styles.subtitleStrong}>
              auf diesem Gerät bereitgestellten Inhaltsbundle
            </Text>
            — keine zusätzlichen Produktbereiche.
          </Text>
          <View style={styles.lookupHint} accessibilityRole="text">
            <Ionicons
              name="flash-outline"
              size={18}
              color={COLORS.primary}
              style={styles.lookupHintIcon}
            />
            <Text style={styles.lookupHintText}>
              <Text style={styles.lookupHintEmphasis}>Lookup-first:</Text> Wer
              unter Zeitdruck ist, startet oft über die Suche; Listen helfen,
              wenn du den Bereich schon kennst.
            </Text>
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <SectionHeader
            title="Favoriten"
            size="comfortable"
            description="Schnellzugriff — horizontal wischen, große Kacheln zum Antippen."
          />
          {favorites.length === 0 ? (
            <View style={styles.emptyStrip}>
              <Text style={styles.emptyStripText}>
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
              contentContainerStyle={styles.hScrollContent}
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
                />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.sectionBlock}>
          <SectionHeader
            title="Zuletzt geöffnet"
            size="comfortable"
            description="Letzte Detailseiten — zuerst das Aktuellste."
          />
          {recentHistory.length === 0 ? (
            <View style={styles.emptyStrip}>
              <Text style={styles.emptyStripText}>
                Noch kein Verlauf. Öffne ein Medikament oder einen Algorithmus —
                es erscheint dann hier.
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.hScrollContent}
              accessibilityRole="list"
            >
              {recentHistory.map((item) => (
                <HomeCarouselCard
                  key={`hist-${item.kind}-${item.id}`}
                  label={
                    resolveContentViewModel(item.id, item.kind)?.label ??
                    'Nicht im Bundle'
                  }
                  kind={item.kind}
                  onPress={() => openContentDetail(item.kind, item.id)}
                />
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.sectionBlock}>
          <SectionHeader
            title="Kurzwege"
            size="comfortable"
            description="Suche, Vitalwerte, Listen, Dosisrechner — oft dieselben Ziele wie in der Tab-Leiste."
          />

          <View style={styles.quickList}>
            {quickItems.map((item) => (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}. ${item.subtitle}`}
                onPress={item.navigate}
                style={({ pressed }) => [
                  styles.quickTile,
                  item.emphasis ? styles.quickTileEmphasis : null,
                  pressed && styles.quickTilePressed,
                ]}
              >
                {item.emphasis ? (
                  <View
                    style={styles.emphasisPill}
                    importantForAccessibility="no"
                  >
                    <Text style={styles.emphasisPillText}>Zuerst</Text>
                  </View>
                ) : null}
                <View
                  style={[
                    styles.quickTileInner,
                    item.emphasis ? styles.quickTileInnerWithBadge : null,
                  ]}
                >
                  <View
                    style={[
                      styles.quickIconWrap,
                      { backgroundColor: item.backgroundColor },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={26}
                      color={item.iconColor}
                    />
                  </View>
                  <View style={styles.quickTextCol}>
                    <Text style={styles.quickTitle}>{item.title}</Text>
                    <Text style={styles.quickSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color={COLORS.textMuted}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Ionicons name="archive-outline" size={24} color={COLORS.primary} />
            <Text style={styles.infoValue}>Lokales Bundle</Text>
            <Text style={styles.infoLabel}>{bundleLine}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="book-outline" size={24} color={COLORS.primary} />
            <Text style={styles.infoValue}>Nachbereitung</Text>
            <Text style={styles.infoLabel}>
              Gleiche Inhalte wie im Einsatz — zum Nachlesen, Querverweise
              prüfen, ohne neue Funktionen.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const QUICK_TILE_MIN = 96;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.screenPaddingBottom,
    gap: SPACING.sectionStackGap,
  },
  heroCard: {
    ...CARD.base,
    paddingVertical: SPACING.screenPadding + 2,
    gap: SPACING.gapMd,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  eyebrow: {
    ...TYPOGRAPHY.sectionTitle,
  },
  title: {
    ...TYPOGRAPHY.title,
    lineHeight: 30,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyMuted,
    color: '#4b5563',
    fontSize: 15,
    lineHeight: 24,
  },
  subtitleStrong: {
    fontWeight: '600',
    color: '#374151',
  },
  lookupHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#f8fafc',
    borderRadius: SPACING.radiusSm,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: '#e2e8f0',
  },
  lookupHintIcon: {
    marginTop: 2,
  },
  lookupHintText: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  lookupHintEmphasis: {
    fontWeight: '700',
    color: COLORS.primary,
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
    ...CARD.base,
    paddingVertical: 16,
    paddingTop: 20,
  },
  quickTileEmphasis: {
    borderColor: '#93c5fd',
    borderWidth: 1.5,
  },
  quickTilePressed: {
    backgroundColor: COLORS.primaryMutedBg,
    borderColor: '#bfdbfe',
  },
  emphasisPill: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 1,
    backgroundColor: COLORS.primary,
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
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  quickSubtitle: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    gap: SPACING.gapMd,
  },
  infoCard: {
    flex: 1,
    gap: SPACING.gapSm,
    paddingVertical: SPACING.screenPadding,
    ...CARD.base,
  },
  infoValue: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  infoLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textMuted,
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
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    justifyContent: 'space-between',
  },
  hCardPressed: {
    backgroundColor: COLORS.primaryMutedBg,
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
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
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
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  emptyStrip: {
    paddingVertical: 20,
    paddingHorizontal: SPACING.screenPadding,
    borderRadius: SPACING.radius,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyStripText: {
    ...TYPOGRAPHY.body,
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
});
