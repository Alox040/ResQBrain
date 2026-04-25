import { Ionicons } from '@expo/vector-icons';
import React, { memo, useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CARD, LAYOUT, SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type ListItemProps = {
  title: string;
  subtitle?: string;
  tag?: string;
  onPress?: () => void;
};

function ListItemComponent({
  title,
  subtitle,
  tag,
  onPress,
}: ListItemProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isInteractive = typeof onPress === 'function';

  return (
    <Pressable
      accessibilityRole={isInteractive ? 'button' : 'text'}
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      disabled={!isInteractive}
      hitSlop={isInteractive ? 6 : undefined}
      onPress={onPress}
      style={({ pressed }) => [
        styles.root,
        pressed && isInteractive ? styles.rootPressed : null,
      ]}
    >
      <View style={styles.textWrap}>
        {tag ? (
          <View style={styles.tagWrap}>
            <Text style={styles.tag}>{tag}</Text>
          </View>
        ) : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={3}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {isInteractive ? (
        <Ionicons
          name="chevron-forward"
          size={22}
          color={colors.textMuted}
          accessibilityElementsHidden
        />
      ) : null}
    </Pressable>
  );
}

export const ListItem = memo(ListItemComponent);

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    root: {
      ...CARD.shell,
      minHeight: LAYOUT.listRowMinHeight,
      paddingVertical: SPACING.screenPadding,
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.gapMd,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    rootPressed: {
      backgroundColor: colors.pressedRowBg,
      borderColor: colors.pressedRowBorder,
    },
    textWrap: {
      flex: 1,
      minWidth: 0,
      gap: 6,
    },
    tagWrap: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: colors.primaryMutedBg,
    },
    tag: {
      ...TYPOGRAPHY.caption,
      color: colors.primary,
      fontWeight: '700',
    },
    title: {
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
