import { Ionicons } from '@expo/vector-icons';
import React, { memo, useMemo } from 'react';
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

const DEFAULT_MIN_HEIGHT = LAYOUT.listRowMinHeight;

export type LookupListRowProps = {
  title: string;
  subtitle: string;
  onPress: () => void;
  accessibilityLabel: string;
  leading?: React.ReactNode;
  /** Rendered between the text block and the chevron (e.g. favorite star). */
  favoriteSlot?: React.ReactNode;
  minHeight?: number;
  style?: ViewStyle;
};

/**
 * One lookup list row: optional leading slot, title + subtitle, chevron.
 */
function LookupListRowComponent({
  title,
  subtitle,
  onPress,
  accessibilityLabel,
  leading,
  favoriteSlot,
  minHeight = DEFAULT_MIN_HEIGHT,
  style,
}: LookupListRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
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
      {favoriteSlot ? (
        <View style={styles.favoriteWrap}>{favoriteSlot}</View>
      ) : null}
      <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
    </Pressable>
  );
}

export const LookupListRow = memo(LookupListRowComponent);

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    row: {
      ...CARD.shell,
      backgroundColor: colors.surface,
      borderColor: colors.border,
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
    favoriteWrap: {
      flexShrink: 0,
    },
    textCol: {
      flex: 1,
      minWidth: 0,
      gap: 6,
    },
    rowPressed: {
      backgroundColor: colors.pressedRowBg,
      borderColor: colors.pressedRowBorder,
    },
    label: {
      ...TYPOGRAPHY.title,
      color: colors.text,
      flexShrink: 1,
      letterSpacing: -0.2,
    },
    subtitle: {
      ...TYPOGRAPHY.bodyMuted,
      color: colors.textMuted,
    },
  });
}
