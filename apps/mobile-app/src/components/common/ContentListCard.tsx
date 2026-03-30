import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { CARD, COLORS, SPACING, TYPOGRAPHY } from '@/theme';

const DEFAULT_MIN_HEIGHT = 92;

export type ContentListCardProps = {
  title: string;
  subtitle: string;
  onPress: () => void;
  accessibilityLabel: string;
  /** e.g. Badge for content kind */
  metaStart: React.ReactNode;
  minHeight?: number;
  style?: ViewStyle;
};

/**
 * Pressable summary card (e.g. search hit): meta row + title + subtitle + chevron.
 */
export function ContentListCard({
  title,
  subtitle,
  onPress,
  accessibilityLabel,
  metaStart,
  minHeight = DEFAULT_MIN_HEIGHT,
  style,
}: ContentListCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { minHeight },
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.metaRow}>
        {metaStart}
        <Ionicons name="chevron-forward" size={22} color={COLORS.textMuted} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle} numberOfLines={3}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...CARD.base,
    gap: SPACING.gapSm,
    paddingVertical: SPACING.screenPadding,
  },
  pressed: {
    backgroundColor: COLORS.primaryMutedBg,
    borderColor: '#bfdbfe',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 15,
    lineHeight: 22,
  },
});
