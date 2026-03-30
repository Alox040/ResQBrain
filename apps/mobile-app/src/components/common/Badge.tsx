import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { COLORS } from '@/theme';

export type BadgeVariant = 'primary' | 'muted';

export type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Badge({ label, variant = 'primary', onPress, style }: BadgeProps) {
  const pill = (
    <>
      <Text
        style={[
          styles.text,
          variant === 'primary' ? styles.textPrimary : styles.textMuted,
        ]}
      >
        {label}
      </Text>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={label}
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          styles.pill,
          variant === 'primary' ? styles.bgPrimary : styles.bgMuted,
          style,
        ]}
      >
        {pill}
      </TouchableOpacity>
    );
  }

  return (
    <View
      accessibilityLabel={label}
      style={[
        styles.pill,
        variant === 'primary' ? styles.bgPrimary : styles.bgMuted,
        style,
      ]}
    >
      {pill}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 4,
  },
  bgPrimary: {
    backgroundColor: COLORS.primaryMutedBg,
  },
  bgMuted: {
    backgroundColor: '#e0f2fe',
  },
  text: {
    fontSize: 14,
  },
  textPrimary: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  textMuted: {
    color: '#0369a1',
    fontWeight: '600',
  },
});
