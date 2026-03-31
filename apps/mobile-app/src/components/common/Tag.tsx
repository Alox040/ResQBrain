import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { LAYOUT, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type TagProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Tag({ label, selected = false, onPress, style }: TagProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const body = (
    <Text style={[styles.text, selected ? styles.textSelected : styles.textPlain]}>
      {label}
    </Text>
  );

  if (!onPress) {
    return (
      <View
        accessibilityLabel={label}
        style={[styles.base, selected ? styles.selected : styles.plain, style]}
      >
        {body}
      </View>
    );
  }

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.base, selected ? styles.selected : styles.plain, style]}
    >
      {body}
    </TouchableOpacity>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    base: {
      minHeight: LAYOUT.minTap,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 999,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    plain: {
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    selected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryMutedBg,
    },
    text: {
      ...TYPOGRAPHY.body,
    },
    textPlain: {
      color: colors.text,
    },
    textSelected: {
      color: colors.primary,
      fontWeight: '700',
    },
  });
}
