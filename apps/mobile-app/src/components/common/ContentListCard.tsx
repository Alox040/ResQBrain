import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { CARD, LAYOUT, SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

const DEFAULT_MIN_HEIGHT = LAYOUT.searchHitMinHeight;

export type ContentListCardProps = {
  title: string;
  subtitle: string;
  onPress: () => void;
  accessibilityLabel: string;
  metaStart: React.ReactNode;
  minHeight?: number;
  style?: ViewStyle;
};

export function ContentListCard({
  title,
  subtitle,
  onPress,
  accessibilityLabel,
  metaStart,
  minHeight = DEFAULT_MIN_HEIGHT,
  style,
}: ContentListCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
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
        <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.subtitle} numberOfLines={3}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    card: {
      ...CARD.shell,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      gap: SPACING.gapSm,
      paddingVertical: SPACING.screenPadding,
    },
    pressed: {
      backgroundColor: colors.pressedRowBg,
      borderColor: colors.pressedRowBorder,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardTitle: {
      ...TYPOGRAPHY.title,
      color: colors.text,
      letterSpacing: -0.2,
    },
    subtitle: {
      ...TYPOGRAPHY.bodyMuted,
      color: colors.textMuted,
    },
  });
}
