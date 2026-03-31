import React, { useMemo } from 'react';
import {
  Image,
  type ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type EmptyStateProps = {
  when: boolean;
  message: string;
  hint?: string;
  imageSource?: ImageSourcePropType;
  action?: React.ReactNode;
  style?: ViewStyle;
};

export function EmptyState({
  when,
  message,
  hint,
  imageSource,
  action,
  style,
}: EmptyStateProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!when) {
    return null;
  }

  const a11y = hint ? `${message} ${hint}` : message;

  return (
    <View
      style={[styles.wrap, style]}
      accessibilityRole="text"
      accessibilityLabel={a11y}
    >
      {imageSource ? (
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      ) : null}
      <Text style={styles.message}>{message}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      {action}
    </View>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    wrap: {
      minHeight: 200,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.screenPaddingBottom,
      gap: SPACING.screenPadding,
    },
    image: {
      width: 200,
      height: 200,
      maxWidth: '80%',
    },
    message: {
      ...TYPOGRAPHY.body,
      textAlign: 'center',
      color: colors.textMuted,
      maxWidth: 320,
    },
    hint: {
      ...TYPOGRAPHY.bodyMuted,
      textAlign: 'center',
      lineHeight: 22,
      maxWidth: 320,
      marginTop: SPACING.gapXs,
      color: colors.textMuted,
    },
  });
}
