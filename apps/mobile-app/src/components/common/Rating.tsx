import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { COLORS } from '@/theme';

export type RatingSize = 'sm' | 'md' | 'lg';

export type RatingProps = {
  /** 0–5 */
  value: number;
  size?: RatingSize;
  showEmpty?: boolean;
  readonly?: boolean;
  onChange?: (value: number) => void;
  style?: ViewStyle;
};

const MAX = 5;
const STAR_SIZE: Record<RatingSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

export function Rating({
  value,
  size = 'sm',
  showEmpty = true,
  readonly = true,
  onChange,
  style,
}: RatingProps) {
  const dim = STAR_SIZE[size];

  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: MAX }, (_, index) => {
        const filled = index < value;
        if (!showEmpty && !filled) {
          return null;
        }
        const star = filled ? (
          <Ionicons name="star" size={dim} color="#fbbf24" />
        ) : (
          <Ionicons name="star-outline" size={dim} color={COLORS.border} />
        );

        if (readonly) {
          return (
            <View key={index}>
              {star}
            </View>
          );
        }

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => onChange?.(index + 1)}
            accessibilityLabel={`Bewertung ${index + 1} von ${MAX}`}
          >
            {star}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
});
