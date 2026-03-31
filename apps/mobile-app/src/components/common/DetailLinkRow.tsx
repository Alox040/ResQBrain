import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { LAYOUT, SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

const DEFAULT_MIN_HEIGHT = LAYOUT.minTap;

export type DetailLinkRowProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
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
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
        <Text style={styles.linkLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
    </Pressable>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: SPACING.gapMd,
      paddingHorizontal: SPACING.gapSm + 2,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: SPACING.gapSm,
    },
    pressed: {
      backgroundColor: colors.pressedRowBg,
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
      color: colors.textMuted,
    },
    linkLabel: {
      ...TYPOGRAPHY.body,
      flexShrink: 1,
      color: colors.link,
      fontWeight: '700',
    },
  });
}
