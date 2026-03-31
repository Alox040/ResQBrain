import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SectionHeader } from './SectionHeader';
import { CARD, SPACING, TYPOGRAPHY } from '@/theme';

export type DetailSectionTone = 'default' | 'soft';

export type DetailSectionCardProps = {
  title: string;
  hint?: string;
  children: React.ReactNode;
  /** `soft`: dezenter Kartenhintergrund (z. B. Notizen, Nachbereitung). */
  tone?: DetailSectionTone;
  style?: ViewStyle;
};

/**
 * Detail screen block: card chrome + section title + optional hint + content.
 */
export function DetailSectionCard({
  title,
  hint,
  children,
  style,
  tone = 'default',
}: DetailSectionCardProps) {
  return (
    <View style={[styles.card, tone === 'soft' ? styles.cardSoft : null, style]}>
      <SectionHeader title={title} size="comfortable" />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...CARD.base,
    gap: SPACING.gapMd,
    paddingVertical: SPACING.screenPadding + 2,
  },
  cardSoft: {
    backgroundColor: '#fafafa',
    borderColor: '#ececec',
  },
  hint: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: -4,
  },
});
