import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme';

const DEFAULT_MIN_HEIGHT = 56;

export type DetailLinkRowProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
  /** Kleines Kontext-Label (z. B. „Algorithmus“, „Medikament“). */
  contextLabel?: string;
  minHeight?: number;
  style?: ViewStyle;
};

export function DetailLinkRow({
  label,
  onPress,
  accessibilityLabel,
  contextLabel,
  minHeight = DEFAULT_MIN_HEIGHT,
  style,
}: DetailLinkRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { minHeight },
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.labelCol}>
        {contextLabel ? (
          <Text style={styles.context}>{contextLabel}</Text>
        ) : null}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={COLORS.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.gapSm,
  },
  pressed: {
    backgroundColor: COLORS.primaryMutedBg,
  },
  labelCol: {
    flex: 1,
    gap: SPACING.gapXs,
  },
  context: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: COLORS.textMuted,
  },
  label: {
    ...TYPOGRAPHY.body,
    flexShrink: 1,
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 17,
  },
});
