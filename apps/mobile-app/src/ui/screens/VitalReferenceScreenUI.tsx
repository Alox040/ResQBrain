import React, { useMemo } from 'react';
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
import { CARD, LAYOUT, SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type VitalReferenceScreenUISection = {
  id: string;
  label: string;
  scope: string;
};

export type VitalReferenceScreenUIItem = {
  id: string;
  title: string;
  unit: string;
  range: string;
  hint?: string;
};

export type VitalReferenceScreenUIProps = {
  title: string;
  sections: VitalReferenceScreenUISection[];
  selectedSectionId: string;
  onSelectSection: (id: string) => void;
  selectedScope: string;
  referenceItems: VitalReferenceScreenUIItem[];
  warningTitle?: string;
  warningBody?: string;
};

export default function VitalReferenceScreenUI({
  title,
  sections,
  selectedSectionId,
  onSelectSection,
  selectedScope,
  referenceItems,
  warningTitle,
  warningBody,
}: VitalReferenceScreenUIProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { width } = useWindowDimensions();

  const gap = SPACING.gapMd;
  const horizontalPad = SPACING.screenPadding;
  const colWidth = (width - horizontalPad * 2 - gap) / 2;

  return (
    <ScreenContainer>
      <View style={styles.root}>
        <View style={styles.stickyBar}>
          {warningTitle && warningBody ? (
            <WarningCard
              title={warningTitle}
              body={warningBody}
              tone="dosage"
              icon="medkit-outline"
              accessibilityRole="text"
            />
          ) : null}

          <SectionHeader
            title={title}
            size="comfortable"
            description="Einmal waehlen - die Karten unten passen sich an."
          />

          <View style={styles.ageRow}>
            {sections.map((section) => {
              const isSelected = section.id === selectedSectionId;

              return (
                <Pressable
                  key={section.id}
                  onPress={() => onSelectSection(section.id)}
                  hitSlop={8}
                  style={({ pressed }) => [
                    styles.ageChip,
                    isSelected ? styles.ageChipOn : styles.ageChipOff,
                    pressed ? styles.ageChipPressed : null,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${section.label}. ${section.scope}`}
                >
                  <Text
                    style={[
                      styles.ageChipLabel,
                      isSelected ? styles.ageChipLabelOn : null,
                    ]}
                    numberOfLines={1}
                  >
                    {section.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.scopeLine}>{selectedScope}</Text>
        </View>

        <ScrollView
          style={styles.gridScroll}
          contentContainerStyle={styles.gridScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.grid}>
            {referenceItems.map((item) => (
              <View
                key={item.id}
                style={[styles.vitalCard, { width: colWidth, maxWidth: colWidth }]}
              >
                <Text style={styles.vitalTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.vitalRange} accessibilityRole="header">
                  {item.range}
                </Text>
                <Text style={styles.vitalUnit}>{item.unit}</Text>
                {item.hint ? (
                  <Text style={styles.vitalHint} numberOfLines={3}>
                    {item.hint}
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

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
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
      borderBottomColor: colors.border,
      backgroundColor: colors.bg,
    },
    ageRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.gapSm,
    },
    ageChip: {
      flexGrow: 1,
      flexBasis: '30%',
      minHeight: LAYOUT.minTap,
      minWidth: 100,
      paddingHorizontal: 14,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: SPACING.radius,
      borderWidth: 1,
    },
    ageChipOff: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    ageChipOn: {
      backgroundColor: colors.primary,
      borderColor: colors.navHeaderBg,
      borderWidth: 2,
    },
    ageChipPressed: {
      opacity: 0.92,
    },
    ageChipLabel: {
      ...TYPOGRAPHY.body,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
    },
    ageChipLabelOn: {
      color: '#ffffff',
    },
    scopeLine: {
      ...TYPOGRAPHY.body,
      fontWeight: '600',
      color: colors.textMuted,
      lineHeight: 24,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.gapMd,
      marginTop: SPACING.gapSm,
    },
    vitalCard: {
      ...CARD.shell,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingVertical: 18,
      minHeight: 152,
      gap: 8,
    },
    vitalTitle: {
      ...TYPOGRAPHY.body,
      fontWeight: '800',
      color: colors.text,
      lineHeight: 22,
    },
    vitalRange: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.3,
      marginTop: 4,
    },
    vitalUnit: {
      ...TYPOGRAPHY.body,
      fontWeight: '800',
      color: colors.primary,
    },
    vitalHint: {
      ...TYPOGRAPHY.bodyMuted,
      fontWeight: '600',
      color: colors.textMuted,
      lineHeight: 22,
      marginTop: 4,
    },
  });
}
