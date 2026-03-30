import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

export type ContentBadgeProps = {
  label: string;
  backgroundColor: string;
  textColor: string;
  style?: ViewStyle;
};

/**
 * Colored pill for domain tags (colors supplied by caller, e.g. from TAG_CONFIG).
 */
export function ContentBadge({
  label,
  backgroundColor,
  textColor,
  style,
}: ContentBadgeProps) {
  return (
    <View
      style={[styles.badge, { backgroundColor }, style]}
      accessibilityLabel={label}
    >
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
