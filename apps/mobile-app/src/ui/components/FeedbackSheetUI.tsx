import React, { useMemo } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ButtonPrimary, ButtonSecondary } from '@/components/common';
import { SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';
import type { FeedbackCategory } from '@/types/feedback';

export type FeedbackSheetUIProps = {
  visible: boolean;
  category: FeedbackCategory | null;
  text: string;
  error?: string | null;
  isSubmitting: boolean;
  maxLength: number;
  onCategoryChange: (category: FeedbackCategory) => void;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

const CATEGORY_OPTIONS: Array<{
  label: string;
  value: FeedbackCategory;
}> = [
  { label: 'Bug', value: 'bug' },
  { label: 'Idee', value: 'idea' },
  { label: 'Verbesserung', value: 'improvement' },
];

export function FeedbackSheetUI({
  visible,
  category,
  text,
  error = null,
  isSubmitting,
  maxLength,
  onCategoryChange,
  onTextChange,
  onSubmit,
  onClose,
}: FeedbackSheetUIProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Feedback senden</Text>
          <Text style={styles.subtitle}>
            Freitext reicht. Die Debug-Infos werden automatisch angehaengt.
          </Text>

          <View style={styles.chipRow}>
            {CATEGORY_OPTIONS.map((option) => {
              const selected = category === option.value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  onPress={() => {
                    onCategoryChange(option.value);
                  }}
                  style={[
                    styles.chip,
                    selected ? styles.chipSelected : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipLabel,
                      selected ? styles.chipLabelSelected : null,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.inputWrap}>
            <TextInput
              value={text}
              onChangeText={onTextChange}
              placeholder="Was ist dir aufgefallen?"
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={maxLength}
              textAlignVertical="top"
              style={styles.input}
            />
            <Text style={styles.counter}>
              {text.length}/{maxLength}
            </Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <ButtonSecondary
              label="Abbrechen"
              onPress={onClose}
              disabled={isSubmitting}
            />
            <ButtonPrimary
              label={isSubmitting ? 'Oeffnet ...' : 'Absenden'}
              onPress={onSubmit}
              disabled={isSubmitting}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
    },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: SPACING.screenPadding,
      paddingTop: SPACING.gapMd,
      paddingBottom: SPACING.screenPaddingBottom,
      gap: SPACING.gapMd,
      borderTopWidth: 1,
      borderColor: colors.border,
    },
    handle: {
      width: 44,
      height: 5,
      borderRadius: 999,
      backgroundColor: colors.border,
      alignSelf: 'center',
    },
    title: {
      ...TYPOGRAPHY.title,
      color: colors.text,
    },
    subtitle: {
      ...TYPOGRAPHY.bodyMuted,
      color: colors.textMuted,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.gapSm,
    },
    chip: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: colors.surfaceMuted,
    },
    chipSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryMutedBg,
    },
    chipLabel: {
      ...TYPOGRAPHY.body,
      color: colors.text,
      fontWeight: '600',
    },
    chipLabelSelected: {
      color: colors.primary,
    },
    inputWrap: {
      gap: SPACING.gapXs,
    },
    input: {
      minHeight: 160,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: SPACING.radius,
      paddingHorizontal: SPACING.screenPadding,
      paddingVertical: 14,
      backgroundColor: colors.surfaceMuted,
      color: colors.text,
      ...TYPOGRAPHY.body,
    },
    counter: {
      ...TYPOGRAPHY.caption,
      color: colors.textMuted,
      textAlign: 'right',
    },
    error: {
      ...TYPOGRAPHY.caption,
      color: '#dc2626',
      fontWeight: '700',
    },
    actions: {
      gap: SPACING.gapSm,
    },
  });
}
