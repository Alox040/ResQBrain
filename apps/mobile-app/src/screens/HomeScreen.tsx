import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { SectionHeader } from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import { algorithms, medications } from '@/data/contentIndex';
import type { RootTabParamList } from '@/navigation/AppNavigator';
import { CARD, COLORS, SPACING, TYPOGRAPHY } from '@/theme';

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
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

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
            title="Drei Kurzwege"
            size="comfortable"
            description="Gleiche Ziele wie unten in der Navigation — hier zum schnellen Antippen."
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

const QUICK_TILE_MIN = 88;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.screenPaddingBottom,
    gap: SPACING.screenPadding,
  },
  heroCard: {
    ...CARD.base,
    paddingVertical: SPACING.screenPadding,
    gap: SPACING.gapMd,
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
    lineHeight: 22,
  },
  subtitleStrong: {
    fontWeight: '600',
    color: '#374151',
  },
  lookupHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: SPACING.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.border,
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
  },
  quickList: {
    gap: SPACING.gapMd,
  },
  quickTile: {
    position: 'relative',
    minHeight: QUICK_TILE_MIN,
    ...CARD.base,
    paddingVertical: 14,
    paddingTop: 18,
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
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
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
});
