import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { CARD, COLORS, SPACING } from '@/theme';

const DEFAULT_MIN_HEIGHT = 96;

export type LookupListRowProps = {
  title: string;
  subtitle: string;
  onPress: () => void;
  accessibilityLabel: string;
  leading?: React.ReactNode;
  minHeight?: number;
  style?: ViewStyle;
};

/**
 * One lookup list row: optional leading slot, title + subtitle, chevron.
 */
export function LookupListRow({
  title,
  subtitle,
  onPress,
  accessibilityLabel,
  leading,
  minHeight = DEFAULT_MIN_HEIGHT,
  style,
}: LookupListRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { minHeight },
        pressed && styles.rowPressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.rowBody}>
        {leading ? <View style={styles.leading}>{leading}</View> : null}
        <View style={styles.textCol}>
          <Text style={styles.label}>{title}</Text>
          <Text style={styles.subtitle} numberOfLines={3}>
            {subtitle}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={22} color={COLORS.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    ...CARD.base,
    paddingVertical: SPACING.screenPadding,
    gap: SPACING.gapSm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.gapMd,
    minWidth: 0,
  },
  leading: {
    flexShrink: 0,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  rowPressed: {
    backgroundColor: COLORS.primaryMutedBg,
    borderColor: '#bfdbfe',
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textMuted,
  },
});
