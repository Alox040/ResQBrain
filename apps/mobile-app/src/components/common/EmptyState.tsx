import React from 'react';
import {
  Image,
  type ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/theme';

export type EmptyStateProps = {
  /** When true, the block is rendered */
  when: boolean;
  message: string;
  /** Zweizeiler / nächster Hinweis (ohne neue Datenlogik). */
  hint?: string;
  imageSource?: ImageSourcePropType;
  /** Primary or secondary action row */
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

const styles = StyleSheet.create({
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
    color: COLORS.textMuted,
    maxWidth: 320,
  },
  hint: {
    ...TYPOGRAPHY.bodyMuted,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 320,
    marginTop: SPACING.gapXs,
  },
});
