import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import {
  feedbackConstraints,
  submitFeedback,
} from './submitFeedback';
import type { FeedbackCategory } from './types';

const CATEGORY_OPTIONS: Array<{
  label: string;
  value: FeedbackCategory;
}> = [
  { label: 'Bug', value: 'bug' },
  { label: 'Idee', value: 'idea' },
  { label: 'Verbesserung', value: 'improvement' },
];

export type FeedbackSheetProps = {
  visible: boolean;
  bundleId: string | null;
  /** Optional origin, e.g. detail screen + entity id (appended to shared feedback). */
  contextNote?: string | null;
  onClose: () => void;
};

export function FeedbackSheet({
  visible,
  bundleId,
  contextNote = null,
  onClose,
}: FeedbackSheetProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = useCallback(() => {
    setCategory(null);
    setText('');
    setError(null);
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [reset, visible]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await submitFeedback({
        category,
        text,
        bundleId,
        contextNote,
      });
      handleClose();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Feedback konnte nicht geteilt werden.';
      setError(message);
      setIsSubmitting(false);
    }
  }, [bundleId, category, contextNote, handleClose, text]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

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
                    setCategory((current: FeedbackCategory | null) =>
                      current === option.value ? null : option.value,
                    );
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
              onChangeText={(value) => {
                setText(value);
                if (error) setError(null);
              }}
              placeholder="Was ist dir aufgefallen?"
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={feedbackConstraints.maxLength}
              textAlignVertical="top"
              style={styles.input}
            />
            <Text style={styles.counter}>
              {text.length}/{feedbackConstraints.maxLength}
            </Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <ButtonSecondary
              label="Abbrechen"
              onPress={handleClose}
              disabled={isSubmitting}
            />
            <ButtonPrimary
              label={isSubmitting ? 'Oeffnet ...' : 'Absenden'}
              onPress={() => {
                void handleSubmit();
              }}
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
