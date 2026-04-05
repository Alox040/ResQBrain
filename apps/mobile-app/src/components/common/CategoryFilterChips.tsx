import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';
import {
  LIST_CATEGORY_CHIP_OPTIONS,
  type ListCategoryFilter,
} from '@/utils/listCategoryFilter';

export type CategoryFilterChipsProps = {
  selected: ListCategoryFilter;
  onChange: (value: ListCategoryFilter) => void;
};

export function CategoryFilterChips({
  selected,
  onChange,
}: CategoryFilterChipsProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.outer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {LIST_CATEGORY_CHIP_OPTIONS.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={opt.label}
              style={({ pressed }) => [
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipPlain,
                pressed && styles.chipPressed,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected ? styles.chipTextSelected : styles.chipTextPlain,
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    outer: {
      marginBottom: SPACING.gapMd,
    },
    scrollContent: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      gap: SPACING.gapSm,
      paddingHorizontal: SPACING.screenPadding,
    },
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 999,
      borderWidth: 1,
    },
    chipPlain: {
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    chipSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryMutedBg,
    },
    chipPressed: {
      opacity: 0.85,
    },
    chipText: {
      ...TYPOGRAPHY.caption,
      fontWeight: '600',
    },
    chipTextPlain: {
      color: colors.text,
    },
    chipTextSelected: {
      color: colors.primary,
    },
  });
}
