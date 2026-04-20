import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/ui/theme/colors';
import { radii } from '@/ui/theme/radii';
import { spacing } from '@/ui/theme/spacing';
import { fontSize, fontWeight, lineHeight } from '@/ui/theme/typography';

export type MedicationListItemProps = {
  title: string;
  subtitle?: string;
  tag?: string;
  onPress: () => void;
};

function MedicationListItemInner({ title, subtitle, tag, onPress }: MedicationListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.textBlock}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          {tag ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ) : null}
        </View>
        {subtitle ? (
          <Text numberOfLines={2} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Text style={styles.chevron}>{'>'}</Text>
    </Pressable>
  );
}

export const MedicationListItem = memo(MedicationListItemInner);

const styles = StyleSheet.create({
  container: {
    minHeight: 76,
    borderRadius: radii.listItem,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.listItemPadding,
    paddingVertical: spacing.listItemPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.itemGap,
  },
  pressed: {
    backgroundColor: colors.surfaceDeep,
    borderColor: colors.borderSubtle,
  },
  textBlock: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.badgeToText,
  },
  title: {
    flex: 1,
    color: colors.textStrong,
    fontSize: fontSize.bodyMd,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.bodyMd * lineHeight.snug,
  },
  subtitle: {
    color: colors.textBody,
    fontSize: fontSize.bodyXs,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.bodyXs * lineHeight.normal,
  },
  tag: {
    borderRadius: radii.badge,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.sky.border,
    backgroundColor: colors.sky.subtle,
  },
  tagText: {
    color: colors.sky.text,
    fontSize: fontSize.badge,
    fontWeight: fontWeight.semibold,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 24,
    lineHeight: 24,
  },
});
