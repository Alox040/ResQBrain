import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type BadgeVariant = 'primary' | 'muted';

export type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Badge({ label, variant = 'primary', onPress, style }: BadgeProps) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const pill = (
    <Text
      style={[
        styles.text,
        variant === 'primary' ? styles.textPrimary : styles.textMuted,
      ]}
    >
      {label}
    </Text>
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

function createStyles(colors: AppPalette, isDark: boolean) {
  const mutedBg = isDark ? colors.surfaceMuted : '#e0f2fe';
  const mutedFg = isDark ? colors.textMuted : '#0369a1';

  return StyleSheet.create({
    pill: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 999,
      marginBottom: 4,
      minHeight: 28,
      justifyContent: 'center',
    },
    bgPrimary: {
      backgroundColor: colors.primaryMutedBg,
    },
    bgMuted: {
      backgroundColor: mutedBg,
    },
    text: {
      fontSize: 14,
    },
    textPrimary: {
      color: colors.primary,
      fontWeight: '700',
    },
    textMuted: {
      color: mutedFg,
      fontWeight: '700',
    },
  });
}
