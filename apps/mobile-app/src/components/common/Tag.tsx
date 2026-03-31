import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { COLORS } from '@/theme';

export type TagProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Tag({ label, selected = false, onPress, style }: TagProps) {
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

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plain: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  selected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryMutedBg,
  },
  text: {
    fontSize: 16,
  },
  textPlain: {
    color: COLORS.text,
  },
  textSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
