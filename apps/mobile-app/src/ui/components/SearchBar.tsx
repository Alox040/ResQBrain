import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { LAYOUT, SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type SearchBarProps = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = 'Suchen',
}: SearchBarProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.root}>
      <Ionicons
        name="search"
        size={20}
        color={colors.textMuted}
        accessibilityElementsHidden
      />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        style={styles.input}
      />
    </View>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    root: {
      minHeight: LAYOUT.minTap,
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.gapSm,
      paddingHorizontal: SPACING.screenPadding,
      paddingVertical: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    input: {
      flex: 1,
      minWidth: 0,
      color: colors.text,
      ...TYPOGRAPHY.body,
    },
  });
}
