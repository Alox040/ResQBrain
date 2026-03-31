import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SectionHeader, WarningCard } from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import { VITAL_REFERENCE_SECTIONS } from './vitalReferenceData';
import type { AgeGroupId } from './vitalReferenceTypes';
import type { HomeStackParamList } from '@/navigation/homeStackParamList';
import { CARD, COLORS, LAYOUT, SPACING } from '@/theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'VitalReference'>;

export function VitalReferenceScreen({ navigation }: Props) {
  const [ageId, setAgeId] = useState<AgeGroupId>('adult');
  const { width } = useWindowDimensions();

  const section = useMemo(
    () => VITAL_REFERENCE_SECTIONS.find((s) => s.id === ageId)!,
    [ageId],
  );

  const gap = SPACING.gapMd;
  const horizontalPad = SPACING.screenPadding;
  const colWidth = (width - horizontalPad * 2 - gap) / 2;

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Vitalwerte' });
  }, [navigation]);

  return (
    <ScreenContainer>
      <View style={styles.root}>
        <View style={styles.stickyBar}>
          <WarningCard
            title="Nur Orientierung"
            body="Kein Ersatz für klinische Beurteilung oder lokale Zielwerte. Offline-Referenz — Leitfaden und Gesamtbild im Blick."
            tone="dosage"
            icon="medkit-outline"
            accessibilityRole="text"
          />

          <SectionHeader
            title="Altersgruppe"
            size="comfortable"
            description="Einmal wählen — die Karten unten passen sich an."
          />
          <View style={styles.ageRow}>
            {VITAL_REFERENCE_SECTIONS.map((ag) => {
              const on = ag.id === ageId;
              return (
                <Pressable
                  key={ag.id}
                  onPress={() => setAgeId(ag.id)}
                  hitSlop={8}
                  style={({ pressed }) => [
                    styles.ageChip,
                    on ? styles.ageChipOn : styles.ageChipOff,
                    pressed && styles.ageChipPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${ag.label}. ${ag.scope}`}
                >
                  <Text
                    style={[styles.ageChipLabel, on && styles.ageChipLabelOn]}
                    numberOfLines={1}
                  >
                    {ag.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.scopeLine}>{section.scope}</Text>
        </View>

        <ScrollView
          style={styles.gridScroll}
          contentContainerStyle={styles.gridScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.grid}>
            {section.cards.map((card) => (
              <View
                key={card.id}
                style={[styles.vitalCard, { width: colWidth, maxWidth: colWidth }]}
              >
                <Text style={styles.vitalTitle} numberOfLines={2}>
                  {card.title}
                </Text>
                <Text style={styles.vitalRange} accessibilityRole="header">
                  {card.range}
                </Text>
                <Text style={styles.vitalUnit}>{card.unit}</Text>
                {card.hint ? (
                  <Text style={styles.vitalHint} numberOfLines={3}>
                    {card.hint}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  gridScroll: {
    flex: 1,
  },
  gridScrollContent: {
    paddingBottom: SPACING.screenPaddingBottom,
  },
  stickyBar: {
    gap: SPACING.gapMd,
    paddingBottom: SPACING.gapMd,
    marginBottom: SPACING.gapSm,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  ageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.gapSm,
  },
  ageChip: {
    flexGrow: 1,
    flexBasis: '30%',
    minHeight: LAYOUT.minTap + 8,
    minWidth: 100,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SPACING.radius,
    borderWidth: 1,
  },
  ageChipOff: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  ageChipOn: {
    backgroundColor: COLORS.primary,
    borderColor: '#1e40af',
    borderWidth: 2,
  },
  ageChipPressed: {
    opacity: 0.92,
  },
  ageChipLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  ageChipLabelOn: {
    color: '#ffffff',
  },
  scopeLine: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.gapMd,
    marginTop: SPACING.gapSm,
  },
  vitalCard: {
    ...CARD.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingVertical: 18,
    minHeight: 152,
    gap: 8,
  },
  vitalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 20,
  },
  vitalRange: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
    marginTop: 4,
  },
  vitalUnit: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  vitalHint: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
    color: '#57534e',
    marginTop: 4,
  },
});
