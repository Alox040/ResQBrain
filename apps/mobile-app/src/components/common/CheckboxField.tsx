import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { COLORS, SPACING } from '@/theme';
import { Label } from './Label';

export type CheckboxFieldProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  boxSize?: number;
  style?: ViewStyle;
};

export function CheckboxField({
  checked,
  onChange,
  label,
  boxSize = 24,
  style,
}: CheckboxFieldProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={({ pressed }) => [
        styles.row,
        pressed ? styles.pressed : null,
        style,
      ]}
    >
      <View
        style={[
          styles.box,
          {
            width: boxSize,
            height: boxSize,
            borderRadius: 6,
          },
          checked ? styles.boxChecked : styles.boxUnchecked,
        ]}
      >
        {checked ? (
          <Ionicons name="checkmark" size={boxSize - 6} color="#ffffff" />
        ) : null}
      </View>
      {label ? (
        <Label text={label} style={styles.labelSpacing} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.gapSm,
  },
  pressed: {
    opacity: 0.85,
  },
  box: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxUnchecked: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  boxChecked: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  labelSpacing: {
    flex: 1,
  },
});
